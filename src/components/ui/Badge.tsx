// components/ui/badge.tsx


import clsx from "clsx";
import React from "react";



export function Badge({ className, ...props }: React.HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={clsx(
        "inline-flex items-center rounded-full bg-gray-200 px-2.5 py-0.5 text-xs font-semibold text-gray-800",
        className
      )}
      {...props}
    />
  );
}
