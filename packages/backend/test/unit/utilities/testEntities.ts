import { Entity } from "@backend/domain/common/entity";
import { array, InferType, object, string } from "yup";

const TestEntity = Entity.concat(
  object({
    min3: string().strict().required().min(3),
  })
);

const ParentTestEntity = TestEntity.concat(
  object({
    child: TestEntity.optional(),
    children: array().of(TestEntity),
  })
);

type TestEntity = InferType<typeof TestEntity>;
type ParentTestEntity = InferType<typeof ParentTestEntity>;

export { TestEntity, ParentTestEntity };
