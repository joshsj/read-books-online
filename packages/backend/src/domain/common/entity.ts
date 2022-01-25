import { Id, isId } from "./id";
import { InferType, object } from "yup";

const IdKey = "_id";

const Entity = object({ [IdKey]: Id }).strict();
type Entity = InferType<typeof Entity>;

const isEntity = (obj: any): obj is Entity =>
  obj && typeof obj === "object" && obj[IdKey] && isId(obj[IdKey]);

export { Entity, isEntity };
