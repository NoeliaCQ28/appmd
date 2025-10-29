import React from 'react'
import { Subtitle } from '../Subtitle'
import { FormInputText } from '@components/custom/inputs/FormInputText'
import { FormSelectText } from '@components/custom/selects/FormSelectText'

export const DimensionesForm = () => {
  return (
     <div className="py-6 space-y-7">
      <Subtitle> Dimensiones </Subtitle> 
          <div className='grid grid-cols-1 gap-y-4 xs:grid-cols-2 xs:gap-y-5 xs:gap-x-4 md:grid-cols-3 lg:grid-cols-5'>
               <FormInputText
                    label={'A'}
                    placeholder={'A'}
               />
               <FormInputText
                    label={'B'}
                    placeholder={'B'}
               />
               <FormInputText
                    label={'C'}
                    placeholder={'C'}
               />
               <FormInputText
                    label={'Peso'}
                    placeholder={'Peso'}
               />
               <FormInputText
                    label={'& Esc'}
                    placeholder={'& Esc'}
               />
          </div> 
          <div className='grid grid-cols-1 gap-y-4 xs:grid-cols-2 xs:gap-y-5 xs:gap-x-4 md:grid-cols-3 lg:grid-cols-5'>
               <FormInputText
                    label={'X'}
                    placeholder={'X'}
               />
               <FormInputText
                    label={'Y'}
                    placeholder={'Y'}
               />
               <FormInputText
                    label={'Z'}
                    placeholder={'Z'}
               />
               <FormInputText
                    label={'Peso'}
                    placeholder={'Peso'}
               />
               <FormInputText
                    label={'& Esc'}
                    placeholder={'& Esc'}
               />
          </div>
          <FormSelectText 
               label={'Imagen de las dimensiones'}
               placeholder={'Seleccione imagen'}
          />
     </div>
  )
}
