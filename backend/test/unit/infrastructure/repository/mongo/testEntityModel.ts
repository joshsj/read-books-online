import { EntityValidationError } from "@/domain/error/entityValidationError";
import { getModel, Schema } from "@/infrastructure/repository/mongo/models";
import { EntitySchema } from "@/infrastructure/repository/mongo/models/entity";
import { TestEntity } from "@/test/unit/domain/testEntity";
import { pre, prop } from "@typegoose/typegoose";

@pre("validate", function (next) {
  next(TestEntity.guard(this) ? undefined : new EntityValidationError());
})
class TestEntitySchema extends EntitySchema implements Schema<TestEntity> {
  @prop({ required: true })
  min3!: string;
}

const TestEntityModel = getModel(TestEntitySchema, TestEntity);

export { TestEntitySchema, TestEntityModel };
