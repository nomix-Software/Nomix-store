'use client';

import clsx from 'clsx';
import React from 'react';



export function Card({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={clsx(
        'rounded-2xl shadow-md bg-white border border-gray-200',
        className
      )}
      {...props}
    />
  );
}
