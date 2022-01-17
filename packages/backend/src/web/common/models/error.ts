import { RBOError, RBOErrorType } from "@backend/application/common/error/rboError";

type RBOErrorDto = Pick<RBOError, "rboError" | "message"> & {
  type: RBOErrorType | "internal" | "invalidRoute";
};

export { RBOErrorDto };
