import { requestLoggerBehavior } from "@backend/application/common/behaviors/requestLoggerBehavior";
import { validatorBehavior } from "@backend/application/common/behaviors/validatorBehavior";
import { IBehavior } from "@core/cqrs/types";
import {
  createUserRequestHandler,
  createUserRequestValidator,
} from "@backend/application/user/createUser";
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
  const register = <T>(token: symbol, arr: T[]) =>
    arr.forEach((x) => container.register<T>(token, { useValue: x }));

  register<IBehavior>(Dependency.requestBehavior, [requestLoggerBehavior, validatorBehavior]);
  register(Dependency.requestHandler, [createUserRequestHandler]);
  register(Dependency.requestValidator, [createUserRequestValidator]);
};

export { Dependency, registerApplicationDependencies };