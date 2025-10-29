import { FormTextArea } from "@components/custom/inputs/FormTextArea"
import { FormSelectText } from "@components/custom/selects/FormSelectText"
import { Subtitle } from "../Subtitle"

export const TableroControlForm = () => {
  return (
     <div className="py-6 space-y-7">
          <Subtitle> Tablero de control </Subtitle>

          <FormTextArea 
               label={'Descripción'}
               placeholder={'Descripción'}
          />
          <FormTextArea 
               label={'Datos generales'}
               placeholder={'Datos generales'}
          />
          <FormTextArea 
               label={'Protecciones'}
               placeholder={'Protecciones'}
          />
          <FormSelectText 
               label={'Imagen del tablero de control'}
               placeholder={'Seleccione imagen'}
          />
     </div>
  )
}
