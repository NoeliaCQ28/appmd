import React from 'react'

export const CheckboxText = ({label}) => {
  return (
     <div className='flex md:items-center md:justify-center space-x-2'>
          <input type="checkbox" className='size-6 cursor-pointer' />
          <label className='uppercase font-medium text-sm'>{label}</label>
     </div>
  )
}
