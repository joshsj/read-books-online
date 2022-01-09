import { ApiErrorType } from "@/application/common/error/apiError";

type ErrorDto = {
  error: true;
  type: ApiErrorType | "internal" | "invalidRoute";
  message?: string;
};

export { ErrorDto };
