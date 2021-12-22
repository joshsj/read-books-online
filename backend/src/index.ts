import { ILogger } from "@/application/common/interfaces";
import { registerDependencies as registerApplicationDependencies } from "@/application/dependency";
import { Dependency as CommonDependency } from "@/common/dependency";
import { Env, getEnv } from "@/env";
import { logger } from "@/infrastructure/logger";
import { startServer } from "@/web/server";
import { container } from "tsyringe";

const main = () => {
  const env = getEnv();
  logger("init", "Using env", env);

  container
    .register<ILogger>(CommonDependency.logger, { useValue: logger })
    .register<Env>(CommonDependency.env, { useValue: env });

  registerApplicationDependencies();

  startServer();
};

main();
