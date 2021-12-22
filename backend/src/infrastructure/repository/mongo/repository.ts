import { IRepository } from "@/application/common/interfaces/repository";
import { BaseEntity } from "@/domain/common/baseEntity";
import { ModelType } from "@typegoose/typegoose/lib/types";
import { Types } from "mongoose";

type Some<T> = T | T[];
const arrayify = <T>(x: T | T[]): T[] => (Array.isArray(x) ? x : [x]);

class MongoRepository<TEntity extends BaseEntity>
  implements IRepository<TEntity, string>
{
  constructor(private readonly entities: ModelType<TEntity>) {}

  isId(id: any): id is string {
    return Types.ObjectId.isValid(id);
  }

  newId() {
    return new Types.ObjectId().toString();
  }

  get(id: string): Promise<TEntity | undefined>;
  get(id: string[]): Promise<TEntity[]>;
  get(): Promise<TEntity[]>;
  async get(id?: Some<string>): Promise<TEntity | undefined | TEntity[]> {
    if (!id) {
      return await this.entities.find();
    }

    if (Array.isArray(id)) {
      return await this.entities.find({ id: { $in: id } });
    }

    return (await this.entities.findById(id)) ?? undefined;
  }

  async create(entity: Some<TEntity>): Promise<void> {
    const entities = arrayify(entity);

    this.validateIds(entities);

    await this.entities.create(entities);
  }

  async update(entity: Some<TEntity>): Promise<void> {
    const entities = arrayify(entity);

    this.validateIds(entities);

    await this.entities.updateMany(entities);
  }

  async delete(id: Some<string>): Promise<void> {
    await this.entities.deleteMany({ id: { $in: arrayify(id) } });
  }

  private validateIds(entities: TEntity[]): void | never {
    const invalidIds = entities.reduce((invalid, e) => {
      if (!this.isId(e.id)) {
        invalid.push(e.id);
      }

      return invalid;
    }, []);

    if (invalidIds.length) {
      throw new Error(`Invalid Entity IDs: ${invalidIds.join(", ")}`);
    }
  }
}

export { MongoRepository };
