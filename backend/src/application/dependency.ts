import { requestLoggerBehavior } from "@/application/common/behaviors/requestLoggerBehavior";
import { validatorBehavior } from "@/application/common/behaviors/validatorBehavior";
import { CQRS } from "@/common/cqrs";
import { IBehavior, ICQRS, IHandler } from "@/common/cqrs/types";
import { Dependency as CommonDependency } from "@/common/dependency";
import { toDependencies } from "@/common/utilities";
import { container } from "tsyringe";
import { testRequestHandler, testRequestValidator } from "./test";

const Dependency = {
  ...CommonDependency,
  ...toDependencies(["handler", "behavior", "requestSender", "validator"]),
};

// TODO: replace with directory scanning
const registerDependencies = () => {
  const register = <T>(token: symbol, arr: T[]) =>
    arr.forEach((x) => container.register<T>(token, { useValue: x }));

  container.register<ICQRS>(Dependency.requestSender, {
    useFactory: (c) =>
      new CQRS(
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

export { Dependency, registerDependencies };
