import { Id } from "./id";
import { InferType, object } from "yup";

const Entity = object({ id: Id }).strict();
type Entity = InferType<typeof Entity>;

export { Entity };
