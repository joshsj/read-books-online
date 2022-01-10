import { RBOError } from "@/application/common/error/rboError";

type ExpectedError = Pick<RBOError, "type"> & Pick<Partial<RBOError>, "message">;

export { ExpectedError };
