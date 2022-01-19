import { getEnv } from "@core/utilities/env";

const EnvKeys = [
  "INTEGRATION_API_URL",

  "INTEGRATION_USER_CLIENT_USERNAME",
  "INTEGRATION_USER_CLIENT_PASSWORD",

  "INTEGRATION_USER_EMPLOYEE_USERNAME",
  "INTEGRATION_USER_EMPLOYEE_PASSWORD",

  "INTEGRATION_USER_AUTHORIZER_USERNAME",
  "INTEGRATION_USER_AUTHORIZER_PASSWORD",
] as const;

const getConfiguration = () => {
  const env = getEnv(EnvKeys, process.env);

  return {
    apiUrl: env.INTEGRATION_API_URL,

    clientUser: {
      username: env.INTEGRATION_USER_CLIENT_USERNAME,
      password: env.INTEGRATION_USER_CLIENT_PASSWORD,
    },

    employeeUser: {
      username: env.INTEGRATION_USER_EMPLOYEE_USERNAME,
      password: env.INTEGRATION_USER_EMPLOYEE_PASSWORD,
    },

    authorizerUser: {
      username: env.INTEGRATION_USER_AUTHORIZER_USERNAME,
      password: env.INTEGRATION_USER_AUTHORIZER_PASSWORD,
    },
  };
};

export { getConfiguration };
