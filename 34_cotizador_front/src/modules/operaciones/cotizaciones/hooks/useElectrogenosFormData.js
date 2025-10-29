import React, { useState } from 'react'

export const useElectrogenosFormData = (initialValues = {}) => {

  const [formData, setFormData] = useState(initialValues)
  const [onReset, setOnReset] = useState(false)

  const onHandleChange = (key, value) => {
    setFormData((prev) => ({
      ...prev,
      [key]: value,
    }))
  }

  const resetFormData = React.useCallback(() => {
    setFormData(initialValues)
    onHandleChange("isMotorBrandUL", 0);
    setOnReset(true)
    setTimeout(() => setOnReset((prev) => !prev), 100) // Resetear el flag después de un breve momento
  }, [onReset, initialValues])

  return {
    formData,
    onHandleChange,
    onReset,
    resetFormData
  }
}