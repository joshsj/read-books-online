import { RBOError } from "@backend/application/common/error/rboError";
import { entityNotFound } from "@backend/application/common/error/messages";
import { IRepository } from "@backend/application/common/interfaces/repository";
import { ensure } from "@core/utilities";
import { Entity } from "@backend/domain/common/entity";
import { Id, isId } from "@backend/domain/common/id";
import { Model } from "mongoose";
import { ObjectSchema } from "yup";

type Some<T> = T | T[];
const arrayify = <T>(x: T | T[]): T[] => (Array.isArray(x) ? x : [x]);

class MongoRepository<T extends Entity> implements IRepository<T> {
  constructor(protected readonly helper: ObjectSchema<T>, protected readonly model: Model<T>) {}

  get(): Promise<T[]>;
  get(id: Id): Promise<T | undefined>;
  get(id: Id[]): Promise<T[]>;
  async get(id?: Some<Id>): Promise<Some<T> | undefined> {
    if (isId(id)) {
      return (await this.model.findOne({ id })) ?? undefined;
    }

    const filter = id ? { id: { $in: id } } : {};
    return this.model.find(filter);
  }

  async exists(id: Id): Promise<boolean> {
    return this.model.exists({ id });
  }

  async insert(entity: T): Promise<void> {
    await this.model.create(entity);
  }

  async update(entity: T): Promise<void> {
    ensure(
      !!(await this.model.findOneAndUpdate({ id: entity.id }, { $set: entity })),
      new RBOError("missing", entityNotFound(entity.id))
    );
  }

  async delete(id: Some<Id>): Promise<void> {
    await this.model.deleteMany({ id: { $in: arrayify(id) } });
  }
}

export { MongoRepository };
