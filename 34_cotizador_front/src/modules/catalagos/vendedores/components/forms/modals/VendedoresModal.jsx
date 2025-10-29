import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { Button } from "../../../../../../components/custom/buttons/Button";
import { Modal } from "../../../../../../components/modals/Modal";
import {
  editVendedores,
  registerVendedores,
} from "../../../services/VendedoresService";
import { VendedoresForm } from "../VendedoresForm";

const initialValues = {
  codigo: "",
  sap: "",
  nombre: "",
  telefono: "",
  correo: "",
  pais: "Peru",
  departamento: "Cajamarca",
  provincia: "Cajamarca",
  estado: 1,
  usuario_asignado_id: -1,
  eliminado: 0,
};

export const VendedoresModal = ({
  VendedorVisible,
  setVendedorVisible,
  selectedItem,
  isEditMode,
}) => {
  const dataVendedor = {
    codigo: selectedItem?.sEjeCodigo,
    sap: selectedItem?.sEjeSAP,
    nombre: selectedItem?.sEjeNombre,
    telefono: selectedItem?.nEjeTelefono,
    correo: selectedItem?.sEjeCorreo,
    pais: selectedItem?.sEjePais || "Peru",
    departamento: selectedItem?.sEjeDepartamento,
    provincia: selectedItem?.sEjeProvincia,
    estado: selectedItem?.nEjeEstado,
    usuario_asignado_id: selectedItem?.nUsuarioAsignadoId || -1,
  };

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({ defaultValues: selectedItem ? dataVendedor : initialValues });

  const queryClient = useQueryClient();

  const { mutate: mutateCreate } = useMutation({
    mutationFn: registerVendedores,
    onError: (error) => {
      toast.error(error.message);
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["vendedores"] });
      toast.success(data);
      reset();
      setVendedorVisible(false);
    },
  });

  const { mutate: mutateUpdate } = useMutation({
    mutationFn: editVendedores,
    onError: (error) => {
      toast.error(error.message);
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["vendedores"] });
      toast.success(data);
      reset();
      setVendedorVisible(false);
    },
  });

  const onSave = (formData) => {
    mutateCreate(formData);
  };

  const onEdit = (formData) => {
    const { Ejecutivo_Id: id } = selectedItem;

    mutateUpdate({ id, formData });
  };

  return (
    <Modal
      open={VendedorVisible}
      setOpen={setVendedorVisible}
      title={
        isEditMode ? "Editar datos del Ejecutivo" : "Datos del Nuevo Ejecutivo"
      }
      withBackground
    >
      <form onSubmit={handleSubmit(isEditMode ? onEdit : onSave)}>
        <VendedoresForm
          register={register}
          control={control}
          errors={errors}
          selectedItem={isEditMode ? selectedItem : null}
        />

        <div className="flex flex-col justify-center space-y-4 md:space-y-0 md:space-x-10 md:py-7 md:flex-row">
          <Button type="submit">
            {isEditMode ? "Actualizar" : "Registrar"}
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();

              reset();

              setVendedorVisible(false);
            }}
          >
            Cancelar
          </Button>
        </div>
      </form>
    </Modal>
  );
};
