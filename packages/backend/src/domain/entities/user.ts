import { string, object, array, InferType } from "yup";
import { Role } from "@backend/domain/constants/role";
import { Entity } from "@backend/domain/common/entity";
import { Username } from "@backend/domain/common/constrainedTypes";

const User = object({
  username: Username.required(),
  email: string().email().required(),
  roles: array().of(Role.required()).strict().required(),
  passwordHash: string().strict().required(),
}).concat(Entity);

type User = InferType<typeof User>;

export { User };
