import { String } from "runtypes";
import { v4 as uuid, validate, version } from "uuid";

type Id = string;

const isId = (id: any): id is Id => validate(id) && version(id) === 4;
const newId = (): Id => uuid();

const Id = String.withConstraint(isId);

export { Id, isId, newId };
