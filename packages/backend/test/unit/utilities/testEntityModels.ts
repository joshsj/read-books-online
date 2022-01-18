import { model, Schema } from "@backend/infrastructure/repository/models";
import { EntitySchema } from "@backend/infrastructure/repository/models/entity";
import { ParentTestEntity, TestEntity } from "@backend/test/unit/utilities/testEntities";
import { Types } from "mongoose";

const TestEntitySchema: Schema<TestEntity> = {
  ...EntitySchema,
  min3: { type: String },
};

const TestEntityModel = model<TestEntity>("TestEntity", TestEntity, TestEntitySchema);

const ParentTestEntitySchema: Schema<ParentTestEntity> = {
  ...TestEntitySchema,
  child: {
    type: Types.ObjectId,
    ref: TestEntityModel,
    autopopulate: true,
  },
  children: [
    {
      type: Types.ObjectId,
      ref: TestEntityModel,
      autopopulate: true,
    },
  ],
};

const ParentTestEntityModel = model<ParentTestEntity>(
  "ParentTestEntity",
  ParentTestEntity,
  ParentTestEntitySchema,
  true
);

export { TestEntitySchema, TestEntityModel, ParentTestEntitySchema, ParentTestEntityModel };
