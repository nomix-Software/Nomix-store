'use client';

import clsx from 'clsx';
import React from 'react';


export function CardContent({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={clsx('p-6', className)} {...props} />
  );
}
