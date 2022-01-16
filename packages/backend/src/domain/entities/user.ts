import { string, object, array, InferType } from "yup";
import { Role } from "@backend/domain/constants/role";
import { Entity } from "@backend/domain/common/entity";
import { Username } from "@backend/domain/common/constrainedTypes";

const User = Entity.concat(
  object({
    username: Username,
    roles: array().of(Role).strict().required(),
    passwordHash: string().strict().required(),
  })
);

type User = InferType<typeof User>;

export { User };
