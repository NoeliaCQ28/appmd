import { useAlternadores, useDerrateo, useGruposElectrogenos, useItm, useModelos, useMotores, usePrecios } from "../models/gruposElectrogenosModel.js"

export const parametrosElectrogenos = async (req, res) => {
     const response = await useGruposElectrogenos()
     res.status(response.code).send(response)
}

export const obtenerModelos = async (req, res) => {
     const { voltaje, frecuencia, fases, factorPotencia } = req.body

     const response = await useModelos({voltaje, frecuencia, fases, factorPotencia})

     res.status(response.code).send(response)
}

export const obtenerMotores = async (req, res) => {
     const { modeloGe_Id, voltaje, frecuencia, fases, factorPotencia } = req.body

     const response = await useMotores({modeloGe_Id, voltaje, frecuencia, fases, factorPotencia})

     res.status(response.code).send(response)
}

export const obtenerAlternadores = async (req, res) => {
     const { modeloGe_Id, motor_Id, voltaje, frecuencia, fases, factorPotencia } = req.body

     const response = await useAlternadores({modeloGe_Id, motor_Id, voltaje, frecuencia, fases, factorPotencia})

     res.status(response.code).send(response)
}

export const obtenerDerrateo = async (req, res) => {

     const { modeloGe_Id, motor_Id, alternador_Id, voltaje, frecuencia, fases, altura, temperatura, factorPotencia } = req.body

     const response = await useDerrateo({modeloGe_Id, motor_Id, alternador_Id, voltaje, frecuencia, fases, altura, temperatura, factorPotencia})
     
     res.status(response.code).send(response)
}

export const obtenerPrecios = async (req, res) => {
     
     const { modeloGe_Id, motor_Id, alternador_Id, voltaje, frecuencia, fases, factorPotencia } = req.body

     const response = await usePrecios({modeloGe_Id, motor_Id, alternador_Id, voltaje, frecuencia, fases, factorPotencia})

     res.status(response.code).send(response)
}

export const obtenerItm = async (req, res) => {
     const { modeloGe_Id, motor_Id, alternador_Id, voltaje, frecuencia, fases, factorPotencia } = req.body

     const response = await useItm({modeloGe_Id, motor_Id, alternador_Id, voltaje, frecuencia, fases, factorPotencia})

     res.status(response.code).send(response)
}