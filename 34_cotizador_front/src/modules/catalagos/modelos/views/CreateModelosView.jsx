import React from 'react'
import { Link } from 'react-router-dom'
import { ModelosForm } from '../components/ModelosForm'

export const CreateModelosView = () => {
  return (
     <div>
          <div className='w-full py-8 px-3 md:px-7'>
               <h2 className='text-2xl font-semibold'>Nuevo modelo</h2>
               <form action='' >
                    <ModelosForm />
                    <div className='flex flex-col justify-center space-y-4 md:space-y-0 md:space-x-10 md:py-7 md:flex-row'>
                         <input
                              type='submit'
                              value={'Guardar'}
                              className='bg-blue-800 px-8 p-2 uppercase text-white rounded-lg cursor-pointer'
                         />
                         <Link
                              type='button'
                              className='bg-red-600 text-center px-8 p-2 uppercase text-white rounded-lg cursor-pointer'
                              to={'/modelos'}
                         > Cancelar </Link>
                    </div>
               </form>
          </div>
   </div>
  )
}
