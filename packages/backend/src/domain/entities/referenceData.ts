import { InferType, object, string } from "yup";
import { Entity } from "../common/entity";

const ReferenceData = object({ value: string().required() }).concat(Entity.pick(["_id"]));
type ReferenceData = InferType<typeof ReferenceData>;

export { ReferenceData };
