import { RBOError } from "@backend/application/common/error/rboError";
import { Entity } from "@backend/domain/common/entity";
import {
  model as _model,
  Schema as _Schema,
  SchemaDefinition,
  SchemaDefinitionType,
} from "mongoose";
import { ObjectSchema, ValidationError } from "yup";

type Schema<T extends Entity> = Required<SchemaDefinition<SchemaDefinitionType<T>>>;

const model = <T extends Entity>(name: string, helper: ObjectSchema<T>, definition: Schema<T>) => {
  const schema = new _Schema<T>(definition as any, {
    collection: name.toLowerCase(),
    strict: true,
  });

  schema.pre("validate", async function () {
    try {
      await helper.validate(this, { strict: true });
    } catch (err) {
      throw err instanceof ValidationError ? new RBOError("validation", err.message) : err;
    }
  });

  return _model(name, schema);
};

export { Schema, model };
