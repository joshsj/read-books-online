import { IRepository } from "@/application/common/interfaces/repository";
import { Entity } from "@/domain/common/entity";
import { Id, isId } from "@/domain/common/id";
import { Model } from "mongoose";

type Some<T> = T | T[];
const arrayify = <T>(x: T | T[]): T[] => (Array.isArray(x) ? x : [x]);

class MongoRepository<T extends Entity> implements IRepository<T> {
  constructor(private readonly model: Model<T>) {}

  get(): Promise<T[]>;
  get(id: Id): Promise<T | undefined>;
  get(id: Id[]): Promise<T[]>;
  async get(id?: Some<Id>): Promise<Some<T> | undefined> {
    if (isId(id)) {
      return (await this.model.findOne({ id })) ?? undefined;
    }

    const filter = id ? { id: { $in: id } } : {};
    return await this.model.find(filter);
  }

  async insert(entity: T): Promise<void> {
    await this.model.create(entity);
  }

  async update(entity: T): Promise<void> {
    await this.model.findOneAndUpdate({ id: entity.id }, { $set: entity });
  }

  async delete(id: Some<Id>): Promise<void> {
    await this.model.deleteMany({ id: { $in: arrayify(id) } });
  }
}

export { MongoRepository };
