import { InputFloat } from "@components/custom/inputs/InputFloat";
import { useMutation } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { BsEye } from "react-icons/bs";
import { FiEyeOff } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { aunthenticateUser } from "../services/AuthService";
import { glassClass } from "../../../utils/utils";

export const LoginForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const savedEmail = localStorage.getItem("rememberedEmail") || "";
  const savedPassword = localStorage.getItem("rememberedPassword") || "";

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm({
    defaultValues: { email: savedEmail, password: savedPassword },
  });

  const navigate = useNavigate();

  const { mutate } = useMutation({
    mutationFn: aunthenticateUser,
    onError: (error) => {
      toast.error(error.message);
    },
    onSuccess: () => {
      navigate("/");
    },
  });

  useEffect(() => {
    if (savedEmail && savedPassword) {
      setRememberMe(true);
      setValue("email", savedEmail);
      setValue("password", savedPassword);
    }
  }, [setValue, savedEmail, savedPassword]);

  const handleLogin = (formData) => {
    if (rememberMe) {
      localStorage.setItem("rememberedEmail", formData.email);
      localStorage.setItem("rememberedPassword", formData.password);
    } else {
      localStorage.removeItem("rememberedEmail");
      localStorage.removeItem("rememberedPassword");
    }
    mutate(formData);
  };

  return (
    <form
      onSubmit={handleSubmit(handleLogin)}
      className="w-full max-w-md space-y-6 h-full"
    >
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Iniciar Sesión</h1>
        <p className="text-sm text-muted-foreground text-gray-500">
          Inicie sesión para continuar en su cuenta.
        </p>
      </div>
      <div className="space-y-4">
        <InputFloat
          label="Correo Electrónico"
          type="email"
          id="email"
          className="peer w-full rounded-lg border-2 border-blue-100 bg-white px-3 py-3 text-gray-900 outline-none transition-all focus:border-blue-600"
          {...register("email", {
            required: "El correo electrónico es obligatorio",
            pattern: {
              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              message: "Formato de correo no válido",
            },
          })}
          error={errors.email?.message}
        />

        <div className="flex flex-col space-y-2">
          <div className="relative">
            <InputFloat
              label="Contraseña"
              type={showPassword ? "text" : "password"}
              id="password"
              className="peer w-full rounded-lg border-2 border-blue-100 bg-white px-3 py-3 text-gray-900 outline-none transition-all focus:border-blue-600"
              {...register("password", {
                required: "La contraseña obligatoria",
              })}
              error={errors.password?.message}
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 flex items-center px-3"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <BsEye color="gray" />
              ) : (
                <FiEyeOff color="gray" />
              )}
            </button>
          </div>
        </div>

        <div className="flex items-center space-x-2 pb-5">
          <input
            id="remember"
            type="checkbox"
            className="w-4 h-4 cursor-pointer"
            checked={rememberMe}
            onChange={() => setRememberMe(!rememberMe)}
          />
          <label
            htmlFor="remember"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Recordar
          </label>
        </div>

        <button
          className={`w-full bg-blue-800 hover:bg-blue-600 text-gray-50 font-bold p-3 rounded-lg uppercase ${glassClass}`}
          type="submit"
        >
          Iniciar sesión
        </button>
      </div>
    </form>
  );
};
