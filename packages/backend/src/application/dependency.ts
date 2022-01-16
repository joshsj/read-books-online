import { requestLoggerBehavior } from "@backend/application/common/behaviors/requestLoggerBehavior";
import { validatorBehavior } from "@backend/application/common/behaviors/validatorBehavior";
import {
  createUserRequestHandler,
  createUserRequestValidator,
} from "@backend/application/user/createUser";
import { CQRS } from "@core/cqrs";
import { IBehavior, ICQRS, IRequestHandler } from "@core/cqrs/types";
import { toDependencies } from "@core/utilities";
import { container } from "tsyringe";

const Dependency = toDependencies([
  // general
  "logger",
  "configuration",
  // services
  "hashingService",
  "identityService",
  "httpContextService",
  // repository
  "userRepository",
  "refreshTokenRepository",
  // cqrs
  "cqrs",
  "requestHandler",
  "requestBehavior",
  "requestValidator",
  "requestAuthorizer",
]);

// TODO: replace with directory scanning
const registerApplicationDependencies = () => {
  container.register<ICQRS>(Dependency.cqrs, {
    useFactory: (c) =>
      new CQRS(
        c.resolveAll<IRequestHandler>(Dependency.requestHandler),
        c.isRegistered(Dependency.requestBehavior)
          ? c.resolveAll<IBehavior>(Dependency.requestBehavior)
          : []
      ),
  });

  const register = <T>(token: symbol, arr: T[]) =>
    arr.forEach((x) => container.register<T>(token, { useValue: x }));

  register<IBehavior>(Dependency.requestBehavior, [requestLoggerBehavior, validatorBehavior]);
  register(Dependency.requestHandler, [createUserRequestHandler]);
  register(Dependency.requestValidator, [createUserRequestValidator]);
};

export { Dependency, registerApplicationDependencies };
