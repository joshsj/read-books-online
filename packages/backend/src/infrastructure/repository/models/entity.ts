import { Entity } from "@backend/domain/common/entity";
import { Schema } from ".";

const EntitySchema: Schema<Entity> = {
  _id: { type: String },
};

export { EntitySchema };
