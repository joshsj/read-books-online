import { RBOError } from "@backend/application/common/error/rboError";
import { ObjectSchema, ValidationError } from "yup";

const assertSchema = <T extends object>(obj: any, schema: ObjectSchema<T>): asserts obj is T => {
  try {
    schema.validateSync(obj, { strict: true });
  } catch (err) {
    throw err instanceof ValidationError ? new RBOError("validation", err.message) : err;
  }
};

type AssertSchema = typeof assertSchema;

const keyOfSchema = <T>(schema: ObjectSchema<T>): Array<keyof T> =>
  Object.keys(schema.fields) as Array<keyof T>;
type KeyOfSchema = typeof keyOfSchema;

export { assertSchema, AssertSchema, keyOfSchema, KeyOfSchema };
