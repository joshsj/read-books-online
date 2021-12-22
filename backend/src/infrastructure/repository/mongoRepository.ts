import { IRepository } from "@/application/common/interfaces/repository";
import { Model, Types } from "mongoose";

type Some<T> = T | T[];
const arrayify = (x: any) => (Array.isArray(x) ? x : [x]);

class MongoRepository<TEntity extends Entity>
  implements IRepository<TEntity, string>
{
  constructor(private readonly entities: Model<TEntity>) {}

  newId() {
    return new Types.ObjectId().toString();
  }

  get(id: string): Promise<TEntity | undefined>;
  get(id: string[]): Promise<TEntity[]>;
  async get(id: Some<string>): Promise<TEntity | undefined | TEntity[]> {
    if (typeof id === "string") {
      return (await this.entities.findById(id)) ?? undefined;
    }

    return await this.entities.find({ id: { $in: id } });
  }

  async create(entity: Some<TEntity>): Promise<void> {
    await this.entities.create(entity);
  }

  async update(entity: Some<TEntity>): Promise<void> {
    await this.entities.updateMany(entity);
  }

  async delete(id: Some<string>): Promise<void> {
    await this.entities.deleteMany({ id: { $in: arrayify(id) } });
  }
}

export { MongoRepository };
