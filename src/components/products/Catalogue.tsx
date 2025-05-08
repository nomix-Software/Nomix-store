'use client'


import { useSearchParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { Product } from '../Product'

import { LoadingOverlay } from '../ui/LoadingOverlay'
import { Pagination } from '../ui/Pagination'
import { ProductItem } from '@/interfaces'
import { useAvailableFilters } from '@/store'

export const Catalogue = () => {
    const searchParams = useSearchParams()
    const page = searchParams.get('page') || '1'
    const [productsResponse, setProductsResponse] = useState<{ currentPage:number, totalPages:number, products:ProductItem[] }>({ currentPage: Number(page), totalPages:1, products:[]})
    const [loading, setLoading] = useState(false)
     const { setAvailableBrands, setAvailableCategories}= useAvailableFilters(state => state)
    useEffect(() => {
        let loadingTimeout: NodeJS.Timeout;
      
        const fetchData = async () => {
          loadingTimeout = setTimeout(() => setLoading(true), 200); // solo si tarda >200ms
          try {
            const res = await fetch(`/api/products?${searchParams.toString()}`);
            const { filtrosDisponibles ,...data} = await res.json();
            setAvailableBrands(filtrosDisponibles.marcas)
            setAvailableCategories(filtrosDisponibles.categorias)
            setProductsResponse(data);
          } catch (error) {
            console.error(error);
          } finally {
            clearTimeout(loadingTimeout);
            setLoading(false);
          }
        };
      
        fetchData();
        return () => clearTimeout(loadingTimeout);
      }, [searchParams]);
      
    if (loading) return <LoadingOverlay  text='Cargando productos...' />
    return (
        <div className='flex flex-col justify-between items-center'>
        <div className="flex flex-row flex-wrap gap-4 w-full bg-gray-50 justify-center">
            {productsResponse?.products.map((product, index) => (
                <div key={`${product.slug}-${index}`} className="w-[300px]">
                    <Product product={product} />
                </div>
            ))} 
        </div>
            {productsResponse?.totalPages >1 && 
            <Pagination currentPage={productsResponse?.currentPage} totalPages={productsResponse?.totalPages} />
            }
        </div>
    )
}

