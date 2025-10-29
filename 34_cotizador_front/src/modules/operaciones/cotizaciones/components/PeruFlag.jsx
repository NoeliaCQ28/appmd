import { cn } from "../../../../utils/utils";

export const PeruFlag = ({ className }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="18"
      viewBox="0 0 24 18"
      fill="none"
      className={cn("border-1 rounded-[4px]", className)}
    >
      <rect x="0" y="0" width="24" height="18" fill="#D91023" />
      <rect x="8" y="0" width="8" height="18" fill="#FFF" />
    </svg>
  );
};
