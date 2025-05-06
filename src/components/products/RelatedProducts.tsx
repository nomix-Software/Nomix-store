'use client'
import { getRelatedProducts } from '@/actions'
import { ProductItem } from '@/interfaces'
import React, { useEffect, useState } from 'react'
import { Product } from '../Product'

interface Props {
    categoriaId: number
    marcaId: number
    productId: number
}
export const RelatedProducts = ({ categoriaId, marcaId, productId }: Props) => {
    const [loading, setLoading] = useState(true)
    const [relatedProducts, setRelatedProducts] = useState<ProductItem[]>([])


    useEffect(() => {

        (async () => {
            try {
                const fetchedRelatedProducts = await getRelatedProducts(
                    categoriaId,
                    marcaId
                );
                setRelatedProducts(
                    fetchedRelatedProducts.filter(
                        (item) => item._id !== String(productId)
                    )
                );
            } catch (error) {
                console.log({ error })
                setRelatedProducts([])
            }
            setLoading(false)
        })()

    }, [])
    if (loading) return (<div className="flex justify-center items-center h-screen">
        Loading...
    </div>)
    if(relatedProducts.length === 0) return null
    return (

        <div className="maylike-products-wrapper">
            <h2>También te puede interesar</h2>
            <div className="marquee">
                <div className="maylike-products-container track">
                    {relatedProducts.map((item: ProductItem) => (
                        <Product key={item._id} product={item} />
                    ))}
                </div>
            </div>
        </div>
    )
}


