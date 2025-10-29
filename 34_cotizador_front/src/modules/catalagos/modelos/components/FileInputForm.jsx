import React from 'react'
import { Dialog, DialogPanel } from "@headlessui/react"
import { DragDrop } from '@components/DragDrop'
import { logger } from '../../../../utils/logger'

export const FileInputForm = ({ open, setIsOpen }) => {
  return (
     <Dialog open={open} as="div" className={'relative z-10'} onClose={setIsOpen}>
          <div className="fixed inset-0 bg-black/60 z-10 w-screen overflow-y-auto">
               <div className="flex min-h-full items-center justify-center">
                    <DialogPanel
                         transition
                         className="w-full max-w-xl m-10 transform overflow-hidden rounded-2xl bg-white text-left align-middle shadow-xl transition-all p-6"
                    >
                         <DragDrop 
                              onFileSelect={(file) => logger.info(file)}
                              onCancel={setIsOpen}
                         />
                    </DialogPanel>
               </div>
          </div>
     </Dialog>
  )
}
