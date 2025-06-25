import React from "react";
import { getLatestProducts } from "@/actions";
import { HeroSlider } from "./HeroSlider";



export const HeroBanner: React.FC = async () => {
  const productsLatest = await getLatestProducts();
if(!productsLatest) return null
  return (
<>
 <HeroSlider  products={productsLatest} />
</>
  );
};
