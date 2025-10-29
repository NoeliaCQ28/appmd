import { useEffect, useState } from "react";
import inicio from "/inicio.jpg";
import inicio_landscape from "/inicio_landscape.jpeg";
export const DashboardView = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkIsMobile(); // Check on initial load
    window.addEventListener("resize", checkIsMobile);
    return () => window.removeEventListener("resize", checkIsMobile);
  }, []);

  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <div className="w-full h-full flex items-center justify-center overflow-hidden bg-gray-100">
      {!imageLoaded && (
        <div className="w-screen h-screen bg-gray-300 animate-pulse"></div>
      )}
      <img
        src={isMobile ? inicio : inicio_landscape}
        alt="Imagen de inicio"
        className={`w-full h-full object-cover object-center rounded-md transition-opacity duration-300 ${
          imageLoaded ? "opacity-100" : "opacity-0"
        }`}
        loading="eager"
        onLoad={() => setImageLoaded(true)}
      />
    </div>
  );
};
