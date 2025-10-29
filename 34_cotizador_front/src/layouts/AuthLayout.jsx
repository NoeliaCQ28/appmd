import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export const AuthLayout = () => {
  const { data } = useAuth();

  if (data) return <Navigate to={"/"} />;

  return (
    <>
      <Outlet />
    </>
  );
};
