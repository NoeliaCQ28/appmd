import React from 'react'
import { Subtitle } from '../Subtitle'
import { FormInputText } from '@components/custom/inputs/FormInputText'

export const AlternadorForm = () => {
  return (
     <div className="py-6 space-y-7">
      <Subtitle> Alternardor </Subtitle>
          <div className='grid grid-cols-1 md:grid-cols-2 md:space-x-7 space-y-4 md:space-y-0'>
               <FormInputText
                    label={'Aislamiento'}
                    placeholder={'Aislamiento'}
               />
               <FormInputText
                    label={'Sistema de excitación'}
                    placeholder={'Sistema de excitación'}
               />
          </div>
          <div className='grid grid-cols-1 md:grid-cols-2 md:space-x-7 space-y-4 md:space-y-0'>
               <FormInputText
                    label={'Terjeta Reguladora Volt.'}
                    placeholder={'Terjeta Reguladora Volt.'}
               />
               <FormInputText
                    label={'Grado de protección'}
                    placeholder={'Grado de protección'}
               />
          </div>
     </div>
  )
}
