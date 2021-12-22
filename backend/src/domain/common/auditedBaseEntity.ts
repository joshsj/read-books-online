import { InstanceOf, Static } from "runtypes";
import { BaseEntity } from "./baseEntity";
import { NonZeroLengthString } from "./constrainedTypes";

const AuditedBaseEntity = BaseEntity.extend({
  created: InstanceOf(Date),
  createdBy: NonZeroLengthString,
  modified: InstanceOf(Date),
  modifiedBy: NonZeroLengthString,
});
type AuditedBaseEntity = Static<typeof AuditedBaseEntity>;

export { AuditedBaseEntity };
