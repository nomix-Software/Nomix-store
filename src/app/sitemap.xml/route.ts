'use server'

import { ProductItem } from '@/interfaces';
import { NextResponse } from 'next/server';
import { getProducts } from '@/actions/product/ProductsItems';

export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL ;
  const staticUrls = [
    '',
    '/catalogo',
    '/auth/login',
  ];


  // Obtener productos directamente desde la base de datos usando server action
  // getProducts actualmente trae solo 10 productos, ajusta la función si necesitas más
  const products: ProductItem[] = await getProducts({ take: 2000 });
  const productUrls: string[] = Array.isArray(products)
    ? products.map((p: ProductItem) => `/product/${p.slug.current}`)
    : [];

  const urls = [...staticUrls, ...productUrls];

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${urls
    .map(
      (url) => `
    <url>
      <loc>${baseUrl}${url}</loc>
      <changefreq>weekly</changefreq>
      <priority>${url === '' ? '1.0' : '0.8'}</priority>
    </url>`
    )
    .join('')}
</urlset>`;

  return new NextResponse(sitemap, {
    headers: {
      'Content-Type': 'application/xml',
    },
  });
}
