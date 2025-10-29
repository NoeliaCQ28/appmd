import { FormTextArea } from "@components/custom/inputs/FormTextArea"
import { Subtitle } from "../Subtitle"

export const OpcionalesForm = () => {
  return (
     <div className="py-6 space-y-7">
          <Subtitle> Opcionales </Subtitle>
          <FormTextArea 
               label={'Descripción'}
               placeholder={'Descripción'}
          />
     </div>
  )
}
