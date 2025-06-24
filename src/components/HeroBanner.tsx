import React from "react";
import { getLatestProducts } from "@/actions";
import { HeroSlider } from "./HeroSlider";

interface HeroBannerProps {
  heroBanner: {
    smallText: string;
    midText: string;
    largeText1: string;
    image: string;
    product: string;
    buttonText: string;
    desc: string;
  };
}


export const HeroBanner: React.FC<HeroBannerProps> = async () => {
  const productsLatest = await getLatestProducts();
if(!productsLatest) return null
  return (
<>
 <HeroSlider  products={productsLatest} />
</>
  );
};
