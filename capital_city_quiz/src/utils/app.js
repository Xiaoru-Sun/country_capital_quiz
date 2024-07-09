import axios from "axios";

export const getCountryAndCapitalCity = axios.get(
  "https://countriesnow.space/api/v0.1/countries/capital"
);

export const getCountryAndCities = axios.get(
  "https://countriesnow.space/api/v0.1/countries"
);
