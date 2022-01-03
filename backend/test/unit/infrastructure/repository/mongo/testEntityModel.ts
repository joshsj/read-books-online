import {
  model,
  required,
  Schema,
} from "@/infrastructure/repository/mongo/models";
import { EntitySchema } from "@/infrastructure/repository/mongo/models/entity";
import { TestEntity } from "@/test/unit/domain/testEntity";

const TestEntitySchema: Schema<TestEntity> = {
  ...EntitySchema,
  min3: { type: String, required },
};

const TestEntityModel = model<TestEntity>(
  "TestEntity",
  TestEntity,
  TestEntitySchema
);

export { TestEntitySchema, TestEntityModel };
