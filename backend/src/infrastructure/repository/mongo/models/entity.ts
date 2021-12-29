import { Entity } from "@/domain/common/entity";
import { Id } from "@/domain/common/id";
import { EntityValidationError } from "@/domain/error/entityValidationError";
import { pre, prop } from "@typegoose/typegoose";
import { getModel, required, Schema } from ".";

@pre("validate", function (next) {
  next(Entity.guard(this) ? undefined : new EntityValidationError());
})
class EntitySchema implements Schema<Entity> {
  @prop({ type: String, unique: true, required })
  id!: Id;
}

const EntityModel = getModel(EntitySchema, Entity);

export { EntitySchema, EntityModel };
