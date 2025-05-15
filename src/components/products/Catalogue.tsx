'use client'


import { useSearchParams } from 'next/navigation'
import React, { useEffect } from 'react'
import { Product } from '../Product'

import { LoadingOverlay } from '../ui/LoadingOverlay'
import { Pagination } from '../ui/Pagination'
import { useAvailableFilters } from '@/store'
import { useProducts } from '@/hooks'
import { MdBuild } from 'react-icons/md'

export const Catalogue = () => {
  const searchParams = useSearchParams()
  const { setAvailableBrands, setAvailableCategories } = useAvailableFilters(state => state)
  const { productos: productsResponse, isLoading, isError } = useProducts(`/api/products?${searchParams.toString()}`)
  useEffect(() => {
    if (!isLoading) {
      setAvailableBrands(productsResponse.filtrosDisponibles.marcas)
      setAvailableCategories(productsResponse.filtrosDisponibles.categorias)
    }
  }, [isLoading])


  if (isLoading) return <LoadingOverlay text='Cargando productos...' />

    if (isError) {
      return (
        <div className="flex flex-col items-center justify-center h-96 text-center w-full">
          <MdBuild  className="text-gray-500 text-6xl mb-4" />
          <p className="text-xl font-medium text-gray-700">
            Ocurrió un error al cargar los resultados.
          </p>
        </div>
      );
    }
  return (
    <div className='flex flex-col justify-between items-center'>
      <div className="flex flex-row flex-wrap gap-4 w-full bg-gray-50 justify-center">
        {productsResponse?.products.map((product, index) => (
          <div key={`${product.slug}-${index}`} >
            <Product product={{ ...product, id: Number(product._id) }} size='small' />
          </div>
        ))}
      </div>
      {productsResponse?.totalPages > 1 &&
        <Pagination currentPage={productsResponse?.currentPage} totalPages={productsResponse?.totalPages} />
      }
    </div>
  )
}

