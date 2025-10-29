import React from 'react'
import { Link } from 'react-router-dom'

export const ButtonSap = ({ children, url }) => {
  return (
     <Link 
          className='bg-green-600 h-10 w-full sm:h-10 sm:w-52 text-white font-semibold rounded-xl flex items-center justify-center' 
          to={url}
     >
          {children}
     </Link>
  )
}
