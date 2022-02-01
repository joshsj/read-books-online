import { string, object, array, InferType } from "yup";
import { Role } from "@backend/domain/constants/role";
import { Entity } from "@backend/domain/common/entity";
import { Username } from "@backend/domain/common/constrainedTypes";

const User = object({
  username: Username.defined(),
  email: string().email().defined(),
  roles: array().of(Role.defined()).strict().defined().min(1),
  passwordHash: string().strict().defined(),
}).concat(Entity);

type User = InferType<typeof User>;

export { User };
