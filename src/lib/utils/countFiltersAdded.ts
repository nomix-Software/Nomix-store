// Recibe un string de searchParams (ej: location.search o searchParams.toString())
// y cuenta cuántos filtros están aplicados (categories, search, brands)
export const countFiltersAdded = (search: string) => {
  const params = new URLSearchParams(search);
  let count = 0;
  // Filtros múltiples (array):
  ["categorie", "brand"].forEach((key) => {
    const values = params.getAll(key);
    count += values.filter(Boolean).length;
  });
  return count;
};