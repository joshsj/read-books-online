import { model, Schema } from "@backend/infrastructure/repository/models";
import { EntitySchema } from "@backend/infrastructure/repository/models/entity";
import { TestEntity } from "@backend/test/unit/utilities/testEntity";

const TestEntitySchema: Schema<TestEntity> = {
  ...EntitySchema,
  min3: { type: String },
};

const TestEntityModel = model<TestEntity>("TestEntity", TestEntity, TestEntitySchema);

export { TestEntitySchema, TestEntityModel };
