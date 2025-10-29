import { Logo } from "@components/custom/icons/Logo";
import { useState } from "react";
import { LoginForm } from "./../components/LoginForm";
import modasa from "/login.png";

export const Login = () => {
  const [imageLoaded, setImageLoaded] = useState(false);

  // Maintenance mode information from env variables
  const maintenanceMode = import.meta.env.VITE_MAINTENANCE_MODE === "true";
  const maintenanceMessage =
    import.meta.env.VITE_MAINTENANCE_MODE_MESSAGE || "Sitio en mantenimiento";
  const maintenanceStartDate = import.meta.env.VITE_MAINTENANCE_MODE_START_DATE;
  const maintenanceEndDate = import.meta.env.VITE_MAINTENANCE_MODE_END_DATE;

  return (
    <>
      {maintenanceMode && (
        <div className="fixed top-0 left-0 w-full bg-amber-500 text-white py-2 px-4 z-50">
          <div className="max-w-7xl mx-auto flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 10V3L4 14h7v7l9-11h-7z"
              />
            </svg>
            <p className="font-medium">
              Sitio en mantenimiento desde {maintenanceStartDate} hasta{" "}
              {maintenanceEndDate} | {maintenanceMessage}
            </p>
          </div>
        </div>
      )}

      <div className="flex min-h-screen items-center justify-center lg:p-8">
        <div className="flex w-full lg:max-w-7xl gap-8 lg:w-full">
          <div className="flex w-full flex-col lg:p-10 p-3">
            <div className="flex items-center pb-12">
              <Logo className={`w-32`} />
            </div>
            <div className="flex w-full flex-col gap-8 items-center p-10">
              <LoginForm />
            </div>
          </div>

          <div className="items-center justify-center hidden lg:block lg:w-[600px]">
            <div className="overflow-hidden rounded-lg h-[600px] relative w-[600px]">
              {!imageLoaded && (
                <div className="absolute inset-0 bg-gray-200 animate-pulse"></div>
              )}
              <img
                src={modasa}
                alt="Login Image"
                className="object-cover w-full h-full"
                onLoad={() => setImageLoaded(true)}
                style={{ opacity: imageLoaded ? 1 : 0 }}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
