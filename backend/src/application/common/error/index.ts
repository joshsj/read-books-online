type ApiErrorType = "validation";

type IApiError = {
  type: ApiErrorType;
  message?: string;
};

class ApiError extends Error implements IApiError {
  constructor(public readonly type: ApiErrorType, message?: string) {
    super(message);
  }
}

export { IApiError, ApiError, ApiErrorType };
