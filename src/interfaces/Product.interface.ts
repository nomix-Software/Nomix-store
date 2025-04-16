export interface ProductItem {
  _id: string;
  image: string;
  name: string;
  slug: {
    current: string;
  };
  price: number;
  stock: number;
}

export interface RequestProduct {
  name: string;
  description: string;
  price: string;
  category: string;
  brand: string;
  images: {
    url: string;
  }[];
}
