'use server';

import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { revalidatePath } from 'next/cache';

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
 * @returns {Promise<{ numeros: number[] }>}
 */
export async function getOrGenerateWinningNumbers() {
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Normalizamos a la medianoche para la consulta

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

    return { numeros: juegoDeHoy.numerosGanadores };
  } catch (error) {
    console.error("Error en getOrGenerateWinningNumbers:", error);
    return { numeros: generateWinningNumbers() }; // Fallback para que el juego no se rompa
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
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return { success: false, message: "Necesitás iniciar sesión para jugar." };
  }
  const userId = session.user.id;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

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

      const matchCount = chosenNumbers.filter((n) => juegoDeHoy.numerosGanadores.includes(n)).length;
      const premio = getPremio(matchCount);

      if (!premio) {
        return { success: false, message: "No ganaste esta vez. ¡Probá mañana!" };
      }

      const couponCode = generateCouponCode();
      const validUntil = new Date();
      validUntil.setDate(validUntil.getDate() + 7); // Cupón válido por 7 días

      await tx.cuponDescuento.create({
        data: { codigo: couponCode, porcentaje: premio.porcentaje, descripcion: premio.descripcion, validoHasta: validUntil, maxUsos: 1, usuarioId: userId },
      });

      await tx.juegoRaspaGanaDiario.update({ where: { id: juegoDeHoy.id }, data: { ganadorId: userId } });

      return { success: true, message: `🎉 ¡Felicidades! Ganaste un cupón de ${premio.porcentaje}% de descuento. Tu código es: ${couponCode}` };
    });

    revalidatePath('/jugar'); // Revalida la página del juego
    return result;
  } catch (error) {
    console.error("Error en playRaspaGana:", error);
    return { success: false, message: "Ocurrió un error al procesar tu jugada. Inténtalo de nuevo." };
  }
}