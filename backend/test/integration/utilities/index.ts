import { getEnv } from "@/common/utilities";

const EnvKeys = ["BASE_URL"] as const;
const Env = Object.freeze(getEnv(EnvKeys, process.env));

export { Env };
