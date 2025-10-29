export const CeilOperaciones = ({ handleClick, children, className }) => {
  return (
    <button className={`${className}`} onClick={handleClick} type="button">
      {children}
    </button>
  );
};
