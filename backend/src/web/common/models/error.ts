import { IApiError } from "@/application/common/error/apiError";

type ErrorDto = (IApiError | { type: "internal" | "invalidRoute" }) & { error: true };

export { ErrorDto };
