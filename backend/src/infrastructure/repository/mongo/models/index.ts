import { Class } from "@/common/utilities";
import { Entity } from "@/domain/common/entity";
import { EntityValidationError } from "@/domain/error/entityValidationError";
import { getModelForClass, Ref } from "@typegoose/typegoose";
import { Runtype } from "runtypes";

const required = true;

type MapToRef<T> = T extends object ? (T extends Array<any> ? T : Ref<T>) : T;

type Schema<T extends object> = { [K in keyof T]: MapToRef<T[K]> };

const getModel = <T extends Entity>(schema: Class<T>, entity: Runtype<T>) => {
  const model = getModelForClass(schema);

  model.schema.pre("create", async function () {
    console.log("called pre");

    if (!entity.guard(this)) {
      throw new EntityValidationError();
    }
  });

  return model;
};

export { Schema, required, getModel };
