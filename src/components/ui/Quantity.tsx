'use client";';
import React from "react";
import { AiOutlineMinus, AiOutlinePlus } from "react-icons/ai";

interface QuantityProps {
  quantity: number;
  onChange: (value: number, action: "substract" | "add") => void;
}
export const Quantity = ({ quantity = 1, onChange }: QuantityProps) => {
  const onValueChanged = (value: number, operation: "add" | "remove") => {
    console.log("value", value);
    if (operation === "remove") {
      if (quantity === 0) return;
      onChange(quantity - 1, "substract");
      return;
    } else {
      onChange(quantity + 1, "add");
    }
  };

  return (
    <div className=" flex flex-row gap-2  items-center">
      <h3 className="font-bold">Cantidad:</h3>
      <div className="flex flex-row gap-2 justify-around items-center border-1 border-black-300 w-25 rounded-md p-2">
        <span
          className="cursor-pointer"
          onClick={() => onValueChanged(quantity, "remove")}
        >
          <AiOutlineMinus color="red" />
        </span>
        <span className="font-bold">{quantity}</span>
        <span
          className="cursor-pointer"
          onClick={() => onValueChanged(quantity, "add")}
        >
          <AiOutlinePlus color="green" />
        </span>
      </div>
    </div>
  );
};
