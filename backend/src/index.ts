import "reflect-metadata";
import { container } from "tsyringe";
import { requestLoggerBehavior } from "./common/behaviors/requestLoggerBehavior";
import { validatorBehavior } from "./common/behaviors/validatorBehavior";
import { logger } from "./common/logger";
import { createCQRSManager } from "./library/cqrs";
import { IBehavior, ICQRSManager, IRequestSender } from "./library/cqrs/types";
import { Dependency, Logger } from "./dependency";
import { Env, getEnv } from "./env";
import { startServer } from "./server";
import { testRequestHandler, testRequestValidator } from "./services/test";

// TODO: replace with directory scanning
const registerCQRSDependencies = (cqrsManager: ICQRSManager) => {
  const register = <T>(token: symbol, arr: T[]) =>
    arr.forEach((x) => container.register<T>(token, { useValue: x }));

  container.register<IRequestSender>(Dependency.requestSender, {
    useValue: cqrsManager.sender,
  });

  register<IBehavior>(Dependency.behavior, [
    requestLoggerBehavior,
    validatorBehavior,
  ]);

  register(Dependency.handler, [testRequestHandler]);
  register(Dependency.validator, [testRequestValidator]);
};

const main = async () => {
  const env = getEnv();

  container
    .register<Logger>(Dependency.logger, { useValue: logger })
    .register<Env>(Dependency.env, { useValue: env });

  const cqrsManager = createCQRSManager();
  registerCQRSDependencies(cqrsManager);

  logger("init", "Using env", env);

  startServer();
};

main();
