import express from "express";
import LocationController from "../controllers/locationController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", authMiddleware, LocationController.getAll);
router.get(
  "/:name/states",
  authMiddleware,
  LocationController.getStatesByCountryName,
);
router.get(
  "/:name/states/fips/:fipsCode",
  authMiddleware,
  LocationController.getStateNameFromFipsCode,
);
router.get(
  "/:country_name/states/:state_name/provinces",
  authMiddleware,
  LocationController.getProvincesByStateName,
);
router.get(
  "/:country_name/provinces",
  LocationController.getProvincesByCountryName,
);
router.get(
  "/:country_name/states/:state_name/provinces/SAPProvinceName/:SAPProvinceName",
  authMiddleware,
  LocationController.getProvinceNameBySAPName,
);
router.get(
  "/:name/iso2",
  authMiddleware,
  LocationController.getISO2FromCountryName,
);
router.get(
  "/iso2/:iso2",
  authMiddleware,
  LocationController.getCountryNameFromISO2,
);
router.get(
  "/modasa-operates",
  LocationController.getCountriesWhereMODASAOperates,
);
router.get(
  "/:country_name/states/:state_name/provinces/:province_name/districts",
  authMiddleware,
  LocationController.getDistrictsByProvinceName,
);

export default router;
