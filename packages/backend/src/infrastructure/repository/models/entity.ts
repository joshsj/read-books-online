import { Entity } from "@/domain/common/entity";
import { Schema } from ".";

const EntitySchema: Schema<Entity> = {
  id: { type: String },
};

export { EntitySchema };
