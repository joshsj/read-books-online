import { Role } from "@/domain/constants/role";
import { User } from "@/domain/entities/user";
import { prop } from "@typegoose/typegoose";
import { getModel, required, Schema } from ".";
import { EntitySchema } from "./entity";

class UserSchema extends EntitySchema implements Schema<User> {
  @prop({ required })
  name!: string;

  @prop({ required, type: [String] })
  roles!: Role[];
}

const UserModel = getModel(UserSchema, User);

export { UserSchema, UserModel };
