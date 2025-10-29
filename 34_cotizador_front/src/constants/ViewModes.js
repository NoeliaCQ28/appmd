const ViewModes = Object.freeze({
  CREATE: "CREATE",
  EDIT: "EDIT",
  VIEW: "VIEW",
  isReadOnly: (mode) => mode === ViewModes.VIEW,
});
export default ViewModes;
