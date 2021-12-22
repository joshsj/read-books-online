import { Role } from "@/domain/entities/role";
import { User } from "@/domain/entities/user";
import { getModelForClass, prop } from "@typegoose/typegoose";
import { BaseEntitySchema } from "./baseEntity";

class UserSchema extends BaseEntitySchema implements User {
  @prop()
  name!: string;

  @prop({ type: [String] })
  roles!: Role[];
}

const UserModel = getModelForClass(UserSchema);

export { UserModel, UserSchema };
