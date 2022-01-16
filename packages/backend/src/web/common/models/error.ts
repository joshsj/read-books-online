import { IRBOErrorType } from "@backend/application/common/error/rboError";

type ErrorDto = {
  error: true;
  type: IRBOErrorType | "internal" | "invalidRoute";
  message?: string;
};

export { ErrorDto };
