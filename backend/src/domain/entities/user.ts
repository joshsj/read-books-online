import { Array, Static } from "runtypes";
import { BaseEntity } from "../common/baseEntity";
import { NonZeroLengthString } from "../common/constrainedTypes";
import { Role } from "./role";

const User = BaseEntity.extend({
  name: NonZeroLengthString,
  roles: Array(Role),
});
type User = Static<typeof User>;

export { User };
