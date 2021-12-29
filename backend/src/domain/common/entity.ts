import { Record, Static } from "runtypes";
import { Id } from "./id";

const Entity = Record({ id: Id });

type Entity = Static<typeof Entity>;

export { Entity };
