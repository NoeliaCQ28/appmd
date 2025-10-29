"use client";

import { AlertCircle, RefreshCcw } from "lucide-react";
import { cn } from "../../utils/utils";
import { Button } from "../custom/buttons/Button";

/**
 * Un componente de error minimalista para usar dentro de Server Components
 *
 * @example
 * // En un Server Component padre:
 * export default async function ProductSection() {
 *   try {
 *     const products = await fetchProducts()
 *     return <ProductList products={products} />
 *   } catch (error) {
 *     return <ErrorComponent error={error as Error} reset={() => {}} />
 *   }
 * }
 */
export function ErrorComponent({
  error,
  resetErrorBoundary,
  variant = "default",
  showErrorDetails = true,
}) {
  // Determinar las clases según la variante
  const containerClasses = cn("rounded-md", {
    "p-4 bg-red-500/5 border border-red-600/20": variant === "default",
    "p-3 bg-red-500/5 border border-red-600/10": variant === "inline",
    "": variant === "minimal",
  });

  // Renderizar la variante adecuada
  if (variant === "minimal") {
    return (
      <div className={cn("flex items-center gap-2 text-sm text-destructive")}>
        <AlertCircle className="h-4 w-4" />
        <span>Error al cargar</span>
        <Button
          variant="destructive"
          size="sm"
          onClick={resetErrorBoundary}
          className="h-6 px-2 text-xs "
        >
          <RefreshCcw className="h-3 w-3 mr-1" />
          Reintentar
        </Button>
      </div>
    );
  }

  if (variant === "inline") {
    return (
      <div className={containerClasses}>
        <div className="flex items-center gap-2">
          <AlertCircle className="h-4 w-4 text-destructive" />
          <p className="text-sm font-medium text-destructive">
            No se pudo cargar el contenido
          </p>
          <Button
            variant="destructive"
            size="sm"
            onClick={resetErrorBoundary}
            className="ml-auto h-7 px-2"
          >
            <RefreshCcw className="h-3 w-3 mr-1" />
            Reintentar
          </Button>
        </div>
        {showErrorDetails && (
          <p className="mt-2 text-xs text-muted-foreground">{error.message}</p>
        )}
      </div>
    );
  }

  // Variante default
  return (
    <div className={containerClasses}>
      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
        <div className="flex items-center gap-2">
          <div className="rounded-full bg-destructive/20 p-1">
            <AlertCircle className="h-4 w-4 text-destructive" />
          </div>
          <div>
            <h3 className="text-sm font-medium">
              Error al cargar el contenido
            </h3>
            {showErrorDetails && (
              <p className="text-xs text-muted-foreground mt-1">
                {error.message}
              </p>
            )}
          </div>
        </div>
        <Button
          variant="destructive"
          size="sm"
          onClick={resetErrorBoundary}
          className="sm:ml-auto"
        >
          <RefreshCcw className="h-3 w-3 mr-2" />
          Reintentar
        </Button>
      </div>
    </div>
  );
}
