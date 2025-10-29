import React from 'react'
import { FormSelectText } from '@components/custom/selects/FormSelectText'
import { Accordion, AccordionTab } from 'primereact/accordion'
import { CardResumen } from '@components/CardResumen'
import { AccordionDescuento } from '@components/AccordionDescuento'

export const CeldasComponentsForm = () => {
  return (
     <div className='flex flex-col py-4'>
          <div className='space-y-7'>
               <FormSelectText 
                    label={'Tipo de celda'}
                    placeholder={'Seleccione celda'}
                    filter={true}
               />
               <Accordion>
                    <AccordionTab header={
                         <span className='uppercase font-semibold text-gray-950'>Accesorios mecánicos</span>
                    }>
                         <div className='space-y-4'>
                              <div className='flex flex-col md:flex-row md:items-center md:justify-between gap-3'>
                                   <div className='flex md:items-center gap-4'>
                                        <input type="checkbox" className='size-6 cursor-pointer' />
                                        <label className='uppercase font-medium text-sm'>{'Descripcion de prueba'}</label>
                                   </div>
                                   <span>{1092}</span>
                              </div>
                         </div>
                    </AccordionTab>
               </Accordion>

               <AccordionDescuento 
                    headerText={'Descuentos'}
                    radioOptions={[{id: 1, descripcion: "10 %", value: 10}, {id: 2, descripcion: "20 %", value: 20}]}
                    inputLabel={'Descuento'}
                    switchLabel={'Activar notificacion de descuento'}
               />

          </div>
          <CardResumen items={[]} total={9018} discount={12} />
     </div>
  )
}
