import { ApiError } from "@/application/common/error/apiError";

type ExpectedError = Pick<ApiError, "type"> & Pick<Partial<ApiError>, "message">;

export { ExpectedError };
