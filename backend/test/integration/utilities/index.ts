import { EnvKeys as BackendEnvKeys } from "@/configuration";
import { getEnv } from "@/common/utilities";

const EnvKeys = [...BackendEnvKeys, "BASE_URL", "USER_USERNAME", "USER_PASSWORD"] as const;
const Env = Object.freeze(getEnv(EnvKeys, process.env));

export { Env };
