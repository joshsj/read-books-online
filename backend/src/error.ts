type ApiErrorType = "validation";

class ApiError extends Error {
  constructor(public readonly type: ApiErrorType, message: string) {
    super(message);
  }
}

const createApiError = (
  type: ApiError["type"],
  message: ApiError["message"]
): ApiError => new ApiError(type, message);

const throwApiError = (...args: Parameters<typeof createApiError>): never => {
  throw createApiError(...args);
};

export { ApiError, ApiErrorType, createApiError, throwApiError };
