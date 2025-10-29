const peruDepartments = [
  { index: 1, name: "Amazonas" },
  { index: 2, name: "Áncash" },
  { index: 3, name: "Apurímac" },
  { index: 4, name: "Arequipa" },
  { index: 5, name: "Ayacucho" },
  { index: 6, name: "Cajamarca" },
  { index: 7, name: "Callao" },
  { index: 8, name: "Cusco" },
  { index: 9, name: "Huancavelica" },
  { index: 10, name: "Huánuco" },
  { index: 11, name: "Ica" },
  { index: 12, name: "Junín" },
  { index: 13, name: "La Libertad" },
  { index: 14, name: "Lambayeque" },
  { index: 15, name: "Lima" },
  { index: 16, name: "Loreto" },
  { index: 17, name: "Madre de Dios" },
  { index: 18, name: "Moquegua" },
  { index: 19, name: "Pasco" },
  { index: 20, name: "Piura" },
  { index: 21, name: "Puno" },
  { index: 22, name: "San Martín" },
  { index: 23, name: "Tacna" },
  { index: 24, name: "Tumbes" },
  { index: 25, name: "Ucayali" },
];

export const getIndexOfDepartment = (department) => {
  return peruDepartments.find((d) => d.name === department)?.index || 0;
};
