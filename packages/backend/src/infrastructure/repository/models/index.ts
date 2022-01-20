import { Entity } from "@backend/domain/common/entity";
import {
  model as _model,
  Schema as _Schema,
  SchemaDefinition,
  SchemaDefinitionType,
} from "mongoose";
import mongooseAutoPopulate from "mongoose-autopopulate";
import { ObjectSchema } from "yup";

type Schema<T extends object> = Required<SchemaDefinition<SchemaDefinitionType<T>>>;

const model = <T extends Entity>(
  name: string,
  _helper: ObjectSchema<T>,
  definition: Schema<T>,
  populateRefs = false
) => {
  const schema = new _Schema<T>(definition as any, {
    collection: name.toLowerCase(),
    strict: true,
  });

  populateRefs && schema.plugin(mongooseAutoPopulate);

  return _model(name, schema);
};

export { Schema, model };
