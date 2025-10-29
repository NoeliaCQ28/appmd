import { Divider } from "primereact/divider";
import { Password } from "primereact/password";
import React, { useMemo } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { Button } from "../../../../../components/custom/buttons/Button";
import { FormInputText } from "../../../../../components/custom/inputs/FormInputText";
import { FormSelectText } from "../../../../../components/custom/selects/FormSelectText";
import { useAuth } from "../../../../../hooks/useAuth";
import useRoles from "../../hooks/useRoles";
import { SwitchInput } from "../../../../../components/custom/inputs/SwitchInput";

export const CreateUserForm = ({ setIsOpen, isEditMode, selectedItem }) => {
  const {
    control,
    register,
    reset,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();
  const { create, update } = useAuth();
  const { roles = [], isLoadingRoles } = useRoles();
  const [editPassword, setEditPassword] = React.useState(false);

  const onSubmit = (data) => {
    create(data);
    reset();
    setIsOpen(false);
  };

  const onEdit = (data) => {
    if (!selectedItem?.Usuario_Id) {
      toast.error("No se ha encontrado el usuario seleccionado.");

      return;
    }

    const { sUsuContrasenaConfirmacion, sUsuContrasena } = data;

    if (sUsuContrasena && sUsuContrasena !== sUsuContrasenaConfirmacion) {
      toast.error("Las contraseñas no coinciden.");
      return;
    }

    update({ nUsuarioId: selectedItem.Usuario_Id, data });
    reset();
    setIsOpen(false);
  };

  React.useEffect(() => {
    if (isEditMode && selectedItem) {
      reset({
        nRolId: selectedItem?.nRolId || "",
        sUsuNombre: selectedItem?.sUsuNombre || "",
        sUsuLogin: selectedItem?.sUsuLogin || "",
      });
    }
  }, [isEditMode, selectedItem, reset]);

  const rolesOptions = useMemo(() => {
    return (
      roles?.map((role) => ({
        label: role.sNombre,
        value: role.RolId,
      })) || []
    );
  }, [roles]);

  const headerPwd = <div className="font-bold mb-3">Elije una contraseña</div>;
  const footerPwd = (
    <>
      <Divider />
      <p className="mt-2">Sugerencias</p>
      <ul className="pl-2 ml-2 mt-0 line-height-3">
        <li>Al menos una minúscula</li>
        <li>Al menos una mayúscula</li>
        <li>Al menos un número</li>
        <li>Mínimo 8 caracteres</li>
      </ul>
    </>
  );

  return (
    <form
      onSubmit={handleSubmit(isEditMode ? onEdit : onSubmit)}
      className="flex flex-col space-y-3 mt-3"
    >
      <section className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <Controller
          name="nRolId"
          control={control}
          defaultValue=""
          rules={{
            required: "Rol es requerido",
          }}
          render={({ field: { onChange, value, ...rest } }) => (
            <FormSelectText
              name="nRolId"
              label="ROL*"
              placeholder="Seleccione un rol"
              options={rolesOptions}
              onChange={onChange}
              value={value}
              {...rest}
            />
          )}
        />
      </section>
      <section className="grid grid-cols-1 gap-3">
        <FormInputText
          name="sUsuNombre"
          label="NOMBRE*"
          error={errors.sUsuNombre}
          placeholder="Ingrese nombre"
          {...register("sUsuNombre", {
            required: "Nombre es requerido",
          })}
        />
        <FormInputText
          name="sUsuLogin"
          label="EMAIL*"
          placeholder="Ingrese email"
          error={errors.sUsuLogin}
          {...register("sUsuLogin", {
            required: "Email es requerido",
            pattern: {
              value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
              message: "Ingrese un email válido",
            },
          })}
        />
        {isEditMode && (
          <section>
            <SwitchInput
              name="editPassword"
              label="Editar contraseña"
              checked={editPassword}
              onChangeInput={(e) => setEditPassword(e.value)}
            />
          </section>
        )}
        {(editPassword || !isEditMode) && (
          <section className="flex flex-col gap-3 w-full">
            <label>
              <span className="text-sm font-semibold text-black">
                {isEditMode ? "NUEVA CONTRASEÑA" : "CONTRASEÑA*"}:
              </span>
            </label>
            <Controller
              name="sUsuContrasena"
              control={control}
              rules={{
                required: isEditMode ? false : "Contraseña es requerida",
              }}
              render={({ field: { value, onChange } }) => (
                <Password
                  inputId="password-input"
                  promptLabel={
                    isEditMode
                      ? "Elige una nueva contraseña"
                      : "Elige una contraseña"
                  }
                  toggleMask
                  className={`w-full ${
                    errors.sUsuContrasena ? "p-invalid" : ""
                  }`}
                  weakLabel="Muy débil"
                  mediumLabel="Complejidad media"
                  strongLabel="Contraseña compleja"
                  value={value}
                  onChange={onChange}
                  header={headerPwd}
                  footer={footerPwd}
                />
              )}
            />
            <span className="text-xs text-gray-500">
              Debe contener al menos 8 caracteres.
            </span>
          </section>
        )}
        {isEditMode && editPassword && (
          <section className="flex flex-col gap-3 w-full">
            <label>
              <span className="text-sm font-semibold text-black">
                CONFIRMAR NUEVA CONTRASEÑA*
              </span>
            </label>
            <Controller
              name="sUsuContrasenaConfirmacion"
              control={control}
              defaultValue={""}
              rules={{
                required: false,
                validate: (value) => {
                  if (value !== watch("sUsuContrasenaConfirmacion")) {
                    return "Las contraseñas no coinciden";
                  }
                  return true;
                },
              }}
              render={({ field: { value, onChange } }) => (
                <Password
                  inputId="password-input"
                  promptLabel={"Confirma la nueva contraseña"}
                  toggleMask
                  className={`w-full ${
                    errors.sUsuContrasena ? "p-invalid" : ""
                  }`}
                  weakLabel="Muy débil"
                  mediumLabel="Complejidad media"
                  strongLabel="Contraseña compleja"
                  value={value}
                  onChange={onChange}
                  header={headerPwd}
                  footer={footerPwd}
                />
              )}
            />
            <span className="text-xs text-gray-500">
              Debe contener al menos 8 caracteres.
            </span>
          </section>
        )}
      </section>

      <section className="flex items-center justify-center gap-3 pt-7">
        <Button type="submit">{isEditMode ? "ACTUALIZAR" : "GUARDAR"}</Button>
        <Button
          type="button"
          onClick={() => setIsOpen(false)}
          variant="destructive"
        >
          Cancelar
        </Button>
      </section>
    </form>
  );
};
