import { prop } from "@typegoose/typegoose";
import { Array, Record, Static, String } from "runtypes";
import { Length } from "../common/constrainedTypes";
import { Entity } from "../common/entity";
import { Role } from "../constants/role";

const Helper = Record({
  name: Length(String, { min: 1 }),
  roles: Length(Array(Role), { min: 1 }),
});
type IUser = Static<typeof Helper>;

class User extends Entity<IUser> implements IUser {
  @prop()
  name!: string;

  @prop()
  roles!: Role[];

  constructor(user: IUser) {
    super(user, Helper);
  }
}

export { User };
