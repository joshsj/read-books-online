import { requestLoggerBehavior } from "@/application/behaviors/requestLoggerBehavior";
import { validatorBehavior } from "@/application/behaviors/validatorBehavior";
import {
  testRequestHandler,
  testRequestValidator,
} from "@/application/features/test";
import { logger } from "@/application/logger";
import { createCQRS } from "@/common/cqrs";
import { IBehavior, ICQRS, IHandler } from "@/common/cqrs/types";
import { Dependency, ILogger } from "@/dependency";
import { Env, getEnv } from "@/env";
import { startServer } from "@/web/server";
import { container } from "tsyringe";

// TODO: replace with directory scanning
const registerDependencies = (env: Env) => {
  const register = <T>(token: symbol, arr: T[]) =>
    arr.forEach((x) => container.register<T>(token, { useValue: x }));

  container
    .register<ILogger>(Dependency.logger, { useValue: logger })
    .register<Env>(Dependency.env, { useValue: env });

  container.register<ICQRS>(Dependency.requestSender, {
    useFactory: (c) =>
      createCQRS(
        c.resolveAll<IHandler>(Dependency.handler),
        c.resolveAll<IBehavior>(Dependency.behavior)
      ),
  });

  register<IBehavior>(Dependency.behavior, [
    requestLoggerBehavior,
    validatorBehavior,
  ]);

  register(Dependency.handler, [testRequestHandler]);
  register(Dependency.validator, [testRequestValidator]);
};

const main = () => {
  const env = getEnv();
  logger("init", "Using env", env);

  registerDependencies(env);

  startServer();
};

main();
