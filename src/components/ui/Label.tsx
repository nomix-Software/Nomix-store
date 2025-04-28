import React from "react";

export const Label = ({ label }: { label?: string }) => {
  return (
    <label className="!px-1 block text-sm font-semibold text-[#324d67] mb-1">
      {label}
    </label>
  );
};
