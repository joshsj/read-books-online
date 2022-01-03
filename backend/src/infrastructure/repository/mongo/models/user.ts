import { model, Schema, required } from ".";
import { User } from "@/domain/entities/user";
import { EntitySchema } from "./entity";

const UserSchema: Schema<User> = {
  ...EntitySchema,
  name: { type: String, required },
  roles: { type: [String], required },
};

const UserModel = model<User>("User", User, UserSchema);

export { UserSchema, UserModel };
