import { getAllCupons } from "@/actions";
import { CuponDescuento } from "@prisma/client";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export const useCupons = () => {
  const [allcuponsOptions, setAllcuponsOptions] = useState<CuponDescuento[]>(
    []
  );
  useEffect(() => {
    (async () => {
      getAllCupons()
        .then((data) => setAllcuponsOptions(data))
        .catch(() =>
          toast.error("No se pudo obtener los cupones de descuento")
        );
    })();
  }, []);
  return { allcuponsOptions };
};
