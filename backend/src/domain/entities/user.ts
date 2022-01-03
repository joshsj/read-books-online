import { Array, Static, String } from "runtypes";
import { Length } from "@/domain/common/constrainedTypes";
import { Role } from "@/domain/constants/role";
import { Entity } from "../common/entity";

const User = Entity.extend({
  name: Length(String, { min: 1 }),
  roles: Length(Array(Role), { min: 1 }),
});

type User = Static<typeof User>;

export { User };
