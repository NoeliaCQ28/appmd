import { isAxiosError } from "axios"
import { api } from "../../../../libs/axios"

export const getParametros = async () => {
     try {
          const { data } = await api.get('/electrogenos/parametros')
          if(data.success) {
               return data.data
          }
     } catch (error) {
          if (isAxiosError(error) && error.response) {
               throw new Error(error.response.data.message)
          }
     }
}

export const getModelos = async (formData) => {
     try {
          const url = '/electrogenos/modelos'
          const { data } = await api.post(url, formData)
          if (data.success) {
               return data.data
          }
     } catch (error) {
          if (isAxiosError(error) && error.response) {
               throw new Error(error.response.data.message)
          }
     }
}

// const {
//      voltaje,
//      frecuencia,
//      fases,
//      factorPotencia,
//      altura,
//      temperatura,
//      insonoro,
//    } = formData;
export const getModelosv2 = async (formData) => {
     try {
          const url = '/v1/grupos-electrogenos/modelos'
          const { data } = await api.post(url, formData)
          if (data.success) {
               return data.data
          }
     } catch (error) {
          if (isAxiosError(error) && error.response) {
               throw new Error(error.response.data.message)
          }
     }
}

export const getMotores = async (formData) => {
     try {
          const url = '/electrogenos/motores'
          const { data } = await api.post(url, formData)
          if (data.success) {
               return data.data
          }
     } catch (error) {
          if (isAxiosError(error) && error.response) {
               throw new Error(error.response.data.message)
          }
     }
}

export const getAlternadores = async (formData) => {
     try {
          const url = '/electrogenos/alternadores'
          const { data } = await api.post(url, formData)
          if (data.success) {
               return data.data
          }
     } catch (error) {
          if (isAxiosError(error) && error.response) {
               throw new Error(error.response.data.message)
          }
     }
}

export const getDerrateo = async (formData) => {
     try {
          const url = '/electrogenos/derrateo'
          const { data } = await api.post(url, formData)
          if (data.success) {
               return data.data
          }
     } catch (error) {
          if (isAxiosError(error) && error.response) {
               throw new Error(error.response.data.message)
          }
     }
}

export const getPrecios = async (formData) => {
     try {
          const url = '/electrogenos/precios'
          const { data } = await api.post(url, formData)
          if (data.success) {
               return data.data
          }
     } catch (error) {
          if (isAxiosError(error) && error.response) {
               throw new Error(error.response.data.message)
          }
     }
}

export const getItm = async (formData) => {
     try {
          const url = '/electrogenos/itm'
          const { data } = await api.post(url, formData)
          if (data.success) {
               return data.data
          }
     } catch (error) {
          if (isAxiosError(error) && error.response) {
               throw new Error(error.response.data.message)
          }
     }
}