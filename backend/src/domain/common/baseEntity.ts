import { Record, Static } from "runtypes";
import { NonZeroLengthString } from "@/domain/common/constrainedTypes";

const BaseEntity = Record({ id: NonZeroLengthString }).asReadonly();
type BaseEntity = Static<typeof BaseEntity>;

export { BaseEntity };
