import { FormSelectText } from '@components/custom/selects/FormSelectText'
import { Filter } from '@components/custom/filters/Filter'
import { InputSearch } from '@components/custom/inputs/InputSearch'
import { Table } from '../components/Table'
import { useState } from 'react'

export const ComponentesView = () => {

  const data = [
    {
      id: 1, 
      producto: "El mejor productos ahgahsahs", 
      mercadoN: {
          cabina: 1129,
          sinCabina: 10329,
      },
      mercadoI:{
          cabina:1482,
          sinCabina: 19492
      }
    },
    {
      id: 2, 
      producto: "Segundo producto ahgahsahs", 
      mercadoN: {
          cabina: 102929,
          sinCabina: 1082,
      },
      mercadoI:{
          cabina:19282,
          sinCabina: 15692
      }
    }
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
          <div className='pt-6 space-y-7'>
              <h2 className='font-semibold text-2xl'>Parámetros</h2>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <FormSelectText 
                    label={'Tipo de producto'}
                    placeholder={'Seleccione tipo de producto'}
                />
                <FormSelectText 
                    label={'Marca'}
                    placeholder={'Seleccione tipo de marca'}
                />
              </div>
              <div className='flex gap-80'>
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
