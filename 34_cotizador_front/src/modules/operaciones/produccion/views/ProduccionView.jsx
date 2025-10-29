import React, { useState } from 'react'
import { Filter } from '@components/custom/filters/Filter'
import { Header } from '@components/Header'
import { HeadersProduccion } from '@utils/utils'
import { InputSearch } from '@components/custom/inputs/InputSearch'
import { Table } from '../components/Table'

export const ProduccionView = () => {

    //datos de prueba
    const data = [
      { Nro: 1, fecha: '07/agos/2024', producto:'Cables', cliente:'Ripley SAC', agosto: '2000.00', septiembre:'19.00', octubre:'87.00' },
      { Nro: 2, fecha: '10/agos/2024', producto:'Grupos electrógenos', cliente:'Prueba SAC', agosto: '8938.00', septiembre:'87.00', octubre:'76.00' },
      { Nro: 2, fecha: '10/agos/2024', producto:'Celdas', cliente:'Prueba SAC', agosto: '8938.00', septiembre:'928.00', octubre:'87.00' },
      { Nro: 2, fecha: '10/agos/2024', producto:'Celdas', cliente:'Prueba SAC', agosto: '8938.00', septiembre:'10.00', octubre:'856.00' }
    ]

  const [filteredData, setFilteredData] = useState(data)

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
        <Header data={HeadersProduccion} />
        <div className='pt-6 w-full'>
          <div className='space-y-4 sm:flex sm:space-x-56 sm:items-center sm:space-y-0 sm:justify-normal'>
              <Filter />
              <InputSearch
                    type={'text'}
                    placeholder={'Buscar en la tabla'}
                    onSearch={handleSearch}
                    className={'p-2 outline-none w-full pl-9 bg-gray-100 border rounded-xl placeholder:text-gray-500 sm:w-80'}
              />
          </div>
         <Table filteredData={filteredData} />
        </div>
    </div>
  )
}
