import { defaults } from "@backend/application/common/error/messages";

type RBOErrorType = "missing" | "validation" | "authentication" | "authorization" | "fatal";

class RBOError extends Error {
  public readonly rboError = true as const;

  constructor(public readonly type: RBOErrorType, message?: string) {
    super(message ?? defaults[type]);
  }
}

export { RBOError, RBOErrorType };
