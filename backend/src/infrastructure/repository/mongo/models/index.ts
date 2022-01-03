import { Entity } from "@/domain/common/entity";
import { EntityValidationError } from "@/domain/error/entityValidationError";
import {
  model as _model,
  Schema as _Schema,
  SchemaDefinition,
  SchemaDefinitionType,
} from "mongoose";
import { Runtype } from "runtypes";

const required = true;

type Schema<T extends Entity> = Required<
  SchemaDefinition<SchemaDefinitionType<T>>
>;

const model = <T extends Entity>(
  name: string,
  helper: Runtype<T>,
  definition: Schema<T>
) => {
  // TODO: remove cast to any
  const schema = new _Schema<T>(definition as any);

  schema.pre("validate", function (next) {
    const result = helper.validate(this);

    if (!result.success) {
      const fields = result.details ? Object.keys(result.details) : [];

      throw new EntityValidationError(fields);
    }

    next();
  });

  return _model(name, schema);
};

export { required, Schema, model };
