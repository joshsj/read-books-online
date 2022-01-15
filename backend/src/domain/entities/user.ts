import { string, object, array, InferType } from "yup";
import { Role } from "@/domain/constants/role";
import { Entity } from "@/domain/common/entity";
import { Username } from "@/domain/common/constrainedTypes";

const User = Entity.concat(
  object({
    username: Username,
    roles: array().of(Role).strict().required(),
    passwordHash: string().strict().required(),
  })
);

type User = InferType<typeof User>;

export { User };
