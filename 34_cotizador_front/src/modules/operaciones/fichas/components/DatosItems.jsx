import React from 'react'

export const DatosItems = ({item, label, medida, className}) => {
  return (
     <div className={`grid grid-cols-1 sm:grid-cols-2 gap-0.5 sm:gap-1 ${className}`}>
          <span className='text-gray-800 font-semibold text-xs sm:text-sm'>{label}</span>
          <label className='text-gray-800 font-normal text-xs sm:text-sm'>{item} {medida}</label>
     </div>
  )
}
