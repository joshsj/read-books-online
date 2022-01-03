import { Entity } from "@/domain/common/entity";
import { model, Schema, required } from ".";

const EntitySchema: Schema<Entity> = {
  id: { type: String, required },
};

const EntityModel = model<Entity>("Entity", Entity, EntitySchema);

export { EntitySchema, EntityModel };
