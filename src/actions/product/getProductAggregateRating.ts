import { getReviews } from "@/actions";

export async function getProductAggregateRating(productId: number) {
  const reviews = await getReviews(productId);
  if (!reviews || reviews.length === 0) return { averageRating: null, reviewsCount: 0 };
  const ratings = reviews.map(r => r.rating);
  const reviewsCount = ratings.length;
  const averageRating = reviewsCount > 0 ? ratings.reduce((a, b) => a + b, 0) / reviewsCount : null;
  return { averageRating, reviewsCount };
}
