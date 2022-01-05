import { ApiError } from "@/application/common/error/apiError";
import { Entity } from "@/domain/common/entity";
import { model as _model, Schema as _Schema, SchemaDefinition, SchemaDefinitionType } from "mongoose";
import { Runtype } from "runtypes";

type Schema<T extends Entity> = Required<SchemaDefinition<SchemaDefinitionType<T>>>;

const model = <T extends Entity>(name: string, helper: Runtype<T>, definition: Schema<T>) => {
  const schema = new _Schema<T>(definition as any, {
    collection: name.toLowerCase(),
    strict: true,
  });

  schema.pre("validate", function (next) {
    const validation = helper.validate(this);

    if (!validation.success) {
      throw new ApiError(
        "validation",
        "Validation failed" + (validation.details ? ` fields ${Object.keys(validation.details).join(", ")}` : "")
      );
    }

    next();
  });

  return _model(name, schema);
};

export { Schema, model };
