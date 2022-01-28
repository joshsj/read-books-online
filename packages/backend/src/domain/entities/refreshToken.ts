import { Entity } from "@backend/domain/common/entity";
import { Id } from "@backend/domain/common/id";
import { string, date, object, InferType } from "yup";

type RefreshTokenValue = string;

const RefreshToken = Entity.concat(
  object({
    value: string().strict().required(),
    expires: date().strict().required(),
    userId: Id.required(),
  })
);

type RefreshToken = InferType<typeof RefreshToken>;

export { RefreshToken, RefreshTokenValue };
