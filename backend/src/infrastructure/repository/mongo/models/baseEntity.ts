import { BaseEntity } from "@/domain/common/baseEntity";
import { getModelForClass } from "@typegoose/typegoose";
import { Types } from "mongoose";

class BaseEntitySchema implements BaseEntity {
  private _id!: Types.ObjectId;

  get id(): string {
    return this._id.toString();
  }
}

const BaseEntityModel = getModelForClass(BaseEntitySchema);

export { BaseEntitySchema, BaseEntityModel };
