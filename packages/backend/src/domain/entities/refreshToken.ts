import { Entity } from "@/domain/common/entity";
import { Id } from "@/domain/common/id";
import { string, date, object, InferType } from "yup";

type RefreshTokenValue = string;

const RefreshToken = Entity.concat(
  object({
    value: string().strict().required(),
    expires: date().strict().required(),
    userId: Id,
  })
);

type RefreshToken = InferType<typeof RefreshToken>;

export { RefreshToken, RefreshTokenValue };
