import dotenv from "dotenv";

export default ({}, config) => {
  dotenv.config();

  config.baseUrl = process.env.E2E_BASE_URL;

  return config;
};
