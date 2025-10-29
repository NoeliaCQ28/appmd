import db_pool from "../config/db.js";
import { handleResponse } from "../helpers/handlerResponse.js";

const LocationModel = {
  getAll: async () => {
    try {
      const [rows] = await db_pool.query(
        `SELECT name FROM locacion_paises ORDER BY name ASC`,
      );

      return handleResponse(rows, "Paises consultados con exito");
    } catch (error) {
      const { message } = error;
      return handleResponse(null, message, false, 500);
    }
  },
  getISO2FromCountryName: async (name) => {
    try {
      const [rows] = await db_pool.query(
        `SELECT iso2 FROM locacion_paises WHERE name = '${name}'`,
      );

      if (!rows.length) {
        return handleResponse(null, `El país ${name} no existe`, false, 400);
      }

      return handleResponse(
        rows[0],
        `ISO2 consultado con exito para el país ${name}`,
      );
    } catch (error) {
      const { message } = error;
      return handleResponse(null, message, false, 500);
    }
  },
  getCountryNameFromISO2: async (iso2) => {
    try {
      const [rows] = await db_pool.query(
        `SELECT name FROM locacion_paises WHERE iso2 = '${iso2}'`,
      );

      if (!rows.length) {
        return handleResponse(
          null,
          `El país con codigo ISO ${iso2} no existe`,
          false,
          400,
        );
      }

      return handleResponse(
        rows[0],
        `País consultado con exito a partir del código ISO ${iso2}`,
      );
    } catch (error) {
      const { message } = error;
      return handleResponse(null, message, false, 500);
    }
  },
  getCountriesWhereMODASAOperates: async () => {
    const countries = [
      "Perú",
      "Chile",
      "Colombia",
      "México",
      "Ecuador",
      "Bolivia",
      "Argentina",
      "Brasil",
      "Venezuela",
      "Costa Rica",
      "Guatemala",
      "Puerto Rico",
      "Rep. Dominicana",
      "El Salvador",
      "Honduras",
      "Islas Vírgenes Británicas",
      "Panamá",
      "USA",
      "Canadá",
    ];

    return handleResponse(
      countries.map((country) => ({ name: country })),
      "Paises consultados con exito donde MODASA S.A. opera",
    );
  },
  getStateNameFromFipsCode: async (country, fipsCode) => {
    try {
      const [rows] = await db_pool.query(
        `SELECT LR.name
          FROM locacion_regiones LR
                  INNER JOIN locacion_paises LP ON LP.iso2 COLLATE utf8mb4_unicode_ci = LR.country_code COLLATE utf8mb4_unicode_ci
          WHERE LR.fips_code = '${fipsCode}'
            AND LP.name = '${country}';`,
      );

      if (!rows.length) {
        return handleResponse(
          null,
          `La región/estado con codigo FIPS ${fipsCode} no existe`,
          false,
          400,
        );
      }

      return handleResponse(
        rows[0],
        `Región/Estado consultado con exito a partir del código FIPS ${fipsCode}`,
      );
    } catch (error) {
      const { message } = error;
      return handleResponse(null, message, false, 500);
    }
  },
  getFipsCodeFromStateName: async (country, stateName) => {
    try {
      const [rows] = await db_pool.query(
        `SELECT LR.fips_code
          FROM locacion_regiones LR
                  INNER JOIN locacion_paises LP ON LP.iso2 COLLATE utf8mb4_unicode_ci = LR.country_code COLLATE utf8mb4_unicode_ci
          WHERE LR.name = '${stateName}'
            AND LP.name = '${country}';`,
      );

      if (!rows.length) {
        return handleResponse(null, `La región/estado no existe`, false, 400);
      }

      return handleResponse(
        rows[0],
        `Región/Estado consultado con exito a partir del nombre ${stateName}`,
      );
    } catch (error) {
      const { message } = error;
      return handleResponse(null, message, false, 500);
    }
  },
  getProvinceNameBySAPProvinceName: async (
    country,
    stateName,
    SAPProviceName,
  ) => {
    try {
      const [rows] = await db_pool.query(
        `SELECT LP.name
          FROM locacion_provincias LP
                  INNER JOIN locacion_regiones LR ON LR.id = LP.region_id
                  INNER JOIN locacion_paises LPP
                              ON LPP.iso2 COLLATE utf8mb4_unicode_ci = LR.country_code COLLATE utf8mb4_unicode_ci
          WHERE LP.name LIKE '%${SAPProviceName}%'
            AND LR.name = '${stateName}'
            AND LPP.name = '${country}'
          LIMIT 1;`,
      );

      if (!rows.length) {
        return handleResponse(
          null,
          `La provincia ${SAPProviceName} no existe`,
          false,
          400,
        );
      }

      return handleResponse(
        rows[0],
        `Provincia consultada con exito a partir del Nombre en SAP: ${SAPProviceName}`,
      );
    } catch (error) {
      const { message } = error;
      return handleResponse(null, message, false, 500);
    }
  },
  getStatesByCountryName: async (name) => {
    try {
      const [rows] = await db_pool.query(
        `SELECT LR.name
          FROM locacion_regiones LR
                  INNER JOIN locacion_paises LP
                              ON LP.iso2 COLLATE utf8mb4_unicode_ci = LR.country_code COLLATE utf8mb4_unicode_ci
          WHERE LP.name = '${name}'
          ORDER BY LR.name;`,
      );

      return handleResponse(
        rows,
        `Estados consultados con exito para el país ${name}`,
      );
    } catch (error) {
      const { message } = error;
      return handleResponse(null, message, false, 500);
    }
  },
  getProvincesByStateName: async (country_name, state_name) => {
    try {
      const [stateCheck] = await db_pool.query(`
      SELECT LR.id
      FROM locacion_regiones LR
              INNER JOIN locacion_paises LP
                          ON LP.iso2 COLLATE utf8mb4_unicode_ci = LR.country_code COLLATE utf8mb4_unicode_ci
      WHERE LP.name = '${country_name}'
        AND LR.name = '${state_name}';
      `);

      if (!stateCheck.length) {
        return handleResponse(
          null,
          `El estado ${state_name} no pertenece al país ${country_name}`,
          false,
          400,
        );
      }

      const [rows] = await db_pool.query(
        `SELECT LP.name
          FROM locacion_provincias LP
                  INNER JOIN locacion_regiones LR ON LR.id = LP.region_id
                  INNER JOIN locacion_paises LPP
                              ON LPP.iso2 COLLATE utf8mb4_unicode_ci = LR.country_code COLLATE utf8mb4_unicode_ci
          WHERE LR.name = '${state_name}'
            AND LPP.name = '${country_name}'
          ORDER BY LP.name;`,
      );

      return handleResponse(
        rows,
        `Ciudades consultadas con exito para el estado ${state_name} y país ${country_name}`,
      );
    } catch (error) {
      const { message } = error;
      return handleResponse(null, message, false, 500);
    }
  },
  getProvincesByCountryName: async (country_name) => {
    try {
      const [rows] = await db_pool.query(
        `SELECT LP.name
          FROM locacion_provincias LP
                  INNER JOIN locacion_regiones LR ON LR.id = LP.region_id
                  INNER JOIN locacion_paises LPP
                              ON LPP.iso2 COLLATE utf8mb4_unicode_ci = LR.country_code COLLATE utf8mb4_unicode_ci
          WHERE LPP.name = '${country_name}'
          ORDER BY LP.name;`,
      );

      return handleResponse(
        rows,
        `Ciudades consultadas con exito para el país ${country_name}`,
      );
    } catch (error) {
      const { message } = error;
      return handleResponse(null, message, false, 500);
    }
  },
  getDistrictsByProvinceName: async (
    country_name,
    state_name,
    province_name,
  ) => {
    try {
      const [rows] = await db_pool.query(`
        SELECT LD.name
        FROM locacion_distritos LD
                INNER JOIN locacion_provincias LP ON LP.population = LD.population
                INNER JOIN locacion_regiones LR ON LR.id = LP.region_id
                INNER JOIN locacion_paises LPP
                            ON LPP.iso2 COLLATE utf8mb4_unicode_ci = LR.country_code COLLATE utf8mb4_unicode_ci
        WHERE LPP.name = '${country_name.replace("-", " ")}'
          AND LR.name = '${state_name.replace("-", " ")}'
          AND LP.name = '${province_name.replace("-", " ")}'
        ORDER BY LD.name;`);

      return handleResponse(
        rows,
        `Distritos consultados con exito para la provincia ${province_name}, estado ${state_name} y país ${country_name}`,
      );
    } catch (error) {
      const { message } = error;
      return handleResponse(null, message, false, 500);
    }
  },
};

export default LocationModel;
