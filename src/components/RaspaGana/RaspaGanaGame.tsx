"use client";
import { useState, useEffect } from "react";
import { Button } from "../ui/Button";
import { Card } from "../ui/Card";
import { CardContent } from "../ui/CardContent";
import { getOrGenerateWinningNumbers, playRaspaGana } from "@/actions";

const MAX_ATTEMPTS = 10;
const NUMBER_POOL = 90;

export default function RaspaYGana() {
  const [chosen, setChosen] = useState<number[]>([]);
  const [revealed, setRevealed] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [prizeClaimed, setPrizeClaimed] = useState(false);
  const [userHasPlayed, setUserHasPlayed] = useState(false);

  useEffect(() => {
    const fetchWinningNumbers = async () => {
      setIsLoading(true);
      const { premioReclamado, usuarioYaJugo } = await getOrGenerateWinningNumbers();
      setPrizeClaimed(premioReclamado);
      setUserHasPlayed(usuarioYaJugo);
      setIsLoading(false);
    };

    fetchWinningNumbers();
  }, []);

  const toggleNumber = (n: number) => {
    if (revealed) return;
    if (chosen.includes(n)) {
      setChosen(chosen.filter((c) => c !== n));
    } else if (chosen.length < MAX_ATTEMPTS) {
      setChosen([...chosen, n]);
    }
  };

  const play = async () => {
    if (chosen.length === 0 || revealed || isSubmitting) return;

    setIsSubmitting(true);
    setRevealed(true);

    try {
      const response = await playRaspaGana(chosen);
      setResult(response.message);
    } catch (error) {
      console.error(error);
      setResult("Ocurrió un error. Por favor, intenta de nuevo.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-6xl !mx-auto !p-4 text-center text-gray-600">
        <p>Cargando el juego de hoy...</p>
      </div>
    );
  }

  if (prizeClaimed) {
    return (
      <div className="max-w-6xl !mx-auto !p-4 text-center">
        <Card>
          <CardContent className="!p-6">
            <h2 className="text-2xl font-bold text-[#f02d34] !mb-3">¡El premio de hoy ya fue reclamado!</h2>
            <p className="text-gray-700">Un afortunado jugador ya se llevó el cupón del día. ¡Mucha suerte para mañana!</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (userHasPlayed) {
    return (
      <div className="max-w-6xl !mx-auto !p-4 text-center">
        <Card>
          <CardContent className="!p-6">
            <h2 className="text-2xl font-bold text-[#f02d34] !mb-3">Ya hiciste tu intento de hoy</h2>
            <p className="text-gray-700">¡Gracias por participar! Recordá que solo se permite un intento por día.</p>
            <p className="text-gray-700 !mt-2">¡Volvé mañana para probar tu suerte de nuevo!</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-6xl !mx-auto !p-4 grid md:grid-cols-3 gap-8">
      {/* Columna izquierda: juego */}
      <div className="md:col-span-2">
        <h1 className="text-2xl font-bold text-[#f02d34] !mb-4 text-center">
          Raspá y Ganá con tus Números
        </h1>
        <p className="text-gray-700 !mb-6 text-center">
          Elegí hasta {MAX_ATTEMPTS} números del 1 al {NUMBER_POOL} y descubrí si
          ganaste un premio.
        </p>

        <div className="grid grid-cols-6 gap-2 !mb-6 justify-center">
          {Array.from({ length: NUMBER_POOL }, (_, i) => i + 1).map((num) => (
            <button
              key={num}
              onClick={() => toggleNumber(num)}
              className={`w-10 h-10 rounded-full text-sm font-semibold transition-colors duration-200
                ${chosen.includes(num) ? "!bg-[#f02d34] !text-white" : "!bg-gray-200 !text-gray-800"}
                ${revealed && !chosen.includes(num) ? "opacity-50" : ""}
              `}
              disabled={revealed}
            >
              {num}
            </button>
          ))}
        </div>

        {!revealed && (
          <div className="text-center">
            <Button
              onClick={play}
              disabled={chosen.length === 0 || revealed || isSubmitting}
              className="!mb-4 cursor-pointer"
            >
              {isSubmitting ? "Procesando..." : "¡Raspar!"}
            </Button>
          </div>
        )}

        {result && (
          <Card className="!mt-4">
            <CardContent className="!p-4 text-lg font-medium text-gray-700 text-center">
              {result}
            </CardContent>
          </Card>
        )}
      </div>

      {/* Columna derecha: tabla de premios */}
      <div className="bg-gray-100 rounded-xl !p-4 shadow-sm h-fit">
        <h2 className="text-lg font-semibold !mb-4 text-gray-800">
          Premios posibles
        </h2>
        <ul className="space-y-2 text-sm text-gray-700">
          <li className="flex justify-between border-b pb-2">
            <span>3 aciertos</span>
            <span className="font-bold text-green-600">5% OFF</span>
          </li>
          <li className="flex justify-between border-b pb-2">
            <span>4 aciertos</span>
            <span className="font-bold text-green-600">30% OFF</span>
          </li>
          <li className="flex justify-between border-b pb-2">
            <span>5 aciertos</span>
            <span className="font-bold text-green-600">60% OFF</span>
          </li>
          <li className="flex justify-between">
            <span>6 aciertos</span>
            <span className="font-bold text-green-600">80% OFF</span>
          </li>
        </ul>
        <p className="text-xs text-gray-500 !mt-4">
          * Los premios son simulados por ahora. Versión beta sin valor real.
        </p>
      </div>
    </div>
  );
}
