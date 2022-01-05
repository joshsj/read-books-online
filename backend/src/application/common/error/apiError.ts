import { defaults } from "@/application/common/error/messages";

type ApiErrorType = "missing" | "validation" | "authentication" | "authorization";

type IApiError = {
  type: ApiErrorType;
  message?: string;
};

class ApiError extends Error implements IApiError {
  constructor(public readonly type: ApiErrorType, message?: string) {
    super(message ?? defaults[type]);
  }
}

export { IApiError, ApiError, ApiErrorType };
