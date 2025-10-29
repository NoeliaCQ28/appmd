import db_pool from "../config/db.js"
import { handleResponse } from "../helpers/handlerResponse.js"

export const useGruposElectrogenos = async () => {
     try {
          const [[combo1Data]] = await db_pool.query('CALL Int_AlturasDisponibles()')
          const [[combo2Data]] = await db_pool.query('CALL Int_FasesDisponibles()')
          const [[combo3Data]] = await db_pool.query('CALL Int_FPsDisponibles()')
          const [[combo4Data]] = await db_pool.query('CALL Int_FrecuenciasDisponibles()')
          const [[combo5Data]] = await db_pool.query('CALL Int_TemperaturasDisponibles()')
          const [[combo6Data]] = await db_pool.query('CALL Int_VoltajesDisponibles()')

          // const transformData = (data, key) => data.map(item => item[key])
          return handleResponse(
               {
                    // combo1: transformData(combo1Data, 'Altura'),
                    alturas: combo1Data,
                    fases: combo2Data,
                    factorPotencias: combo3Data,
                    frecuencias: combo4Data,
                    temperaturas: combo5Data,
                    voltajes: combo6Data,
               },
               'Datos cargados correctamente'
          )

     } catch (error) {
          const { message } = error
          return handleResponse(null, message, false, 500)
     }
}

export const useModelos = async (data) => {
     try {
          const { voltaje, frecuencia, fases, factorPotencia } = data

          if (voltaje == null || frecuencia == null || fases == null || factorPotencia == null) {
               return handleResponse(null, "Existen campos requeridos", false, 400)
          }

          const [[rows]] = await db_pool.query(`CALL Int_ModelosCompatibles('${voltaje}', '${frecuencia}', '${fases}', '${factorPotencia}', 0)`)
          
          return handleResponse(rows, 'Datos obtenidos correctamente')

     } catch (error) {
          const { message } = error
          return handleResponse(null, message, false, 500)
     }
}

export const useMotores = async (data) => {
     try {
          const { modeloGe_Id, voltaje, frecuencia, fases, factorPotencia } = data

          if (!modeloGe_Id || voltaje == null || frecuencia == null || fases == null || factorPotencia == null ) {
               return handleResponse(null, "Existen campos obligatorios", false, 400)
          }

          const [[rows]] = await db_pool.query(`CALL Int_MotoresCompatibles('${modeloGe_Id}', '${voltaje}', '${frecuencia}', '${fases}', '${factorPotencia}')`)

          return handleResponse(rows, 'Datos obtenidos correctamente')

     } catch (error) {
          const { message } = error
          return handleResponse(null, message, false, 500)
     }
}

export const useAlternadores = async (data) => {
     try {

          const { modeloGe_Id, motor_Id, voltaje, frecuencia, fases, factorPotencia} = data

          if ( !modeloGe_Id || !motor_Id || voltaje == null || frecuencia == null || fases == null || factorPotencia == null ) {
               return handleResponse(null, "Existen campos obligatorios", false, 400)
          }

          const [[rows]] = await db_pool.query(`CALL Int_AlternadoresCompatibles('${modeloGe_Id}', '${motor_Id}', '${voltaje}', '${frecuencia}', '${fases}', '${factorPotencia}')`)

          return handleResponse(rows, 'Datos obtenidos correctamente')

     } catch (error) {
          const { message } = error
          return handleResponse(null, message, false, 500)
     }
}

export const useDerrateo = async (data) => {
     try {
          
          const { modeloGe_Id, motor_Id, alternador_Id, voltaje, frecuencia, fases, altura, temperatura, factorPotencia } = data

          if ( !modeloGe_Id || !motor_Id || !alternador_Id || voltaje == null || frecuencia == null || fases == null || altura == null || temperatura == null || factorPotencia == null ) {
               return handleResponse(null, "Existen campos obligatorios", false, 400)
          }

          const [[rows]] = await db_pool.query(`CALL DerrateoGE('${modeloGe_Id}', '${motor_Id}', '${alternador_Id}', '${voltaje}', '${frecuencia}', '${fases}', '${altura}', '${temperatura}', '${factorPotencia}')`)


          return handleResponse(rows, 'Datos obtenidos correctamente')

     } catch (error) {
          const { message } = error
          return handleResponse(null, message, false, 500)
     }
}

export const usePrecios =  async (data) => {
     try {
          const { modeloGe_Id, motor_Id, alternador_Id, voltaje, frecuencia, fases, factorPotencia } = data

          if ( !modeloGe_Id || !motor_Id || !alternador_Id || voltaje == null || frecuencia == null || fases == null || factorPotencia == null ) {
               return handleResponse(null, "Existen campos obligatorios", false, 400)
          }

          const [[rows]] = await db_pool.query(`CALL Int_Precios('${modeloGe_Id}', '${motor_Id}', '${alternador_Id}', '${voltaje}', '${frecuencia}', '${fases}', '${factorPotencia}')`)

          return handleResponse(rows, 'Datos obtenidos correctamente')

     } catch (error) {
          const { message } = error
          return handleResponse(null, message, false, 500)
     }
}

export const useItm = async (data) => {
     try {
          const { modeloGe_Id, motor_Id, alternador_Id, voltaje, frecuencia, fases, factorPotencia } = data

          if ( !modeloGe_Id || !motor_Id || !alternador_Id || voltaje == null || frecuencia == null || fases == null || factorPotencia == null ) {
               return handleResponse(null, "Existen campos obligatorios", false, 400)
          }

          const [[rows]] = await db_pool.query(`CALL Int_ITMDisponibles('${modeloGe_Id}', '${motor_Id}', '${alternador_Id}', '${voltaje}', '${frecuencia}', '${fases}', '${factorPotencia}')`)

          return handleResponse(rows, 'Datos obtenidos correctamente')
     } catch (error) {
          const { message } = error
          return handleResponse(null, message, false, 500)
     }
}