import { model, Schema } from "@/infrastructure/repository/models";
import { EntitySchema } from "@/infrastructure/repository/models/entity";
import { TestEntity } from "@/test/unit/utilities/testEntity";

const TestEntitySchema: Schema<TestEntity> = {
  ...EntitySchema,
  min3: { type: String },
};

const TestEntityModel = model<TestEntity>("TestEntity", TestEntity, TestEntitySchema);

export { TestEntitySchema, TestEntityModel };
