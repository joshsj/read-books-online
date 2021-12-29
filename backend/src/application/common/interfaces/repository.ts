import { Entity } from "@/domain/common/entity";
import { Id } from "@/domain/common/id";

type IWritableRepository<T extends Entity> = {
  insert(entity: T): Promise<void>;
  update(entity: T): Promise<void>;
  delete(id: Id): Promise<void>;
  delete(id: Id[]): Promise<void>;
};

type IReadableRepository<T extends Entity> = {
  get(): Promise<T[]>;
  get(id: Id): Promise<T | undefined>;
  get(id: Id[]): Promise<T[]>;
};

type IRepository<T extends Entity> = IReadableRepository<T> &
  IWritableRepository<T>;

export { IWritableRepository, IReadableRepository, IRepository };
