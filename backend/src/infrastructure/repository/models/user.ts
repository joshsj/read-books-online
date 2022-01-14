import { model, Schema } from ".";
import { User } from "@/domain/entities/user";
import { EntitySchema } from "./entity";

const UserSchema: Schema<User> = {
  ...EntitySchema,
  username: { type: String },
  passwordHash: { type: String },
  roles: { type: [String] },
};

const UserModel = model<User>("User", User, UserSchema);

export { UserSchema, UserModel };
