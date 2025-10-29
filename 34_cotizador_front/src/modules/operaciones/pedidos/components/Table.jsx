import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import { MdModeEdit, MdOutlineFileDownload } from 'react-icons/md';
import { RiDeleteBinLine } from 'react-icons/ri';
import { GrUploadOption } from 'react-icons/gr';
import { getFilas } from '@utils/utils'
import { CeilOperaciones } from '@components/CeilOperaciones';
import { EstadoBadge } from '@components/Status';
 
export const Table = ({ filteredData }) => {

     const operaciones = (rowData) => {
          return (
               <div className='flex space-x-2'>
                    <CeilOperaciones> <MdModeEdit color='green' size={20} /> </CeilOperaciones>
                    <CeilOperaciones> <GrUploadOption color='black' size={20} /> </CeilOperaciones>
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
                         <Column field="Nro" header="NRO" />
                         <Column field="fecha" header="FECHA" />
                         <Column field="producto" header="PRODUCTO" />
                         <Column field="cliente" header="CLIENTE" />
                         <Column field="importe" header="IMPORTE" />
                         <Column field="estado" header="ESTADO" body={(rowData) => (
                              <EstadoBadge estado={rowData.estado} />
                         )} />
                         <Column body={operaciones} />
                    </DataTable>
               </div>
       </div>
     )
   }
   
      