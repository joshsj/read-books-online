import { Entity } from "@backend/domain/common/entity";
import { date, InferType, object, string } from "yup";
import { User } from "./user";

type RefreshTokenValue = string;

const RefreshToken = Entity.concat(
  object({
    value: string().strict().required(),
    expires: date().strict().required(),
    user: User.required(),
  })
);

type RefreshToken = InferType<typeof RefreshToken>;

export { RefreshToken, RefreshTokenValue };
