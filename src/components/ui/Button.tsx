'use client';

import clsx from 'clsx';
import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary';
}

export function Button({
  children,
  className,
  variant = 'primary',
  ...props
}: ButtonProps) {
  const baseStyles =
    '!px-4 !py-2 rounded-xl font-medium transition-colors duration-300 focus:outline-none';

  const variants = {
    primary: 'bg-[#f02d34] text-white hover:bg-[#d9292e]',
    secondary: 'bg-gray-100 text-gray-800 hover:bg-gray-200',
  };

  return (
    <button
      className={clsx(baseStyles, variants[variant], className)}
      {...props}
    >
      {children}
    </button>
  );
}
