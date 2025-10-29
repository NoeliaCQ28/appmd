import { Dialog, DialogPanel } from '@headlessui/react'
import React from 'react'
import { TransformadorForm } from '../TransformadorForm'

export const AddTransformadorModal = ({ visible, onClose }) => {
  return (
     <Dialog open={visible} as="div" className={'relative z-10'} onClose={onClose}>
          <div className='fixed inset-0 bg-black/60 z-10 w-screen overflow-y-auto'>
               <div className='flex min-h-full items-center justify-center'>
               <DialogPanel
                    transition
                    className="w-full md:max-w-4xl m-10 transform overflow-hidden rounded-2xl bg-white text-left align-middle shadow-xl transition-all p-6"
               >
                    <div>
                         <h2 className='font-bold text-xl'>Parámetros:</h2>
                    </div>
                    <form action="#">

                         <TransformadorForm />

                         <div className='flex flex-col justify-center space-y-4 md:space-y-0 md:space-x-10 md:py-7 md:flex-row'>
                                   <input
                                   type='submit'
                                   value={'Guardar'}
                                   className='bg-blue-800 px-8 p-2 uppercase text-white rounded-lg cursor-pointer'
                                   />
                                   <input
                                   type='button'
                                   className='bg-red-600 px-8 p-2 uppercase text-white rounded-lg cursor-pointer'
                                   value={'Cancelar'}
                                   onClick={onClose}
                                   />
                         </div>
                    </form>

               </DialogPanel>
          </div>
          </div>
   </Dialog>  
  )
}
