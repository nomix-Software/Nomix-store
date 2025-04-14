export interface ProductItem {
  _id: string;
  image: string;
  name: string;
  slug: {
    current: string;
  };
  price: number;
}
