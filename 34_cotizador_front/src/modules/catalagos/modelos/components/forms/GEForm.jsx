import React from 'react'
import { FormInputText } from '@components/custom/inputs/FormInputText'
import { Subtitle } from '../Subtitle'

export const GEForm = () => {
  return (
    <div className='py-6 space-y-7'>

          <Subtitle> Grupo electrógeno </Subtitle>

          <div className='grid grid-cols-1 md:grid-cols-2 md:space-x-7 space-y-4 md:space-y-0'>
               <FormInputText
                    label={'Motor'}
                    placeholder={'Motor'}
               />
               <FormInputText
                    label={'Alternador'}
                    placeholder={'Alternador'}
               />
          </div>
          <div className='grid grid-cols-1 md:grid-cols-3 md:space-x-7 space-y-4 md:space-y-0'>
               <FormInputText
                    label={'Módulo de control'}
                    placeholder={'Módulo de control'}
               />
               <FormInputText
                    label={'Fases'}
                    placeholder={'Fases'}
               />
               <FormInputText
                    label={'Sistema electrico'}
                    placeholder={'Sistema electrico'}
               />
          </div>
          <div className='grid grid-cols-1 md:grid-cols-2 md:space-x-7 space-y-4 md:space-y-0'>
               <FormInputText
                    label={'Tanque combustible abierto'}
                    placeholder={'Tanque combustible abierto'}
               />
               <FormInputText
                    label={'Tanque combustible insonoro'}
                    placeholder={'Tanque combustible insonoro'}
               />
          </div>
          <div className='grid grid-cols-1 md:grid-cols-3 md:space-x-7 space-y-4 md:space-y-0'>
               <FormInputText
                    label={'Radiador flujo aire'}
                    placeholder={'Radiador flujo aire'}
               />
               <FormInputText
                    label={'Combustión flujo aire'}
                    placeholder={'Combustión flujo aire'}
               />
               <FormInputText
                    label={'Gases de escape flujo'}
                    placeholder={'Gases de escape flujo'}
               />
          </div>
          <div className='grid grid-cols-1 md:grid-cols-3 md:space-x-7 space-y-4 md:space-y-0'>
               <FormInputText
                    label={'Temp. Gases de escape'}
                    placeholder={'Temp. Gases de escape'}
               />
               <FormInputText
                    label={'Nivel de ruido'}
                    placeholder={'Nivel de ruido'}
               />
               <FormInputText
                    label={'Ruido ambiental'}
                    placeholder={'Ruido ambiental'}
               />
          </div>
    </div>
  )
}
