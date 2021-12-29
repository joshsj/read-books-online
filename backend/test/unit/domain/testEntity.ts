import { Length } from "@/domain/common/constrainedTypes";
import { Entity } from "@/domain/common/entity";
import { Static, String } from "runtypes";

const TestEntity = Entity.extend({
  min3: Length(String, { min: 3 }),
});

type TestEntity = Static<typeof TestEntity>;

export { TestEntity };
