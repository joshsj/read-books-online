import { Length } from "@/domain/common/constrainedTypes";
import { Entity } from "@/domain/common/entity";
import { Record, Static, String } from "runtypes";

const OneLengthString = Length(String, { min: 1, max: 3 });

const Helper = Record({ value: OneLengthString });
type ITestEntity = Static<typeof Helper>;

class TestEntity extends Entity<ITestEntity> implements ITestEntity {
  value!: string;

  constructor(obj: ITestEntity) {
    super(obj, Helper);

    this.value = obj.value;
  }
}

export { TestEntity };
