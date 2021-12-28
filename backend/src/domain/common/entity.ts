import { Runtype } from "runtypes";
import { EntityValidationError } from "../error/entityValidationError";
import { v4 as uuidv4, validate, version } from "uuid";
import { prop } from "@typegoose/typegoose";

type Id = string;

// TODO: consider moving mongoose schema declarations into /infrastructure

abstract class Entity<T extends object = {}> {
  @prop()
  id!: Id;

  constructor(obj: T, helper: Runtype<T>) {
    if (!helper.guard(obj)) {
      throw new EntityValidationError();
    }

    Object.assign(this, { ...obj, id: Entity.newId() });
  }

  static isId(id: any): id is Id {
    return validate(id) && version(id) === 4;
  }

  static newId(): Id {
    return uuidv4();
  }
}

export { Entity, Id };
