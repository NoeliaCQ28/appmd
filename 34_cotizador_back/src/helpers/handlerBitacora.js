import { verifyToken } from "../libs/jwt.js"
import { registerBitacora } from "../models/bitacoraModel.js"
import { handlerInfoRequest } from "./handlerInfoRequest.js"

export const handlerBitacora = async (req, token, access_type) => {
    const { ip, device } = handlerInfoRequest(req)
    const { id } = verifyToken(token)

    const dataBitacora = {
        user_id: id,
        access_type,
        ip,
        device
    }

    await registerBitacora(dataBitacora)
}