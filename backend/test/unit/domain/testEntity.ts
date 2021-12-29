import { Length } from "@/domain/common/constrainedTypes";
import { Entity } from "@/domain/common/entity";
import { getModelForClass, prop } from "@typegoose/typegoose";
import { Record, Static, String } from "runtypes";

const OneLengthString = Length(String, { min: 1 });

const Helper = Record({ value: OneLengthString });
type ITestEntity = Static<typeof Helper>;

class TestEntity extends Entity<ITestEntity> implements ITestEntity {
  @prop()
  value!: string;

  constructor(obj: ITestEntity) {
    super(obj, Helper);

    this.value = obj.value;
  }
}

const TestEntityModel = getModelForClass(TestEntity);

export { TestEntity, TestEntityModel };
