import { useMutation } from "@tanstack/react-query";
import BulkDataUploadService from "../../services/v2/BulkDataUploadService";
import { useReducer } from "react";
import { logger } from "../../../../../utils/logger";

const sheets = [
  {
    sheetName: "MOTORES",
    transformer: "motor",
    isSelected: false,
  },
  {
    sheetName: "ALTERNADORES",
    transformer: "alternator",
    isSelected: false,
  },
  {
    sheetName: "MARGENES NACIONALES",
    transformer: "margen_nacional",
    isSelected: false,
  },
  {
    sheetName: "MODELOS GE",
    transformer: "modelo_ge",
    isSelected: false,
  },
  {
    sheetName: "POTENCIA ALTERNADORES",
    transformer: "potencia_alternador",
    isSelected: false,
  },
  {
    sheetName: "COMBINACIONES NACIONALES",
    transformer: "combinacion_nacional",
    isSelected: false,
  },
  {
    sheetName: "COMBINACIONES EXPORTACIÓN",
    transformer: "combinacion_exportacion",
    isSelected: false,
  },
  {
    sheetName: "MÓDULOS",
    transformer: "modulo",
    isSelected: false,
  },
  {
    sheetName: "TIPO GE",
    transformer: "tipo_ge",
    isSelected: false,
  },
  {
    sheetName: "DERRATEO MOTOR 60hz",
    transformer: "derrateo_motor_60hz",
    isSelected: false,
  },
  {
    sheetName: "DERRATEO MOTOR 50hz",
    transformer: "derrateo_motor_50hz",
    isSelected: false,
  },
  {
    sheetName: "DERRATEO ALTERNADOR",
    transformer: "derrateo_alternador",
    isSelected: false,
  },
];

export const ACTIONS = Object.freeze({
  SET_FILE: "SET_FILE",
  TOGGLE_SELECT_SHEET: "TOGGLE_SELECT_SHEET",
  UPDATE_SHEET: "UPDATE_SHEET",
  RESET_STATE: "RESET_STATE",
});

async function downloadTemplate() {
  try {
    const templateBlob = await BulkDataUploadService.downloadTemplate();
    const url = window.URL.createObjectURL(templateBlob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "PLANTILLA-COTIZADOR.xlsx";
    document.body.appendChild(a);
    a.click();
    a.remove();
  } catch (error) {
    console.error("Error de descarga:", error);
  }
}

const initialState = {
  file: null,
  sheets: sheets,
};

const useBulkDataUpload = () => {
  function reducer(state, action) {
    switch (action.type) {
      case ACTIONS.SET_FILE:
        logger.info("ACTION SET_FILE", action.file);
        return { ...state, file: action.file };
      case ACTIONS.TOGGLE_SELECT_SHEET: {
        const toggleState = action.toggleState || false;
        const sheets = state.sheets.map((s) => {
          if (s.sheetName === action.sheet.sheetName) {
            if (!toggleState) {
              logger.info("Deselecting sheet, removing uploadResponse");
              return initialState.sheets.find(
                (s) => s.sheetName === action.sheet.sheetName
              );
            }
            return { ...s, isSelected: toggleState };
          }
          return s;
        });
        logger.info("ACTION TOGGLE_SELECT_SHEET", sheets);
        return { ...state, sheets: sheets };
      }
      case ACTIONS.UPDATE_SHEET: {
        const updatedSheet =
          typeof action.sheet === "function"
            ? action.sheet(
                state.sheets.find((s) => s.sheetName === action.sheetName)
              )
            : action.sheet;
        const sheets = state.sheets.map((s) =>
          s.sheetName === updatedSheet.sheetName ? updatedSheet : s
        );
        logger.info("ACTION UPDATE_SHEET", updatedSheet, sheets);
        return { ...state, sheets: sheets };
      }
      case ACTIONS.RESET_STATE:
        logger.info("ACTION RESET_STATE");
        return { file: null, sheets: sheets };
      default:
        return state;
    }
  }

  const [state, dispatch] = useReducer(reducer, initialState);

  const {
    mutate: uploadMutate,
    mutateAsync: uploadMutateAsync,
    isPending: isPendingUpload,
  } = useMutation({
    mutationFn: BulkDataUploadService.upload,
  });

  return {
    downloadTemplate,
    uploadMutate,
    uploadMutateAsync,
    isPendingUpload,
    dispatch,
    state,
  };
};

export default useBulkDataUpload;
