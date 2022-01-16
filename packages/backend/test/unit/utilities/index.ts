import { RBOError } from "@backend/application/common/error/rboError";

type ExpectedError = Pick<RBOError, "type"> & Pick<Partial<RBOError>, "message">;

export { ExpectedError };
