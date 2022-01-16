import { EnvKeys as BackendEnvKeys } from "@backend/configuration";
import { getEnv } from "@core/utilities";

const EnvKeys = [...BackendEnvKeys, "BASE_URL"] as const;
const Env = Object.freeze(getEnv(EnvKeys, process.env));

export { Env };
