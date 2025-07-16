"use client";
import { useState } from "react";
import { Button } from "../ui/Button";
import { Card } from "../ui/Card";
import { CardContent } from "../ui/CardContent";

const MAX_ATTEMPTS = 10;
const NUMBER_POOL = 90;
const WINNING_NUMBERS = [3, 14, 27, 32, 48, 60, 68, 80, 85, 90]; // simulado

export default function RaspaYGana() {
  const [chosen, setChosen] = useState<number[]>([]);
  const [revealed, setRevealed] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  const toggleNumber = (n: number) => {
    if (revealed) return;
    if (chosen.includes(n)) {
      setChosen(chosen.filter((c) => c !== n));
    } else if (chosen.length < MAX_ATTEMPTS) {
      setChosen([...chosen, n]);
    }
  };

  const getPremio = (number: number) => {
    if (number === 3) return "5%";
    if (number === 4) return "30%";
    if (number === 5) return "60%";
    if (number === 6) return "80%";
  };

  const play = () => {
    if (chosen.length === 0) return;
    setRevealed(true);
    const match = chosen.filter((n) => WINNING_NUMBERS.includes(n)).length;
    if (match >= 3) {
      setResult(`🎉 ¡Ganaste un cupón de descuento de ${getPremio(match)}!`);
    } else {
      setResult("😢 No ganaste esta vez. ¡Probá mañana!");
    }
  };

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
                ${revealed && WINNING_NUMBERS.includes(num) ? "!bg-green-500 !text-white" : ""}
                ${chosen.includes(num) ? "!bg-[#f02d34] !text-white" : "!bg-gray-200 !text-gray-800"}
                ${revealed && !WINNING_NUMBERS.includes(num) ? "opacity-50" : ""}
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
              disabled={chosen.length === 0}
              className="!mb-4 cursor-pointer"
            >
              ¡Raspar!
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
