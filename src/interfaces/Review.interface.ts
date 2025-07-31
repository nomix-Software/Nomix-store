export interface Review {
  id: number;
  usuario: { id: string; name: string };
  rating: number;
  comentario: string;
  createdAt: string;
}
