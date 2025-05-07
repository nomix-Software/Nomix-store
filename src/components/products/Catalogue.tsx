'use client'
import { notFound, useSearchParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { Product } from '../Product'
import { getProductsFiltered } from '@/actions'
import { LoadingOverlay } from '../ui/LoadingOverlay'
import { Pagination } from '../ui/Pagination'
import { ProductItem } from '@/interfaces'

export const Catalogue = () => {
    const searchParams = useSearchParams()
    const filterName = searchParams.get('search') || undefined
    const filterBrands = searchParams.getAll('brands') || undefined
    const filterCategories = searchParams.getAll('categories') || undefined
    const page = searchParams.get('page') || '1'
    const [productsResponse, setProductsResponse] = useState<{ currentPage:number, totalPages:number, products:ProductItem[] }>({ currentPage: Number(page), totalPages:1, products:[]})
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        (async () => {
            setLoading(true)
            try {
                const productsDB = await getProductsFiltered({ search: filterName, marcas: filterBrands, categorias: filterCategories,  page: page ? parseInt(page) : 1, });
                setProductsResponse(productsDB)
            } catch (error) {
                console.log({ error })
                notFound()
            }
            setLoading(false)
        })()
    }, [searchParams])
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

