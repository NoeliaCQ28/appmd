# Copilot Instructions for MODASA Cotizador Backend

## Architecture Overview

**Bun/Express API** for electrical equipment quotation system integrating with **SAP ERP**. Handles 4 product types: Generators (Grupos Electrógenos), Cables, Cells (Celdas), and Transformers (Transformadores).

### Stack & Key Components

- **Runtime**: Bun 1.2.22 (NOT Node.js) - use `bun` commands, not `npm`
- **Database**: MySQL via stored procedures - use `executeStoredProcedure`/`executeFunction` from `#libs/dbUtils.js`
- **ERP Integration**: SAP via `ERP_PROXY_API` axios instance (`src/libs/axios.js`) with API key auth
- **Real-time**: Socket.IO for health monitoring (`src/sockets/modules/HealthSocketModule.js`)
- **Storage**: AWS S3 (`src/libs/s3Service.js`)
- **Auth**: JWT middleware extracts `req.user.id` for all protected routes

## Critical Business Logic: Quote Lifecycle

### Quote Types (`nCotTipo` / `cotizador_tipo`)

1. **Generators (1)**: Multi-component validation (motor + alternator + ITM kit + optionals)
2. **Cables (2)**: Single material validation
3. **Cells (3)**: Single material validation  
4. **Transformers (4)**: Single material validation

### Quote-to-SAP Flow (`src/models/quoteModel.js`)

```javascript
// 1. Create quote locally with details
QuotesModel.create(user_id, { cotizador_tipo, details, ... })

// 2. Validate before sending to SAP
QuotesModel.validateQuote(user_id, cotizacion_id)
  // - Checks SAP material stock via MaterialSAPModel.getStock()
  // - Validates distribution channel compatibility
  // - Ensures customer has SAP code & currency match
  // - For generators: validates motor, alternator, ITM separately

// 3. State change to 6 triggers SAP order creation
QuotesModel.updateState(user_id, cotizacion_id, { state: 6 })
  // - Calls transformToSAPQuote() to build SAP payload
  // - Posts to ERP_PROXY_API.post("/quote", payload)
  // - Stores returned SAP reference code (Vbeln)
```

**Generator Complexity**: Each detail has nested components requiring individual stock checks:
- `sMotCodigoSAP` (motor), `sAltCodigoSAP` (alternator), `sITMCodigoSAP` (ITM kit)
- Can contain multiple comma-separated SAP codes - validation uses first code only
- See validation logic at `quoteModel.js:467-620`

## Development Patterns (Enforce These)

### Database Access
```javascript
import { executeStoredProcedure, executeFunction } from "#libs/dbUtils.js";

// Stored procedures return nested arrays
const { result: [rows], outputParamsResult } = await executeStoredProcedure({
  pool: db_pool,
  sp_name: "cot_listarC",
  parameters: { in: [cotizacion_id], out: ["@pCotizacion_Id"] }
});
// Access: rows[0].ColumnName, outputParamsResult.outParam1

// Functions return scalar values
const isValid = await executeFunction({
  pool: db_pool,
  functionName: "validar_cliente_mismo_canal_cotizacion",
  params: [customerId, cotizacion_id]
});
```

### Response Format (Always Use)
```javascript
import { handleResponse } from "#helpers/handlerResponse.js";
return handleResponse(data, "Success message", true, 200);
// Format: { data, message, success, code }
```

### Import Aliases (Required)
```javascript
// Defined in package.json "imports" - never use relative paths
import { logger } from "#libs/logger.js";
import { handleResponse } from "#helpers/handlerResponse.js";
import QuoteModel from "#models/quoteModel.js";
import { ERP_PROXY_API } from "#libs/axios.js";
```

### Controller Pattern
```javascript
// Controllers are thin - business logic lives in Models
const QuoteController = {
  create: async (req, res) => {
    const user_id = req.user.id; // From JWT middleware
    const { id } = req.params;   // Destructure params
    const data = req.body;
    
    const response = await QuoteModel.create(user_id, data);
    res.status(response.code).send(response);
  }
};
```

## Development Workflow

### Commands
```powershell
# Development (auto-reload enabled)
bun dev

# Testing
bun test              # All tests (Vitest)
bun run test:SAP      # SAP integration tests only

# Code quality (Biome formatter/linter)
bun run biome:check   # Auto-fix formatting & linting
```

### Docker Environments
- Development: `compose.dev.yml` with `Dockerfile.dev` (runs `bun dev`)
- Production: `compose.yml` with `Dockerfile` (runs `bun start`)
- 30+ environment variables required - check compose files for full list

### API Documentation
- Auto-generated from `src/build/api-spec.js` on `bun dev`
- Served via Scalar UI at runtime

## Critical Integration Points

### SAP Material Stock Validation
```javascript
// ALWAYS validate stock before operations
import { MaterialSAPModel } from "../SAP/materials/models/MaterialSAPModel.js";

const stock = await MaterialSAPModel.getStock({
  matnr: "SAP_CODE",        // Material code
  werks: distributionChannel // Plant/distribution channel code
});
const available = stock?.data?.items?.[0]?.StockDisp || 0;
```

### Quote Detail Routing by Type
Quote details use type-specific models in `src/models/quoteTypeModels/`:
- `quoteGEDetailModel.js` - Generators
- `quoteCableDetailModel.js` - Cables
- `quoteCellDetailModel.js` - Cells
- `quoteTransformerDetailModel.js` - Transformers

Router pattern at `src/models/v2/quote/QuoteRouter.js` dispatches by `nCotTipo`.

### Socket.IO Health Monitoring
```javascript
// index.js initializes health checks for ERP endpoints
HealthSocketModule.build({ io, modules }, {
  serverName: "MODASA S.A. ERP (DEV)",
  url: `${ERP_PROXY_API_ENDPOINT}sap-proxy/healthcheck/dev`,
  intervalMs: 10000
});
```

## Common Pitfalls

1. **Stored Procedure Returns**: Result is `{ result: [[actualData]], outputParamsResult: {...} }` - always destructure correctly
2. **SAP Code Multiplicity**: Material codes can be comma-separated strings - split and use first for validation
3. **State Machine**: Quote state 6 is special - triggers SAP order creation automatically
4. **Import Aliases**: Using `../../` paths breaks - always use `#libs/*`, `#models/*` aliases
5. **Runtime**: This is Bun, not Node.js - no `npm` commands
6. **Distribution Channel**: Must match between quote, customer, and SAP materials for validation to pass

## Testing Strategy

- **Framework**: Vitest with `globals: true`
- **Structure**: `test/SAP/` for integration tests (require ERP proxy running)
- **Environment**: Set `NODE_ENV=testing` for test runs
- **Pattern**: Use `supertest` for HTTP endpoint testing (see `test/server.test.js`)
