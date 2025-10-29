import { api } from "@libs/axios";
import { useMutation, useQuery } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { useState } from "react";

const getCountries = async () => {
  try {
    const { data } = await api.get("/v1/countries");
    if (data.success) {
      return data.data;
    }
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message);
    }
  }
};

const getCountriesWhereMODASAOperates = async () => {
  try {
    const { data } = await api.get("/v1/countries/modasa-operates");
    if (data.success) {
      return data.data;
    }
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message);
    }
  }
};

const getStatesByCountryName = async (countryName) => {
  try {
    const countryNameSanitized = countryName.replace(/ /g, "-");
    const url = `/v1/countries/${countryNameSanitized}/states`;
    const { data } = await api.get(url);
    if (data.success) {
      return data.data;
    }
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message);
    }
  }
};

const getProvincesByStateName = async (countryName, stateName) => {
  try {
    const countryNameSanitized = countryName.replace(/ /g, "-");
    const stateNameSanitized = stateName.replace(/ /g, "-");
    const url = `/v1/countries/${countryNameSanitized}/states/${stateNameSanitized}/provinces`;
    const { data } = await api.get(url);
    if (data.success) {
      return data.data;
    }
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message);
    }
  }
};

const getProvincesByCountryName = async (countryName) => {
  try {
    const countryNameSanitized = countryName.replace(/ /g, "-");
    const url = `/v1/countries/${countryNameSanitized}/provinces`;
    const { data } = await api.get(url);
    if (data.success) {
      return data.data;
    }
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message);
    }
  }
};

//////////////////////////////////////////

const getCountryNameFromISO2 = async ({ iso2 }) => {
  try {
    const { data } = await api.get(`/v1/countries/iso2/${iso2}`);
    if (data.success) {
      return data.data;
    }
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message);
    }
  }
};

const getStateNameFromFipsCode = async ({ country, fipsCode }) => {
  try {
    const { data } = await api.get(
      `/v1/countries/${country}/states/fips/${fipsCode}`
    );
    if (data.success) {
      return data.data;
    }
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message);
    }
  }
};

const getProvinceNameFromSAPProvinceName = async ({
  country,
  state,
  SAPCityName: SAPProvinceName,
}) => {
  try {
    const { data } = await api.get(
      `/v1/countries/${country}/states/${state}/provinces/SAPProvinceName/${SAPProvinceName}`
    );
    if (data.success) {
      return data.data;
    }
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message);
    }
  }
};

const getDistrictsByProvinceName = async (
  countryName,
  stateName,
  provinceName
) => {
  try {
    const countryNameSanitized = countryName.replace(/ /g, "-");
    const stateNameSanitized = stateName.replace(/ /g, "-");
    const provinceNameSanitized = provinceName.replace(/ /g, "-");
    const url = `/v1/countries/${countryNameSanitized}/states/${stateNameSanitized}/provinces/${provinceNameSanitized}/districts`;
    const { data } = await api.get(url);
    if (data.success) {
      return data.data;
    }
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message);
    }
  }
};

const useLocation = (
  {
    initialValues = {
      country: "",
      state: "",
      city: "",
      district: "",
    },
  } = {
    initialValues: { country: "", state: "", city: "", district: "" },
  }
) => {
  const [selectedCountry, setSelectedCountry] = useState(initialValues.country);
  const [selectedState, setSelectedState] = useState(initialValues.state);
  const [selectedCity, setSelectedCity] = useState(initialValues.city);
  const [selectedDistrict, setSelectedDistrict] = useState(
    initialValues.district
  );

  const { data: countries = [] } = useQuery({
    queryKey: ["countries"],
    queryFn: getCountries,
    select: (data) => data.map((country) => country.name),
  });

  const { data: countriesWhereMODASAOperates = [] } = useQuery({
    queryKey: ["countries-where-modasa-operates"],
    queryFn: getCountriesWhereMODASAOperates,
    select: (data) => data.map((country) => country.name),
  });

  const { data: states = [] } = useQuery({
    queryKey: ["states", selectedCountry],
    queryFn: () => getStatesByCountryName(selectedCountry),
    enabled: !!selectedCountry,
    select: (data) => data.map((state) => state.name),
  });

  const { data: cities = [] } = useQuery({
    queryKey: ["cities", selectedState],
    queryFn: () => getProvincesByStateName(selectedCountry, selectedState),
    enabled: !!selectedState,
    select: (data) => data.map((city) => city.name),
  });

  const { data: citiesOfCountry = [] } = useQuery({
    queryKey: ["cities", selectedCountry],
    queryFn: () => getProvincesByCountryName(selectedCountry),
    enabled: !!selectedCountry,
    select: (data) => data.map((city) => city.name),
  }); 

  const { data: districts = [] } = useQuery({
    queryKey: ["districts", selectedCountry, selectedState, selectedCity],
    queryFn: () =>
      getDistrictsByProvinceName(selectedCountry, selectedState, selectedCity),
    enabled: !!selectedCity,
    select: (data) => data.map((district) => district.name),
  });

  const handleCountryChange = (countryId) => {
    setSelectedCountry(countryId);
    setSelectedState("");
    setSelectedCity("");
    setSelectedDistrict("");
  };

  const handleStateChange = (stateId) => {
    setSelectedState(stateId);
    setSelectedCity("");
    setSelectedDistrict("");
  };

  const handleCityChange = (cityId) => {
    setSelectedCity(cityId);
    setSelectedDistrict("");
  };

  const handleDistrictChange = (districtId) => {
    setSelectedDistrict(districtId);
  };

  /////////////////////////////////////////////////
  const {
    data: countryNameFromISO2,
    mutateAsync: getCountryNameFromISO2MutateAsync,
  } = useMutation({
    mutationFn: getCountryNameFromISO2,
  });
  const {
    data: stateNameFromFipsCode,
    mutateAsync: getStateNameFromFipsCodeMutateAsync,
  } = useMutation({
    mutationFn: getStateNameFromFipsCode,
  });

  const {
    data: cityNameFromSAPCityName,
    mutateAsync: getCityNameFromSAPCityNameMutateAsync,
  } = useMutation({
    mutationFn: getProvinceNameFromSAPProvinceName,
  });

  return {
    countries,
    countriesWhereMODASAOperates,
    states,
    cities,
    citiesOfCountry,
    districts,
    selectedCountry,
    selectedState,
    selectedCity,
    selectedDistrict,
    handleCountryChange,
    handleStateChange,
    handleCityChange,
    handleDistrictChange,
    getCountryNameFromISO2MutateAsync,
    countryNameFromISO2,
    getStateNameFromFipsCodeMutateAsync,
    stateNameFromFipsCode,
    getCityNameFromSAPCityNameMutateAsync,
    cityNameFromSAPCityName,
  };
};

export default useLocation;
