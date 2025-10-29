import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import { MdModeEdit, MdOutlineFileDownload } from 'react-icons/md';
import { RiDeleteBinLine } from 'react-icons/ri';
import { getFilas } from '@utils/utils'
import { CeilOperaciones } from '@components/CeilOperaciones';
 
export const Table = ({ filteredData }) => {

     const operaciones = (rowData) => {
          return (
               <div className='flex space-x-2'>
                    <CeilOperaciones> <MdModeEdit color='green' size={20} /> </CeilOperaciones>
                    <CeilOperaciones> <MdOutlineFileDownload color='blue' size={20} /> </CeilOperaciones>
                    <CeilOperaciones> <RiDeleteBinLine color='red' size={20} /> </CeilOperaciones>
               </div>
          )
     }
   
     return (
       <div className="pt-0 md:p-4 relative">
               <div className="w-full absolute pt-8 pb-10">
                    <DataTable value={filteredData} tableStyle={{ minWidth: '50rem' }} paginator rows={10} rowsPerPageOptions={getFilas(filteredData)} paginatorTemplate="RowsPerPageDropdown FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink" currentPageReportTemplate="{first} - {last} de {totalRecords}"
                    >
                         <Column field="modelo" header="MODELO" />
                         <Column field="modelobase" header="MODELO BASE" />
                         <Column field="prime" header="PRIME" />
                         <Column field="stand" header="STAND BY" />
                         <Column field="voltaje" header="VOLTAJE" />
                         <Column field="frecuencia" header="FRECUENCIA" />
                         <Column field="potencia" header="FACTOR DE POTENCIA" />
                         <Column field="amperaje" header="AMPERAJE" />
                         
                         <Column body={operaciones} />
                    </DataTable>
               </div>
       </div>
     )
   }
   
      