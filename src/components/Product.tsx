import React from "react";
import Link from "next/link";
import Image from "next/image";

// import { urlFor } from "../lib/client";

interface ProductProps {
  product: {
    image: string;
    name: string;
    slug: { current: string };
    price: number;
  };
}

export const Product = ({
  product: { image, name, slug, price },
}: ProductProps) => {
  return (
    <div>
      <Link href={`/product/${slug.current}`}>
        <div className="product-card">
          <Image
            src={image || ""}
            width={250}
            height={250}
            className="product-image"
            alt="product image"
          />
          <p className="product-name">{name}</p>
          <p className="product-price">${price}</p>
        </div>
      </Link>
    </div>
  );
};
