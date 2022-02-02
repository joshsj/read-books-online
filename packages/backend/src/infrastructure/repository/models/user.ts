import { model, Schema } from ".";
import { User } from "@backend/domain/entities/user";
import { EntitySchema } from "./entity";

const UserSchema: Schema<User> = {
  ...EntitySchema,
  username: { type: String },
  email: { type: String },
  passwordHash: { type: String },
  roles: { type: [String] },
  disabled: { type: Boolean },
};

const UserModel = model<User>("User", User, UserSchema);

export { UserSchema, UserModel };
