'use server'
import { NextResponse } from 'next/server';

export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL ;
  const staticUrls = [
    '',
    '/catalogo',
    '/auth/login',
  ];

  // Obtener productos dinámicamente desde el endpoint local
  const res = await fetch(`${baseUrl}/api/products?take=2000`, { next: { revalidate: 3600 } });
  let productUrls: string[] = [];
  if (res.ok) {
    const data = await res.json();
    if (Array.isArray(data.products)) {
      productUrls = data.products.map((p: any) => `/product/${p.slug.current}`);
    }
  }

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
