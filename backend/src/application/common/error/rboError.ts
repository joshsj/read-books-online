import { defaults } from "@/application/common/error/messages";

type IRBOErrorType = "missing" | "validation" | "authentication" | "authorization" | "fatal";

type IRBOError = {
  type: IRBOErrorType;
  message?: string;
};

class RBOError extends Error implements IRBOError {
  constructor(public readonly type: IRBOErrorType, message?: string) {
    super(message ?? defaults[type]);
  }
}

export { IRBOError, RBOError, IRBOErrorType };
