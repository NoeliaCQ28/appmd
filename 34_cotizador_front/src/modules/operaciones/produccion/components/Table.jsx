import React from 'react'
import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import { getFilas } from '@utils/utils'
import { InputNumber } from 'primereact/inputnumber'
import { ColumnGroup } from 'primereact/columngroup'
import { Row } from 'primereact/row'

export const Table = ({filteredData}) => {

     const onCellEditComplete = (e) => {
          
          let { rowData, newValue, field, originalEvent: event} = e
          if (newValue !== null && newValue !== undefined) {
               rowData[field] = newValue
               //setStocks([...stocks])
          }
     }

     const cellEditor = (options) => {
          return (
               <InputNumber 
                    value={options.value} 
                    onValueChange={(e) => options.editorCallback(e.value)} 
                    onKeyDown={(e) => e.stopPropagation()} />
          )
     }

     const headerGroup = (
          <ColumnGroup>
               <Row>
                    <Column header='CODIGO' rowSpan={3} />
                    <Column header='MODELO' rowSpan={3} />
                    <Column header='MODELO DE MOTOR' rowSpan={3} />
                    <Column header='MODELO DE ALTERNADOR' rowSpan={3} />
                    <Column header='STOCK' rowSpan={3} />
                    <Column header='COMPROMETIDO EN PRODUCCION X MESES' colSpan={3} />
                    <Column header='PROGRAMADOS' colSpan={4} />
                    <Column header='DISPONIBLE' colSpan={4} />
                    <Column header='PENDIENTES POR PROGRAMAR' rowSpan={4} />
               </Row>
               <Row>
                    <Column header='DIC-4' />
                    <Column header='ENE-4' />
                    <Column header='FEB-4' />
                    <Column header='1ER TRANSITO' colSpan={2} />
                    <Column header='2DO TRANSITO' colSpan={2} />
                    <Column header='1ER TRANSITO' colSpan={2} />
                    <Column header='2DO TRANSITO' colSpan={2} />
               </Row>
               <Row>
                    <Column header='SALDO FINAL' />
                    <Column header='SALDO FINAL' />
                    <Column header='SALDO FINAL' />
                    <Column header='CAT.' />
                    <Column header='FECHA DE LLEGADA' />
                    <Column header='CAT.' />
                    <Column header='FECHA DE LLEGADA' />
                    <Column header='CAT.' />
                    <Column header='FECHA DE LLEGADA' />
                    <Column header='CAT.' />
                    <Column header='FECHA DE LLEGADA' />
               </Row>
          </ColumnGroup>
     )

     return (
          <div className="pt-0 md:p-4 relative">
               <div className="w-full absolute pt-8 pb-10">
                         
                    <DataTable value={filteredData} headerColumnGroup={headerGroup} tableStyle={{ minWidth: '50rem' }} paginator rows={10} rowsPerPageOptions={getFilas(filteredData)} paginatorTemplate="RowsPerPageDropdown FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink" currentPageReportTemplate="{first} - {last} de {totalRecords}"
                    >
                         
                    </DataTable>

                    <div className="flex flex-col justify-center space-y-4 md:space-y-0 md:space-x-10 md:py-7 md:flex-row">
                         <input
                              type="submit"
                              value={"Guardar"}
                              className="bg-blue-800 px-8 p-2 uppercase text-white rounded-lg cursor-pointer"
                         />
                         <input
                              type="button"
                              className="bg-red-600 px-8 p-2 uppercase text-white rounded-lg cursor-pointer"
                              value={"Cancelar"}
                              // onClick={() => setClienteVisible(false)}
                         />
                    </div>
               </div>
               
          </div>
     )
}
