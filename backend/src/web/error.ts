type ApiErrorType = "validation";

class ApiError extends Error {
  constructor(public readonly type: ApiErrorType, message: string) {
    super(message);
  }
}

export { ApiError, ApiErrorType };
