import React, { useEffect } from 'react'
import { FichaPdf } from '../FichaPdf'
import { PDFDownloadLink, PDFViewer } from '@react-pdf/renderer'
import { useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { getFichasTecnicas } from '../../services/fichasTecnicasService'

export const FichaPdfModal = () => {
  
     const { id } = useParams()

     const { data: fichaTecnica, isLoading, error } = useQuery({
          queryKey: ["FichaTecnica", id],
          queryFn: () => getFichasTecnicas({ selectModeloId: id }),
          retry: false,
     })

     if (isLoading) {
          return <div>Cargando...</div>
     }

     if (error) {
          return <div>Error al cargar la ficha técnica: {error.message}</div>
     }


     if (fichaTecnica && Object.keys(fichaTecnica).length > 0) {
          return (
               <div className="w-full h-screen">
                    <PDFViewer className="w-full h-full" >
                         <FichaPdf ficha={fichaTecnica} />
                    </PDFViewer>
                    <div className="mt-4 flex items-center justify-center">
                         <PDFDownloadLink 
                              className='bg-blue-600 text-center p-2 rounded-md text-gray-50 font-bold'
                              document={<FichaPdf ficha={fichaTecnica} />} 
                              fileName={`modasa-${fichaTecnica[0].sModNombre}`}>
                              {({ loading }) => (loading ? 'Cargando PDF...' : 'Descargar PDF')}
                         </PDFDownloadLink>
                    </div>
               </div>
          )
     }

     return <div>No hay datos disponibles para esta ficha técnica.</div>
}
