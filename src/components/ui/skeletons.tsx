const shimmer =
  'before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_2s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/60 before:to-transparent';

const ProductCardSkeleton = () => (
  <div className={`${shimmer} relative overflow-hidden rounded-xl bg-gray-200 p-2 shadow-sm`}>
    <div className="flex flex-col h-full justify-between">
      <div className="bg-gray-300 h-40 w-full rounded-lg"></div>
      <div className="mt-2 h-4 bg-gray-300 rounded w-3/4"></div>
      <div className="mt-1 h-4 bg-gray-300 rounded w-1/2"></div>
    </div>
  </div>
);

export const CatalogueSkeleton = () => (
  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
    {[...Array(6)].map((_, i) => (
      <ProductCardSkeleton key={i} />
    ))}
  </div>
);

export const FiltersSkeleton = () => (
  <div className={`${shimmer} relative overflow-hidden rounded-xl bg-gray-200 p-4`}>
    <div className="h-6 bg-gray-300 rounded w-1/2 mb-4"></div>
    <div className="space-y-2">
      <div className="h-4 bg-gray-300 rounded w-3/4"></div>
      <div className="h-4 bg-gray-300 rounded w-full"></div>
      <div className="h-4 bg-gray-300 rounded w-5/6"></div>
    </div>
  </div>
);