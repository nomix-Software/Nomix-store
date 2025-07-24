'use client'


import { useSearchParams } from 'next/navigation'
import React, { useEffect } from 'react'
import { Product } from '../Product'

import { LoadingOverlay } from '../ui/LoadingOverlay'
import { Pagination } from '../ui/Pagination'
import { useAvailableFilters } from '@/store'
import { useProducts } from '@/hooks'
import { MdErrorOutline } from 'react-icons/md'
import { ProductsFilteredResponse } from '@/actions'

export const Catalogue = ({ initialData }: { initialData: ProductsFilteredResponse }) => {
  const productsResponse = initialData
  const { setAvailableBrands, setAvailableCategories } = useAvailableFilters(state => state)

  useEffect(() => {
    // Actualizamos los filtros disponibles cuando los datos cambian (tanto en carga inicial como en filtros)
    if (productsResponse?.filtrosDisponibles) {
      setAvailableBrands(productsResponse.filtrosDisponibles.marcas)
      setAvailableCategories(productsResponse.filtrosDisponibles.categorias)
    }
  }, [productsResponse, setAvailableBrands, setAvailableCategories])


  return (
    <div className='flex flex-col justify-between items-center w-full !px-2 sm:px-6 xl:px-16'>
      <div className="grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))] place-items-center gap-4 w-full  justify-center
        [grid-auto-flow:row] [grid-auto-rows:auto]">
        {productsResponse?.products && productsResponse.products.length > 0 ? productsResponse.products.map((product, index) => (
          <div key={`${product.slug}-${index}`} className="w-full flex justify-center !mx-3">
            <Product product={{ ...product, id: Number(product._id) }} size='large' />
          </div>
        )) : (
          <div className="col-span-full flex flex-col items-center justify-center h-96 text-center w-full">
            <p className="text-xl font-medium text-gray-700">
              No se encontraron productos con esos filtros.
            </p>
          </div>
        )}
      </div>
      {productsResponse && productsResponse?.totalPages > 1 &&
        <Pagination currentPage={productsResponse?.currentPage} totalPages={productsResponse?.totalPages} />
      }
    </div>
  )
}
