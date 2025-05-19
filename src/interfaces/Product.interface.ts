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
  stock:string
  images: {
    url: string;
    publicId: string;
  }[];
}

export interface ProductDetails {
  categoria: {
    id: number;
    nombre: string;
  };
  marca: {
    id: number;
    nombre: string;
  };
  promocion: {
    id: number;
    descripcion: string;
    descuento: number;
  } | null;
  imagenes: {
    id: number;
    url: string;
    publicId: string;
  }[];
  nombre: string;
  precio: number;
  descripcion: string;
  stock: number;
  id: number;
  slug: string;
}
