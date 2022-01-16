import { ObjectSchema, ValidationError } from "yup";
import { RBOError } from "@backend/application/common/error/rboError";

const assertSchema = <T extends object>(obj: any, schema: ObjectSchema<T>): asserts obj is T => {
  try {
    schema.validateSync(obj, { strict: true });
  } catch (err) {
    throw err instanceof ValidationError ? new RBOError("validation", err.message) : err;
  }
};

type AssertSchema = typeof assertSchema;

export { assertSchema, AssertSchema };
