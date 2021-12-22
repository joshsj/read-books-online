import { IRequest, IRequestName } from "@/common/cqrs/types";
import { ILogger as _ILogger } from "@/common/dependency";

type ILoggerContext = "general" | "init" | "server" | "cqrs";
type ILogger = _ILogger<ILoggerContext>;

type IValidator<T extends IRequest<IRequestName>> = {
  requestName: T["requestName"];
  validate: (t: T) => string[];
};

export { ILoggerContext, ILogger, IValidator };
