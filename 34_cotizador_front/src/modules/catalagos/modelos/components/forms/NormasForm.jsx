import React from 'react'
import { Subtitle } from '../Subtitle'
import { FormInputText } from '@components/custom/inputs/FormInputText'

export const NormasForm = () => {
  return (
     <div className="py-6 space-y-7">
      <Subtitle> Normas Técnicas </Subtitle>
          <FormInputText
               label={'Motor'}
               placeholder={'Motor'}
          />
          <FormInputText
               label={'Alternador'}
               placeholder={'Alternador'}
          />
          <FormInputText
               label={'Grupo eletrógeno'}
               placeholder={'Grupo eletrógeno'}
          />
     </div>
  )
}
