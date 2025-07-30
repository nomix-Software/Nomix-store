import RaspaYGana from '@/components/RaspaGana/RaspaGanaGame'
import React, { Suspense } from 'react'

 const RaspaGanaPage = () => {
  return (
    <main>
      <Suspense fallback={<div><p>Cargando Juego</p></div>}>
        <RaspaYGana/>
      </Suspense>
    </main>
  )
}
export default RaspaGanaPage