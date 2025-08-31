'use server';

import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { revalidatePath } from 'next/cache';
import { sendCouponWonEmail } from '../sendEmail/sendCouponWonEmail';

const NUMBER_POOL = 90;
const WINNING_NUMBERS_COUNT = 10;

/**
 * Genera un array de números ganadores únicos y ordenados.
 * @returns {number[]} Un array de números ganadores.
 */
function generateWinningNumbers(): number[] {
  const winners = new Set<number>();
  while (winners.size < WINNING_NUMBERS_COUNT) {
    const randomNumber = Math.floor(Math.random() * NUMBER_POOL) + 1;
    winners.add(randomNumber);
  }
  return Array.from(winners).sort((a, b) => a - b);
}

/**
 * Obtiene o crea los números ganadores para el día actual.
 * Los busca en la base de datos y, si no existen, los genera y los guarda.
 * @returns {Promise<{ numeros: number[]; premioReclamado: boolean; usuarioYaJugo: boolean; }>}
 */
export async function getOrGenerateWinningNumbers() {
  // Normalizamos la fecha a UTC para evitar problemas de zona horaria y duplicados
  const now = new Date();
  const today = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));

  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;

  try {
    // 1. Buscar si ya existen números para hoy
    let juegoDeHoy = await prisma.juegoRaspaGanaDiario.findUnique({
      where: { fecha: today },
    });

    // 2. Si no existen, crearlos y guardarlos
    if (!juegoDeHoy) {
      const nuevosNumeros = generateWinningNumbers();
      juegoDeHoy = await prisma.juegoRaspaGanaDiario.create({
        data: { fecha: today, numerosGanadores: nuevosNumeros },
      });
    }

    let usuarioYaJugo = false;
    if (userId && juegoDeHoy) {
      const intento = await prisma.juegoRaspaGanaIntento.findUnique({
        where: {
          usuarioId_juegoId: {
            usuarioId: userId,
            juegoId: juegoDeHoy.id,
          },
        },
      });
      usuarioYaJugo = !!intento;
    }

    return { numeros: juegoDeHoy.numerosGanadores, premioReclamado: !!juegoDeHoy.ganadorId, usuarioYaJugo };

  } catch (error) {
    console.error("Error en getOrGenerateWinningNumbers:", error);
    return { numeros: generateWinningNumbers(), premioReclamado: false, usuarioYaJugo: false }; // Fallback
  }
}

/**
 * Genera un código de cupón único.
 * @returns {string}
 */
function generateCouponCode(): string {
  const prefix = 'RASPA';
  const randomPart = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `${prefix}${randomPart}`;
}

/**
 * Determina el premio según la cantidad de aciertos.
 * @param {number} matches - Número de aciertos.
 * @returns {{ porcentaje: number; descripcion: string } | null}
 */
const getPremio = (matches: number): { porcentaje: number; descripcion: string } | null => {
  if (matches === 3) return { porcentaje: 5, descripcion: "Premio por 3 aciertos en Raspá y Ganá" };
  if (matches === 4) return { porcentaje: 30, descripcion: "Premio por 4 aciertos en Raspá y Ganá" };
  if (matches === 5) return { porcentaje: 60, descripcion: "Premio por 6 o más aciertos en Raspá y Ganá" };
  if (matches >= 6) return { porcentaje: 80, descripcion: "Premio por 6 o más aciertos en Raspá y Ganá" };
  return null;
};

/**
 * Procesa la jugada del usuario, valida y otorga el premio si corresponde.
 * @param {number[]} chosenNumbers - Los números elegidos por el usuario.
 * @returns {Promise<{success: boolean, message: string}>}
 */
export async function playRaspaGana(chosenNumbers: number[]) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id || !session.user.email) {
    return { success: false, message: "Necesitás iniciar sesión para jugar." };
  }
  const userId = session.user.id;
  const userEmail = session.user.email;

  // Normalizamos la fecha a UTC para evitar problemas de zona horaria y duplicados
  const now = new Date();
  const today = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));

  try {
    const result = await prisma.$transaction(async (tx) => {
      const juegoDeHoy = await tx.juegoRaspaGanaDiario.findUnique({
        where: { fecha: today },
      });

      if (!juegoDeHoy) {
        return { success: false, message: "El juego de hoy aún no ha comenzado. Intenta de nuevo." };
      }

      if (juegoDeHoy.ganadorId) {
        return { success: false, message: "Alguien ya se llevó el premio de hoy. ¡Más suerte mañana!" };
      }

      // Validar si el usuario ya jugó hoy
      const intentoPrevio = await tx.juegoRaspaGanaIntento.findUnique({
        where: {
          usuarioId_juegoId: {
            usuarioId: userId,
            juegoId: juegoDeHoy.id,
          },
        },
      });

      if (intentoPrevio) {
        return { success: false, message: "Ya participaste hoy. ¡Volvé a intentarlo mañana!" };
      }

      // Registrar el intento del usuario ANTES de procesar el resultado.
      await tx.juegoRaspaGanaIntento.create({
        data: { usuarioId: userId, juegoId: juegoDeHoy.id },
      });

      const matchCount = chosenNumbers.filter((n) => juegoDeHoy.numerosGanadores.includes(n)).length;
      const premio = getPremio(matchCount);

      if (!premio) {
        // El usuario jugó pero no ganó. El intento ya está registrado.
        return { success: false, message: `Tuviste ${matchCount} aciertos. No es suficiente para ganar un premio. ¡Más suerte mañana!` };
      }

      // El usuario ganó.
      const couponCode = generateCouponCode();
      const validUntil = new Date();
      validUntil.setDate(validUntil.getDate() + 7); // Cupón válido por 7 días

      await tx.cuponDescuento.create({
        data: { codigo: couponCode, porcentaje: premio.porcentaje, descripcion: premio.descripcion, validoHasta: validUntil, maxUsos: 1, usuarioId: userId },
      });

      await tx.juegoRaspaGanaDiario.update({ where: { id: juegoDeHoy.id }, data: { ganadorId: userId } });

      return {
        success: true,
        message: `🎉 ¡Felicidades! Ganaste un cupón de ${premio.porcentaje}% de descuento. Revisa tu correo para ver el código.`,
        coupon: {
          code: couponCode,
          percentage: premio.porcentaje,
        },
      };
    });

    if (result.success && result.coupon) {
      await sendCouponWonEmail(userEmail, result.coupon.code, result.coupon.percentage);
      if(process.env.ADMIN_EMAIL){
        await sendCouponWonEmail(process.env.ADMIN_EMAIL, result.coupon.code, result.coupon.percentage);
      }
    }

    revalidatePath('/raspa-gana'); // Revalida la página del juego
    return { success: result.success, message: result.message };
  } catch (error) {
    console.error("Error en playRaspaGana:", error);
    return { success: false, message: "Ocurrió un error al procesar tu jugada. Inténtalo de nuevo." };
  }
}