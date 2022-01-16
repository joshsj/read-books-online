import { Entity } from "@backend/domain/common/entity";
import { InferType, object, string } from "yup";

const TestEntity = Entity.concat(
  object({
    min3: string().strict().required().min(3),
  })
);

type TestEntity = InferType<typeof TestEntity>;

export { TestEntity };
