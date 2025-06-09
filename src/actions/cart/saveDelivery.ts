'use server'

import prisma from '@/lib/prisma'

type EntregaForm = {
  carritoId?: number
  tipo: 'RETIRO' | 'ENVIO'
  puntoRetiro?: string
  direccion?: string
  ciudad?: string
  provincia?: string
  codigoPostal?: string
  pais?: string
  contacto?: string
  telefono?: string
  observaciones?: string
  ventaId?:number
}

export async function saveDelivery(data: EntregaForm) {
  try {
    await prisma.entrega.create({
      data: {
        carritoId: data.carritoId,
        tipo: data.tipo, // Si usás enum en Prisma, podés castear así
        puntoRetiro: data.puntoRetiro || null,
        direccion: data.direccion || null,
        ciudad: data.ciudad || null,
        provincia: data.provincia || null,
        codigoPostal: data.codigoPostal || null,
        pais: data.pais || null,
        contacto: data.contacto || null,
        telefono: data.telefono || null,
        observaciones: data.observaciones || null,
        ventaId:data.ventaId
      },
    })

   return { status:'success'}
  } catch (error) {
    console.error('Error guardando entrega:', error)
    // throw new Error('No se pudo guardar la información de entrega.')
    return {status:'failed', message:'No se pudo guardar la información de entrega.'}
  }
}
