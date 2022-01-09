import { InstanceOf, Static, String } from "runtypes";
import { Entity } from "@/domain/common/entity";
import { Id } from "@/domain/common/id";

type RefreshTokenValue = string;

const RefreshToken = Entity.extend({
  value: String.withConstraint<RefreshTokenValue>(() => true),
  expires: InstanceOf(Date),
  userId: Id,
});

type RefreshToken = Static<typeof RefreshToken>;

export { RefreshToken, RefreshTokenValue };
