import { Check, Save } from "lucide-react";
import React, { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { Button } from "../../../../../components/custom/buttons/Button";
import { FormInputText } from "../../../../../components/custom/inputs/FormInputText";
import { FormSelectText } from "../../../../../components/custom/selects/FormSelectText";
import { useCombination } from "../../hooks/useCombination";
import useModelsSearch from "../../hooks/useModelsSearch";
import useMargin from "../../hooks/v2/useMagin";

const CombinationForm = ({
  mode = "create",
  initialData = null,
  onSuccess = () => {},
  onClose = () => {},
}) => {
  const { createCombinationMutation, updateCombinationMutation } =
    useCombination();

  const {
    modelsName,
    motorModels,
    alternatorModels,
    voltages,
    frequencies,
    phases,
    powerFactors,
    altitudes,
    itms,
    markets,
  } = useModelsSearch();

  const isEditMode = mode === "edit" && initialData;
  // Función para mapear los datos iniciales al formato del formulario
  const getInitialFormData = React.useCallback(() => {
    if (isEditMode && initialData) {
      return {
        IntegradoraId: initialData.IntegradoraId || 0,
        ModeloGE_Id: initialData.ModeloGEId || "",
        Motor_Id: initialData.MotorId || "",
        Alternador_Id: initialData.AlternadorId || "",
        Voltaje: initialData.Voltaje || 0,
        Frecuencia: initialData.Frecuencia || 0,
        Fases: initialData.Fases || 0,
        FactorPotencia: initialData.FactorPotencia || 0,
        Altura: initialData.Altura || 0,
        ITMA: initialData.ITMA || 0,
        MercadoId: initialData.MercadoId || 1,
        CostoAbierto: initialData.CostoAbierto || 0,
        CostoCabina: initialData.CostoCabina || 0,
        PrecioAbierto: initialData.PrecioAbierto || 0,
        PrecioCabina: initialData.PrecioCabina || 0,
        PotenciaStandBy: initialData.PotenciaStandBy || 0,
        PotenciaPrime: initialData.PotenciaPrime || 0,
        Factor1: initialData.Factor1 || 0,
        Factor1Cabina: initialData.Factor1Cabina || 0,
        Factor2: initialData.Factor2 || 0,
        Factor2Cabina: initialData.Factor2Cabina || 0,
        TableroDescripcion: initialData.TableroDescripcion || "",
        TableroMediciones: initialData.TableroMediciones || "",
        TableroProtecciones: initialData.TableroProtecciones || "",
        TableroAccesorios: initialData.TableroAccesorios || "",
        TableroOpcionales: initialData.TableroOpcionales || "",
      };
    }

    return {
      IntegradoraId: 0,
      ModeloGE_Id: "",
      Motor_Id: "",
      Alternador_Id: "",
      Voltaje: 0,
      Frecuencia: 0,
      Fases: 0,
      FactorPotencia: 0,
      Altura: 0,
      ITMA: 0,
      MercadoId: 1,
      CostoAbierto: 0,
      CostoCabina: 0,
      PrecioAbierto: 0,
      PrecioCabina: 0,
      PotenciaStandBy: 0,
      PotenciaPrime: 0,
      Factor1: 0,
      Factor1Cabina: 0,
      Factor2: 0,
      Factor2Cabina: 0,
      TableroDescripcion: "",
      TableroMediciones: "",
      TableroProtecciones: "",
      TableroAccesorios: "",
      TableroOpcionales: "",
    };
  }, [isEditMode, initialData]);

  const modelOptions = React.useMemo(
    () =>
      modelsName?.map((m) => {
        return { value: m.ModeloGE_Id, label: m.sModNombre };
      }),
    [modelsName]
  );

  const motorOptions = React.useMemo(
    () =>
      motorModels?.map((m) => {
        return { value: m.Motor_Id, label: `${m.sMotModelo} - ${m.sMotMarca}` };
      }),
    [motorModels]
  );

  const alternatorOptions = React.useMemo(
    () =>
      alternatorModels?.map((a) => {
        return {
          value: a.Alternador_Id,
          label: `${a.sAltModelo} - ${a.sAltMarca}`,
        };
      }),
    [alternatorModels]
  );

  const voltagesOptions = React.useMemo(() => {
    return voltages?.map((v) => {
      return { value: v.nIntVoltaje, label: v.nIntVoltaje + " V" };
    });
  }, [voltages]);

  const frequenciesOptions = React.useMemo(() => {
    return frequencies?.map((f) => {
      return { value: f.nIntFrecuencia, label: f.nIntFrecuencia + " Hz" };
    });
  }, [frequencies]);

  const phasesOptions = React.useMemo(() => {
    return phases?.map((p) => {
      return { value: p.nIntFases, label: p.nIntFases + " Fases" };
    });
  }, [phases]);

  const powerFactorsOptions = React.useMemo(() => {
    return powerFactors?.map((pf) => {
      return { value: pf.nIntFP, label: pf.nIntFP };
    });
  }, [powerFactors]);

  const altitudesOptions = React.useMemo(() => {
    return altitudes?.map((a) => {
      return { value: a.Altura, label: a.Altura + " msnm" };
    });
  }, [altitudes]);

  const itmsOptions = React.useMemo(() => {
    return itms?.map((itm) => {
      return { value: itm.Amperaje, label: itm.Amperaje };
    });
  }, [itms]);

  const marketsOptions = React.useMemo(() => {
    return markets?.map((market) => {
      return { value: market.MercadoId, label: market.sNombre };
    });
  }, [markets]);
  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    getValues,
    reset: resetForm,
  } = useForm({
    defaultValues: getInitialFormData(),
  });
  // Resetear formulario cuando cambian los datos iniciales
  useEffect(() => {
    resetForm(getInitialFormData());
  }, [getInitialFormData, resetForm]);

  const onSubmit = (data) => {
    // Asegurar que los precios estén presentes (si antes estaban disabled no se enviaban)
    const precioAbierto =
      parseFloat(data.PrecioAbierto ?? getValues("PrecioAbierto")) || 0;
    const precioCabina =
      parseFloat(data.PrecioCabina ?? getValues("PrecioCabina")) || 0;

    const payload = {
      ...data,
      PrecioAbierto: precioAbierto,
      PrecioCabina: precioCabina,
    };

    if (isEditMode) {
      updateCombinationMutation.mutate({
        id: initialData.IntegradoraId,
        data: payload,
      });
    } else {
      createCombinationMutation.mutate(payload);
    }
  };

  // Manejar éxito de las mutaciones
  useEffect(() => {
    if (createCombinationMutation.isSuccess) {
      resetForm();
      createCombinationMutation.reset();
      onSuccess();
    }
  }, [createCombinationMutation, resetForm, onSuccess]);

  useEffect(() => {
    if (updateCombinationMutation.isSuccess) {
      updateCombinationMutation.reset();
      onSuccess();
    }
  }, [updateCombinationMutation, onSuccess]);

  const marketId = watch("MercadoId");
  const generatorSetId = watch("ModeloGE_Id");
  const motorBrandId = motorModels.find(
    (m) => m.Motor_Id === watch("Motor_Id")
  )?.MotorMarca_Id;

  const { margins, isLoadingMargins, errorMargins, evalPrice } = useMargin({
    generatorSetId,
    motorBrandId,
    marketId,
  });

  // Recalcular precios cuando cambien el modelo, motor, mercado o márgenes
  const costoAbierto = watch("CostoAbierto");
  const costoCabina = watch("CostoCabina");

  useEffect(() => {
    // Evitar cálculos innecesarios si no hay costos
    if (costoAbierto > 0) {
      const newPrecioAbierto = evalPrice(costoAbierto);
      const currentPrecioAbierto = getValues("PrecioAbierto");
      if (Number(currentPrecioAbierto) !== Number(newPrecioAbierto)) {
        setValue("PrecioAbierto", newPrecioAbierto);
      }
    }
    if (costoCabina > 0) {
      const newPrecioCabina = evalPrice(costoCabina);
      const currentPrecioCabina = getValues("PrecioCabina");
      if (Number(currentPrecioCabina) !== Number(newPrecioCabina)) {
        setValue("PrecioCabina", newPrecioCabina);
      }
    }
  }, [
    costoAbierto,
    costoCabina,
    generatorSetId,
    motorBrandId,
    marketId,
    margins?.factors?.margin,
    margins?.factors?.discount,
    evalPrice,
    setValue,
    getValues,
  ]);

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Sección: Configuración Básica */}
        <div className="p-4 rounded-lg space-y-3 bg-white">
          <h3 className="font-semibold mb-4 text-black uppercase">
            Configuración Básica
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Controller
              name="ModeloGE_Id"
              control={control}
              rules={{ required: "El modelo GE es obligatorio" }}
              render={({ field }) => (
                <FormSelectText
                  label="Modelo"
                  placeholder="Seleccione el modelo"
                  options={modelOptions}
                  error={errors.ModeloGE_Id?.message}
                  required
                  filter
                  {...field}
                  onChange={(e) => {
                    field.onChange(e);

                    // Calcular el precio de la cabina del grupo electrógeno

                    // Calcular el precio del grupo electrogeno abierto
                  }}
                />
              )}
            />

            <Controller
              name="Motor_Id"
              control={control}
              rules={{ required: "El motor es obligatorio" }}
              render={({ field }) => (
                <FormSelectText
                  label="Motor"
                  placeholder="Seleccione el motor"
                  options={motorOptions}
                  error={errors.Motor_Id?.message}
                  required
                  filter
                  {...field}
                  onChange={(e) => {
                    field.onChange(e);

                    // Calcular el precio de la cabina del grupo electrógeno

                    // Calcular el precio del grupo electrogeno abierto
                  }}
                />
              )}
            />

            <Controller
              name="Alternador_Id"
              control={control}
              rules={{ required: "El alternador es obligatorio" }}
              render={({ field }) => (
                <FormSelectText
                  label="Alternador"
                  placeholder="Seleccione el alternador"
                  options={alternatorOptions}
                  error={errors.Alternador_Id?.message}
                  required
                  filter
                  {...field}
                />
              )}
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Controller
              name="Voltaje"
              control={control}
              rules={{ required: "El voltaje es obligatorio", min: 1 }}
              render={({ field }) => (
                <FormSelectText
                  label="Voltaje"
                  placeholder="Seleccione el voltaje"
                  options={voltagesOptions}
                  error={errors.Voltaje?.message}
                  required
                  {...field}
                />
              )}
            />

            <Controller
              name="Frecuencia"
              control={control}
              rules={{ required: "La frecuencia es obligatoria", min: 1 }}
              render={({ field }) => (
                <FormSelectText
                  label="Frecuencia"
                  placeholder="Seleccione la frecuencia"
                  options={frequenciesOptions}
                  error={errors.Frecuencia?.message}
                  required
                  {...field}
                />
              )}
            />

            <Controller
              name="Fases"
              control={control}
              rules={{ required: "Las fases son obligatorias", min: 1 }}
              render={({ field }) => (
                <FormSelectText
                  label="Fases"
                  placeholder="Seleccione las fases"
                  options={phasesOptions}
                  error={errors.Fases?.message}
                  required
                  {...field}
                />
              )}
            />

            <Controller
              name="FactorPotencia"
              control={control}
              rules={{ required: "El factor de potencia es obligatorio" }}
              render={({ field }) => (
                <FormSelectText
                  label="Factor de Potencia"
                  placeholder="Seleccione la potencia"
                  options={powerFactorsOptions}
                  error={errors.FactorPotencia?.message}
                  required
                  {...field}
                />
              )}
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Controller
              name="Altura"
              control={control}
              rules={{ required: "La altura es obligatoria" }}
              render={({ field }) => (
                <FormSelectText
                  label="Altura"
                  placeholder="Seleccione la altura"
                  options={altitudesOptions}
                  error={errors.Altura?.message}
                  required
                  {...field}
                />
              )}
            />

            <Controller
              name="ITMA"
              control={control}
              rules={{ required: "El kit ITM es obligatorio" }}
              render={({ field }) => (
                <FormSelectText
                  label="Kit ITM (A)"
                  placeholder="Seleccione el amperaje"
                  options={itmsOptions}
                  error={errors.ITMA?.message}
                  required
                  {...field}
                  editable
                  filter
                />
              )}
            />

            <Controller
              name="MercadoId"
              control={control}
              rules={{ required: "El mercado es obligatorio" }}
              render={({ field }) => (
                <FormSelectText
                  label="Mercado"
                  options={marketsOptions}
                  error={errors.MercadoId?.message}
                  required
                  {...field}
                />
              )}
            />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {/* Sección: Costos */}
          <div className="border p-4 rounded-lg bg-white">
            <h3 className="font-semibold mb-4 text-black uppercase">
              Costos <span className="text-xs font-semibold">(USD)</span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <Controller
                name="CostoAbierto"
                defaultValue={0}
                control={control}
                render={({ field }) => (
                  <FormInputText
                    label="Costo Abierto"
                    type="number"
                    step="0.01"
                    error={errors.CostoAbierto?.message}
                    {...field}
                    onChange={(e) => {
                      field.onChange(e);
                      const cost = Number(e.target.value);
                      const price = evalPrice(cost);

                      setValue("PrecioAbierto", price);
                    }}
                  />
                )}
              />

              <Controller
                name="CostoCabina"
                defaultValue={0}
                control={control}
                render={({ field }) => (
                  <FormInputText
                    label="Costo de la Cabina"
                    type="number"
                    step="0.01"
                    error={errors.CostoCabina?.message}
                    {...field}
                    onChange={(e) => {
                      field.onChange(e);
                      const cost = Number(e.target.value);
                      const price = evalPrice(cost);

                      setValue("PrecioCabina", price);
                    }}
                  />
                )}
              />
            </div>
          </div>
          {/* Sección: Precios */}
          <div className="border p-4 rounded-lg bg-white">
            <h3 className="font-semibold mb-4 text-black uppercase">
              Precios <span className="text-xs font-semibold">(USD)</span>{" "}
              <span className="px-[2px] py-1 rounded-md border border-orange-500 border-dashed text-xs font-semibold text-orange-800">
                Calculo automatico
              </span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <Controller
                name="PrecioAbierto"
                defaultValue={0}
                control={control}
                render={({ field }) => (
                  <FormInputText
                    label="Precio Abierto"
                    type="number"
                    step="0.01"
                    readOnly
                    error={errors.PrecioAbierto?.message}
                    {...field}
                  />
                )}
              />

              <Controller
                name="PrecioCabina"
                defaultValue={0}
                control={control}
                render={({ field }) => (
                  <FormInputText
                    label="Precio de la Cabina"
                    type="number"
                    step="0.01"
                    readOnly
                    error={errors.PrecioCabina?.message}
                    {...field}
                  />
                )}
              />
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {/* Sección: Especificaciones Técnicas */}
          <div className="border p-4 rounded-lg bg-white">
            <h3 className="font-semibold mb-4 text-black uppercase">
              Especificaciones Técnicas
            </h3>
            <div className="flex flex-col gap-3">
              <Controller
                name="PotenciaStandBy"
                control={control}
                defaultValue={0}
                rules={{ required: "La potencia en Stand By es obligatoria" }}
                render={({ field }) => (
                  <FormInputText
                    label="Potencia Stand By (kW)"
                    type="number"
                    step="0.01"
                    error={errors.PotenciaStandBy?.message}
                    {...field}
                  />
                )}
              />

              <Controller
                name="PotenciaPrime"
                control={control}
                defaultValue={0}
                rules={{ required: "La potencia Prime es obligatoria" }}
                render={({ field }) => (
                  <FormInputText
                    label="Potencia Prime (kW)"
                    type="number"
                    step="0.01"
                    error={errors.PotenciaPrime?.message}
                    {...field}
                  />
                )}
              />
            </div>
          </div>
          {/* Sección: Factores */}
          <div className="border p-4 rounded-lg bg-white">
            <h3 className="font-semibold mb-4 text-black uppercase">
              Factores
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
              <Controller
                name="Factor1"
                control={control}
                render={({ field }) => (
                  <FormInputText
                    label="Factor 1"
                    type="number"
                    step="0.01"
                    error={errors.Factor1?.message}
                    {...field}
                  />
                )}
              />

              <Controller
                name="Factor1Cabina"
                control={control}
                render={({ field }) => (
                  <FormInputText
                    label="Factor 1 de Cabina"
                    type="number"
                    step="0.01"
                    error={errors.Factor1Cabina?.message}
                    {...field}
                  />
                )}
              />
              <Controller
                name="Factor2"
                control={control}
                render={({ field }) => (
                  <FormInputText
                    label="Factor 2"
                    type="number"
                    step="0.01"
                    error={errors.Factor2?.message}
                    {...field}
                  />
                )}
              />

              <Controller
                name="Factor2Cabina"
                control={control}
                render={({ field }) => (
                  <FormInputText
                    label="Factor 2 de Cabina"
                    type="number"
                    step="0.01"
                    error={errors.Factor2Cabina?.message}
                    {...field}
                  />
                )}
              />
            </div>
          </div>
        </div>
        {/* Sección: Descripciones
        <div className="border p-4 rounded-lg bg-white">
          <h3 className="font-semibold mb-4 text-black uppercase">Tablero</h3>
          <div className="space-y-4">
             <Controller
              name="TableroDescripcion"
              control={control}
              render={({ field }) => (
                <FormInputText
                  label="Descripción Del Tablero"
                  placeholder="Ingrese la descripción"
                  textarea
                  rows={3}
                  error={errors.TableroDescripcion?.message}
                  {...field}
                />
              )}
            /> 

             <Controller
              name="TableroMediciones"
              control={control}
              render={({ field }) => (
                <FormInputText
                  label="Mediciones Del Tablero"
                  placeholder="Ingrese las mediciones"
                  textarea
                  rows={3}
                  error={errors.TableroMediciones?.message}
                  {...field}
                />
              )}
            />

            <Controller
              name="TableroProtecciones"
              control={control}
              render={({ field }) => (
                <FormInputText
                  label="Protecciones Del Tablero"
                  placeholder="Ingrese las protecciones"
                  textarea
                  rows={3}
                  error={errors.TableroProtecciones?.message}
                  {...field}
                />
              )}
            />

            <Controller
              name="TableroAccesorios"
              control={control}
              render={({ field }) => (
                <FormInputText
                  label="Accesorios Estandar Del Tablero"
                  placeholder="Ingrese los accesorios estandar"
                  textarea
                  rows={3}
                  error={errors.TableroAccesorios?.message}
                  {...field}
                />
              )}
            />

            <Controller
              name="TableroOpcionales"
              control={control}
              render={({ field }) => (
                <FormInputText
                  label="Opcionales Estandar Del Tablero"
                  placeholder="Ingrese los opcionales"
                  textarea
                  rows={3}
                  error={errors.TableroOpcionales?.message}
                  {...field}
                />
              )}
            /> 
          </div>
        </div> 
        */}
        {/* Botones de acción */}
        <div className="flex justify-center space-x-4 pt-6">
          <Button
            type="submit"
            variant="primary"
            disabled={
              createCombinationMutation.isPending ||
              updateCombinationMutation.isPending
            }
            loading={
              createCombinationMutation.isPending ||
              updateCombinationMutation.isPending
            }
            className="md:w-fit"
          >
            {isEditMode ? (
              <Check className="w-4 h-4 mr-2" />
            ) : (
              <Save className="w-5 h-5 mr-2" />
            )}
            {isEditMode
              ? updateCombinationMutation.isPending
                ? "Actualizando..."
                : "Actualizar"
              : createCombinationMutation.isPending
              ? "Creando..."
              : "Guardar"}
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={onClose}
            disabled={
              createCombinationMutation.isPending ||
              updateCombinationMutation.isPending
            }
          >
            Cancelar
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CombinationForm;
