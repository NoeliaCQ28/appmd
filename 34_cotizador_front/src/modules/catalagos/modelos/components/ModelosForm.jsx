import React from 'react'
import { FormSelectText } from '@components/custom/selects/FormSelectText'
import { FormInputText } from '@components/custom/inputs/FormInputText'
import { GEForm } from './forms/GEForm'
import { MotorForm } from './forms/MotorForm'
import { AlternadorForm } from './forms/AlternadorForm'
import { NormasForm } from './forms/NormasForm'
import { DimensionesForm } from './forms/DimensionesForm'
import { OpcionalesForm } from './forms/OpcionalesForm'
import { TableroControlForm } from './forms/TableroControlForm'


export const ModelosForm = () => {
  return (
     <div className="w-full relative">
          <div className="py-6 space-y-7">
               <div>
                    <FormSelectText 
                         label={'Modelo base'}
                         placeholder={'Seleccionar modelo base'}
                    />
               </div>

               <div className='flex flex-col md:flex-row md:gap-20 space-y-6 md:space-y-0'>
                    <div className='md:w-2/3'>
                         <FormInputText
                              label={'Nombre del modelo'}
                              placeholder={'Nombre del modelo'}
                         />
                    </div>
                    <div className='flex md:items-center md:justify-center space-x-2'>
                         <input type="checkbox" className='size-6 cursor-pointer' />
                         <label className='uppercase font-medium text-sm'>Es modelo base</label>
                    </div>
               </div>
               <div className='grid grid-cols-1 md:grid-cols-3 md:space-x-7 space-y-4 md:space-y-0'>
                    <FormInputText
                         label={'Potencia prime'}
                         placeholder={'Potencia Prime'}
                    />
                    <FormInputText
                         label={'Potencia Stand By'}
                         placeholder={'Potencia Stand By'}
                    />
                    <FormInputText
                         label={'Voltaje'}
                         placeholder={'Voltaje'}
                    />
               </div>
               <div className='grid grid-cols-1 md:grid-cols-3 md:space-x-7 space-y-4 md:space-y-0'>
                    <FormInputText
                         label={'Frecuencia'}
                         placeholder={'Frecuencia'}
                    />
                    <FormInputText
                         label={'Factor de potencia'}
                         placeholder={'Factor de potencia'}
                    />
                    <FormInputText
                         label={'Amperaje'}
                         placeholder={'Amperaje'}
                    />
               </div>
               <FormSelectText 
                    label={'Imagen del grupo electrógeno insonoro'}
                    placeholder={'Seleccione imagen'}
               />
               <FormSelectText 
                    label={'Imagen del grupo electrógeno abierto'}
                    placeholder={'Seleccione imagen'}
               />
          </div>
          <GEForm />
          <MotorForm />
          <AlternadorForm />
          <NormasForm />
          <DimensionesForm />
          <OpcionalesForm />
          <TableroControlForm />
     </div>
  )
}
