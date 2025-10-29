import React, { useState } from 'react'
import { Header } from '@components/Header'
import { HeadersModelos } from '@utils/utils'
import { Filter } from '@components/custom/filters/Filter'
import { InputSearch } from '@components/custom/inputs/InputSearch'
import { ButtonAdd } from '@components/custom/buttons/Button'
import { Table } from '../components/Table'
import { FileInputForm } from '../components/FileInputForm'

export const ModelosView = () => {

  //datos de prueba
  const data = [
     { modelo: 'MB-100W', modelobase:'Sí', prime:'88.8 KW/111KVA', stand: '88.8 KW/111KVA', voltaje:'208V', frecuencia:'60 Hz', potencia:'0.8', amperaje:'339 A' },
     { modelo: 'MB-100W', modelobase:'No', prime:'88.8 KW/111KVA', stand: '88.8 KW/111KVA', voltaje:'76V', frecuencia:'60 Hz', potencia:'0.8', amperaje:'161 A' },
     { modelo: 'MB-100W', modelobase:'No', prime:'88.8 KW/111KVA', stand: '88.8 KW/111KVA', voltaje:'160V', frecuencia:'60 Hz', potencia:'0.8', amperaje:'161 A' },
     { modelo: 'MB-100W', modelobase:'Sí', prime:'88.8 KW/111KVA', stand: '88.8 KW/111KVA', voltaje:'800V', frecuencia:'60 Hz', potencia:'0.8', amperaje:'148 A' },
   ]
 
   const [filteredData, setFilteredData] = useState(data)

   const [open, setIsOpen] = useState(false)
 
   const handleSearch = (term) => {
        const filtered = data.filter((row) =>
             Object.values(row).some((value) =>
                  String(value).toLowerCase().includes(term.toLowerCase())
             )
        )
        setFilteredData(filtered)
   }

  return (
    <div className='w-full px-4 py-2'>
          
          <Header data={HeadersModelos} />
          
          <div className="pt-6 w-full">
               <div className='space-y-4 sm:flex sm:space-x-4 sm:items-center sm:space-y-0 sm:justify-between'>
                    <Filter />
                    <InputSearch
                         type={'text'}
                         placeholder={'Buscar en la tabla'}
                         onSearch={handleSearch}
                         className={'p-2 outline-none w-full pl-9 bg-gray-100 border rounded-xl placeholder:text-gray-500 sm:w-80'}
                    />
                    <div className='flex gap-4 flex-col xs:flex-row'>
                         <button
                              type='button'
                              className='bg-green-600 h-10 w-full sm:h-10 sm:w-52 text-white font-semibold rounded-xl flex items-center justify-center uppercase'
                              onClick={() => setIsOpen(true)}
                         >
                              Importar csv
                         </button>
                         <ButtonAdd url={'/modelos/create'}> AGREGAR </ButtonAdd>
                    </div>
               </div>
              <Table filteredData={filteredData} />
          </div>

          <FileInputForm open={open} setIsOpen={setIsOpen} />
          
     </div>
    
  )
}
