import { Literal, Record, Static, String, Union } from "runtypes";

const ApiErrorType = Union(Literal("validation"));
type ApiErrorType = Static<typeof ApiErrorType>;

const ApiError = Record({ type: ApiErrorType, message: String.optional() });
type ApiError = Static<typeof ApiError>;

const createApiError = (type: ApiErrorType, message?: string): ApiError => ({ type, message });

const throwApiError = (type: ApiErrorType, message?: string): never => {
  throw createApiError(type, message);
};

export { ApiErrorType, ApiError, createApiError, throwApiError };
