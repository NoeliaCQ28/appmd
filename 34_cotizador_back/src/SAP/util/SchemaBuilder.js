export function SchemaBuilder(template) {
  // Creamos un objeto "resultado" inicializando cada propiedad con su valor por defecto.
  const result = {};
  Object.keys(template).forEach((key) => {
    result[key] = template[key].value;
  });

  // Retornamos un Proxy que intercepta llamadas a métodos "with<PropertyName>"
  return new Proxy(
    {
      build() {
        return result;
      },
    },
    {
      get(target, prop) {
        // Si la propiedad ya existe en el objeto target (como "build"), se retorna.
        if (prop in target) {
          return target[prop];
        }
        // Si se llama a un método que empieza con "with", lo interpretamos como un setter.
        if (typeof prop === "string" && prop.startsWith("with")) {
          // Extraemos el nombre del campo.
          const key = prop.slice(4);
          return function (value) {
            if (!(key in template)) {
              console.warn(`La propiedad "${key}" no existe en la plantilla.`);
              return this;
            }
            const meta = template[key];

            // Validación del tipo de dato.
            if (meta.type && typeof value !== meta.type) {
              throw new Error(
                `El valor para "${key}" debe ser de tipo ${
                  meta.type
                }, pero se recibió ${typeof value}.`
              );
            }

            // Validación para campos de tipo string.
            if (
              meta.type === "string" &&
              meta.maxLength &&
              value.length > meta.maxLength
            ) {
              throw new Error(
                `El valor para "${key}" excede el tamaño máximo de ${meta.maxLength}.`
              );
            }

            // Validación para campos de tipo number.
            if (meta.type === "number") {
              if (meta.hasOwnProperty("max") && value > meta.max) {
                throw new Error(
                  `El valor para "${key}" excede el valor máximo de ${meta.max}.`
                );
              }
              if (meta.hasOwnProperty("min") && value < meta.min) {
                throw new Error(
                  `El valor para "${key}" es menor al valor mínimo de ${meta.min}.`
                );
              }
            }

            result[key] = value;
            return this;
          };
        }
        return undefined;
      },
    }
  );
}
