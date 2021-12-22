import { IRequest, IRequestName } from "@/common/cqrs/types";
import { toDependencies } from "@/common/utilities";
import {
  ILogger as _ILogger,
  Dependency as _Dependency,
} from "@/common/dependency";

type ILoggerContext = "general" | "init" | "server" | "cqrs";
type ILogger = _ILogger<ILoggerContext>;

const Dependency = {
  ..._Dependency,
  ...toDependencies(["handler", "behavior", "requestSender", "validator"]),
};

type IValidator<T extends IRequest<IRequestName>> = {
  requestName: T["requestName"];
  validate: (t: T) => string[];
};

export { Dependency, ILogger, IValidator };
