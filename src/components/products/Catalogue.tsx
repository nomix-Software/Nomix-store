'use client'
import { useSearchParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { Product, ProductProps } from '../Product'
import { getProductsFiltered } from '@/actions'
import { LoadingOverlay } from '../ui/LoadingOverlay'

export const Catalogue = () => {
    const searchParams = useSearchParams()
    const filterName = searchParams.get('search') || undefined
    const filterBrands = searchParams.getAll('brands') || undefined
    const filterCategories = searchParams.getAll('categories') || undefined
    const [products, setProducts] = useState<ProductProps['product'][]>([])
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        (async () => {
            setLoading(true)
            try {
                const productsDB = await getProductsFiltered({ search: filterName, marcas: filterBrands, categorias: filterCategories });
                setProducts(productsDB)
            } catch (error) {
                console.log({ error })
                setProducts([])
            }
            setLoading(false)
        })()
    }, [searchParams])
    if (loading) return <LoadingOverlay  text='Cargando productos...' />
    return (
        <div className="flex flex-row flex-wrap gap-4 w-full bg-gray-50 justify-center">
            {products.map((product, index) => (
                <div key={`${product.slug}-${index}`} className="w-[300px]">
                    <Product product={product} />
                </div>
            ))} 
        </div>
    )
}

