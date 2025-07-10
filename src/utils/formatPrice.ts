export function formatPrice(value: number, currency: string = 'ARS', locale: string = 'es-AR') {
  // Asegura que value sea un número, y fuerza el formato correcto
  return Number(value).toLocaleString(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
    useGrouping: true,
  });
}
