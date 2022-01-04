import { Array, Static, String } from "runtypes";
import { Length } from "@/domain/common/constrainedTypes";
import { Role } from "@/domain/constants/role";
import { Entity } from "../common/entity";

const User = Entity.extend({
  username: Length(String, { min: 1 }),
  roles: Length(Array(Role), { min: 1 }),
  passwordHash: String,
  passwordSalt: String,
});

type User = Static<typeof User>;

export { User };
