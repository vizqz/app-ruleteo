import { useLocation } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname,
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
      <div className="text-center">
        <h1 className="text-5xl font-heading mb-2">404</h1>
        <p className="text-base text-muted-foreground mb-4">¡Ups! Página no encontrada</p>
        <a href="/" className="text-primary underline">
          Volver al inicio
        </a>
      </div>
    </div>
  );
};

export default NotFound;
