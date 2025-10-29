import { BadgeCheck, BadgeCheckIcon, Hammer, XCircleIcon } from "lucide-react";
import React from "react";
import { Button } from "../../../../components/custom/buttons/Button";
import { cn } from "../../../../utils/utils";

export const ValidationField = ({
  title,
  description,
  isValid,
  onInvalidate,
  invalidateMessage,
  isLoading = false,
}) => {
  return (
    <section className="flex items-center gap-3">
      {isValid ? (
        <BadgeCheckIcon className="fill-green-500 text-white" />
      ) : (
        <XCircleIcon className="fill-red-500 text-white" />
      )}
      <section>
        <section
          className={cn(
            "flex flex-col max-w-[320px]",
            isLoading && "animate-pulse"
          )}
        >
          <p>{title}</p>
          <p className="text-xs">{description}</p>
        </section>
      </section>
      {!isValid && invalidateMessage && invalidateMessage !== "" && !isLoading  && (
        <section>
          <Button
            onClick={onInvalidate}
            disabled={isLoading}
            className={cn(
              "text-xs sm:px-1 sm:py-1 sm:max-w-30 gap-1",
              isLoading && "animate-pulse"
            )}
            variant="secondary"
          >
            {isLoading ? "Cargando..." : invalidateMessage}

            <Hammer />
          </Button>
        </section>
      )}
    </section>
  );
};
