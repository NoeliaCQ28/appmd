import swaggerAutogen from "swagger-autogen";

const doc = {
  info: {
    title: "MODASA Cotizador API",
    version: "1.0.0",
    description:
      "API REST para el sistema de cotización de equipos eléctricos de MODASA S.A. Integración con SAP ERP para Grupos Electrógenos, Cables, Celdas y Transformadores.",
    contact: {
      name: "MODASA S.A.",
      email: "soporte@modasa.com.pe",
    },
    license: {
      name: "Privado",
    },
  },
  servers: [
    {
      url: "http://localhost:3000",
      description: "Servidor Local",
    },
    {
      url: "54.83.80.78/proyectos/api-dev-cotizador",
      description: "Servidor Desarrollo",
      variables: {
        protocol: {
          enum: ["http", "https"],
          default: "http",
        },
      },
    },
    {
      url: "cotizador.modasa.com.pe",
      description: "Servidor Producción",
      variables: {
        protocol: {
          enum: ["http", "https"],
          default: "https",
        },
      },
    },
  ],
  tags: [
    { name: "En curso", description: "Documentación en desarrollo" },
    {
      name: "Completado",
      description: "Documentación finalizada",
    },
    {
      name: "v1",
      description: "Versión 1",
    },
    {
      name: "v2",
      description: "Versión 2",
    },
    {
      name: "Health",
      description: "Estado del servicio",
    },
    {
      name: "Auth",
      description: "Autenticación y autorización de usuarios",
    },
    {
      name: "Cotizaciones",
      description:
        "Gestión de cotizaciones (Grupos Electrógenos, Cables, Celdas, Transformadores)",
    },
    {
      name: "Grupos Electrógenos",
      description: "Gestión de generadores eléctricos",
    },
    {
      name: "Cables",
      description: "Gestión de cables eléctricos",
    },
    {
      name: "Transformadores",
      description: "Gestión de transformadores",
    },
    {
      name: "Celdas",
      description: "Gestión de celdas eléctricas",
    },
    {
      name: "Clientes",
      description: "Gestión de clientes y sucursales",
    },
    {
      name: "SAP Integration",
      description:
        "Integración con SAP ERP (Clientes, Materiales, Cotizaciones)",
    },
    {
      name: "Configuración",
      description:
        "Monedas, mercados, incoterms, condiciones comerciales, etc.",
    },
    {
      name: "Usuarios y Roles",
      description: "Gestión de usuarios, roles y permisos",
    },
    {
      name: "Reportes",
      description: "Generación de reportes",
    },
    {
      name: "Archivos",
      description: "Carga y gestión de archivos (S3)",
    },
  ],
  components: {
    securitySchemes: {
      BearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
        description: "Token JWT obtenido del endpoint /api/auth/login",
      },
    },
    schemas: {
      Error: {
        type: "object",
        properties: {
          data: {
            type: "null",
          },
          message: {
            type: "string",
            example: "Mensaje de error descriptivo",
          },
          success: {
            type: "boolean",
            example: false,
          },
          code: {
            type: "integer",
            example: 400,
          },
        },
      },
      SuccessResponse: {
        type: "object",
        properties: {
          data: {
            type: "object",
            description: "Datos de respuesta",
          },
          message: {
            type: "string",
            example: "Operación exitosa",
          },
          success: {
            type: "boolean",
            example: true,
          },
          code: {
            type: "integer",
            example: 200,
          },
        },
      },
      AuthLoginRequest: {
        type: "object",
        properties: {
          email: {
            type: "string",
            format: "email",
            example: "admin@mail.com",
            description: "Correo electrónico del usuario",
          },
          password: {
            type: "string",
            format: "password",
            example: "pass",
            description: "Contraseña del usuario",
          },
        },
        required: ["email", "password"],
      },
      CurrentUserResponse: {
        type: "object",
        properties: {
          id: {
            type: "integer",
            example: 3,
            description: "ID del usuario",
          },
          name: {
            type: "string",
            example: "Administrador",
            description: "Nombre del usuario",
          },
          email: {
            type: "string",
            format: "email",
            example: "admin@mail.com",
            description: "Correo electrónico del usuario",
          },
          role: {
            type: "string",
            example: "Administrador",
            description: "Rol del usuario",
          },
          isAdmin: {
            type: "boolean",
            example: true,
            description: "Indica si el usuario tiene permisos de administrador",
          },
          iat: {
            type: "integer",
            example: 1760044794,
            description: "Timestamp de emisión del token (issued at)",
          },
          exp: {
            type: "integer",
            example: 1760649594,
            description: "Timestamp de expiración del token",
          },
        },
      },
      RegisterUserRequest: {
        type: "object",
        properties: {
          sUsuNombre: {
            type: "string",
            example: "Mendoza22",
            description: "Nombre del usuario",
          },
          sUsuLogin: {
            type: "string",
            format: "email",
            example: "vmendoza22@modasa.com.pe",
            description: "Correo electrónico del usuario",
          },
          sUsuContrasena: {
            type: "string",
            format: "password",
            example: "2025",
            description: "Contraseña del usuario",
          },
          nUsuUsuario_Own: {
            type: "integer",
            example: 0,
            description: "ID del usuario que crea este nuevo usuario",
          },
          nRolId: {
            type: "integer",
            example: 1,
            description: "ID del rol asignado al usuario",
          },
        },
        required: [
          "sUsuNombre",
          "sUsuLogin",
          "sUsuContrasena",
          "nUsuUsuario_Own",
          "nRolId",
        ],
      },
    },
    responses: {
      UnauthorizedError: {
        description: "Token no válido o expirado",
        content: {
          "application/json": {
            schema: {
              $ref: "#/components/schemas/Error",
            },
          },
        },
      },
      NotFoundError: {
        description: "Recurso no encontrado",
        content: {
          "application/json": {
            schema: {
              $ref: "#/components/schemas/Error",
            },
          },
        },
      },
      ValidationError: {
        description: "Error de validación de datos",
        content: {
          "application/json": {
            schema: {
              $ref: "#/components/schemas/Error",
            },
          },
        },
      },
    },
  },
  security: [
    {
      BearerAuth: [],
    },
  ],
};

const outputFile = "./../config/openapi.json";
const routes = ["./../server.js"];

/* NOTE: If you are using the express Router, you must pass in the 'routes' only the 
root file where the route starts, such as index.js, app.js, routes.js, etc ... */

swaggerAutogen({ openapi: "3.0.0" })(outputFile, routes, doc);
