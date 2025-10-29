import modasa from "/modasa.png";

export const Logo = ({className}) => {
  return (
    <>
        <img className={className} src={modasa} alt={`Logo modasa`} />
    </>
  )
}
