import LocationModel from "../models/locationModel.js";

const LocationController = {
  getAll: async (req, res) => {
    const response = await LocationModel.getAll();
    res.status(response.code).send(response);
  },
  getStatesByCountryName: async (req, res) => {
    const { name } = req.params;
    const nativeCountryName = name.replace(/-/g, " ");
    const response = await LocationModel.getStatesByCountryName(
      nativeCountryName
    );
    res.status(response.code).send(response);
  },
  getProvincesByStateName: async (req, res) => {
    const { country_name, state_name } = req.params;
    const nativeCountryName = country_name.replace(/-/g, " ");
    const nativeStateName = state_name.replace(/-/g, " ");
    const response = await LocationModel.getProvincesByStateName(
      nativeCountryName,
      nativeStateName
    );
    res.status(response.code).send(response);
  },
  getProvincesByCountryName: async (req, res) => {
    const { country_name } = req.params;
    const nativeCountryName = country_name.replace(/-/g, " ");
    const response = await LocationModel.getProvincesByCountryName(
      nativeCountryName
    );
    res.status(response.code).send(response);
  },
  getISO2FromCountryName: async (req, res) => {
    const { name } = req.params;
    const nativeCountryName = name.replace(/-/g, " ");
    const response = await LocationModel.getISO2FromCountryName(
      nativeCountryName
    );
    res.status(response.code).send(response);
  },
  getCountryNameFromISO2: async (req, res) => {
    const { iso2 } = req.params;
    const response = await LocationModel.getCountryNameFromISO2(iso2);
    res.status(response.code).send(response);
  },
  getCountriesWhereMODASAOperates: async (req, res) => {
    const response = await LocationModel.getCountriesWhereMODASAOperates();
    res.status(response.code).send(response);
  },
  getStateNameFromFipsCode: async (req, res) => {
    const { name: country, fipsCode } = req.params;
    const response = await LocationModel.getStateNameFromFipsCode(
      country,
      fipsCode
    );
    res.status(response.code).send(response);
  },
  getProvinceNameBySAPName: async (req, res) => {
    const { country_name, state_name, SAPProvinceName } = req.params;
    const response = await LocationModel.getProvinceNameBySAPProvinceName(
      country_name,
      state_name,
      SAPProvinceName
    );
    res.status(response.code).send(response);
  },
  getDistrictsByProvinceName: async (req, res) => {
    const { country_name, state_name, province_name } = req.params;
    const response = await LocationModel.getDistrictsByProvinceName(
      country_name,
      state_name,
      province_name
    );
    res.status(response.code).send(response);
  }
};

export default LocationController;
