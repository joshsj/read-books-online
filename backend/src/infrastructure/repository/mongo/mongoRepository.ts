import { IRepository } from "@/application/common/interfaces/repository";
import { Entity } from "@/domain/common/entity";
import { Id, isId } from "@/domain/common/id";
import { ModelType } from "@typegoose/typegoose/lib/types";

type Some<T> = T | T[];
const arrayify = <T>(x: T | T[]): T[] => (Array.isArray(x) ? x : [x]);

class MongoRepository<T extends Entity> implements IRepository<T> {
  constructor(private readonly entities: ModelType<T>) {}

  get(): Promise<T[]>;
  get(id: Id): Promise<T | undefined>;
  get(id: Id[]): Promise<T[]>;
  async get(id?: Some<Id>): Promise<Some<T> | undefined> {
    if (isId(id)) {
      return (await this.entities.findOne({ id })) ?? undefined;
    }

    const filter = id ? { id: { $in: id } } : {};
    return await this.entities.find(filter);
  }

  async insert(entity: T): Promise<void> {
    await this.entities.create(entity);
  }

  async update(entity: T): Promise<void> {
    await this.entities.findOneAndUpdate({ id: entity.id }, { $set: entity });
  }

  async delete(id: Some<Id>): Promise<void> {
    await this.entities.deleteMany({ id: { $in: arrayify(id) } });
  }
}

export { MongoRepository };
