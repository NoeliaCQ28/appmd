// /**
//  * Ejecuta un procedimiento almacenado (Stored Procedure) en la base de datos.
//  *
//  * @param {import('mysql2/promise').Pool} pool - Pool de conexiones de MySQL.
//  * @param {string} spName - Nombre del procedimiento almacenado a ejecutar.
//  * @param {Array} params - Parámetros a pasar al procedimiento almacenado.
//  * @returns {Promise<Array>} -
//  *   Una promesa que resuelve con las filas devueltas por el procedimiento almacenado.
//  *   Cada elemento del arreglo representa una fila del resultado.
//  * @throws {Error} - Lanza un error si ocurre algún problema durante la ejecución.
//  */
// export async function executeSP(pool, spName, params) {
//   try {
//     const placeholders = params.map(() => "?").join(",");
//     const query = `CALL ${spName}(${placeholders})`;

//     const [row] = await pool.query(query, params);

//     return row;
//   } catch (error) {
//     console.error("Error ejecutando el SP:", error);
//     throw error;
//   }
// }

/**
 * Ejecuta un procedimiento almacenado en la base de datos, manejando parámetros IN y OUT de forma dinámica.
 * Si no hay parámetros OUT, la función sigue funcionando correctamente.
 *
 * @param {Object} options - Las opciones para ejecutar el procedimiento almacenado.
 * @param {import('mysql2/promise').Pool} options.pool - Pool de conexiones de MySQL.
 * @param {string} options.sp_name - Nombre del procedimiento almacenado a ejecutar.
 * @param {Object} options.parameters - Objeto que contiene los parámetros de entrada (IN) y salida (OUT).
 * @param {Array} options.parameters.in - Parámetros de entrada (IN) para el procedimiento almacenado.
 * @param {Array} options.parameters.out - Parámetros de salida (OUT) para el procedimiento almacenado (opcional).
 *
 * @returns {Promise<{result: Array, outputParamsResult: Object|null}>} -
 *   Un objeto que contiene:
 *   - `result`: Las filas devueltas por el procedimiento almacenado.
 *   - `outputParamsResult`: Un objeto con los valores de los parámetros OUT, o `null` si no existen.
 * @throws {Error} - Lanza un error si ocurre algún problema durante la ejecución.
 */
export async function executeStoredProcedure({ pool, sp_name, parameters }) {
  try {
    const { in: inputParams, out: outputParams } = parameters;

    const outputParamsCount = outputParams?.length | 0;

    if (outputParams && outputParamsCount < 0) {
      throw new Error("Debes proporcionar por lo menos un parámetro de salida");
    }

    const inputPlaceholders = inputParams.map(() => "?").join(",");

    const outputPlaceholders =
      outputParamsCount > 0
        ? Array(outputParamsCount)
            .fill("@outParam")
            .map((param, index) => `${param}${index + 1}`)
            .join(", ")
        : "";

    const callQuery = `CALL ${sp_name}(${inputPlaceholders}${
      outputPlaceholders ? `, ${outputPlaceholders}` : ""
    })`;

    const [result] = await pool.query(callQuery, inputParams);

    if (outputParamsCount === 0) {
      return { result, outputParams: null };
    }

    const selectQuery = `SELECT ${outputPlaceholders
      .split(", ")
      .map((param, index) => `${param} AS outParam${index + 1}`)
      .join(", ")}`;

    const [[outputParamsResult]] = await pool.query(selectQuery);

    return { result, outputParamsResult };
  } catch (error) {
    console.error("Error ejecutando el procedimiento almacenado:", error);
    throw error;
  }
}

/**
 * Executes a function in MySQL and returns its result.
 *
 * @param {import('mysql2/promise').Pool} pool - The mysql2 promise-based pool.
 * @param {string} functionName - The name of the stored function to call.
 * @param {Array<any>} [params=[]] - An array of parameters to pass to the function.
 * @returns {Promise<any>} - Resolves to the function's return value.
 * @throws {Error} - Throws if the query fails or returns no result.
 */
export async function executeFunction({ pool, functionName, params = [] }) {
  if (!pool || typeof pool.query !== "function") {
    throw new Error("A valid mysql2 promise-pool is required.");
  }
  if (!functionName || typeof functionName !== "string") {
    throw new Error("Function name must be a non-empty string.");
  }

  // Build parameter placeholders for the query
  const placeholders = params.map(() => "?").join(",");
  const sql = `SELECT \`${functionName}\`(${placeholders}) AS result`;

  try {
    const [rows] = await pool.query(sql, params);
    if (!rows || rows.length === 0 || !("result" in rows[0])) {
      throw new Error(`Function ${functionName} did not return a result.`);
    }
    return rows[0].result;
  } catch (err) {
    // Wrap and rethrow to preserve stack
    throw new Error(`Error executing function ${functionName}: ${err.message}`);
  }
}
