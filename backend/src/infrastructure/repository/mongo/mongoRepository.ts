import { RepositoryEntityInstanceError } from "@/application/common/error/repositoryEntityInstanceError";
import { IRepository } from "@/application/common/interfaces/repository";
import { Class } from "@/common/utilities";
import { Entity, Id } from "@/domain/common/entity";
import { ModelType } from "@typegoose/typegoose/lib/types";

type Some<T> = T | T[];
const arrayify = <T>(x: T | T[]): T[] => (Array.isArray(x) ? x : [x]);

class MongoRepository<T extends Entity> implements IRepository<T> {
  constructor(
    private readonly _class: Class<T, T>,
    private readonly entities: ModelType<T>
  ) {}

  get(): Promise<T[]>;
  get(id: Id): Promise<T | undefined>;
  get(id: Id[]): Promise<T[]>;
  async get(id?: Some<Id>): Promise<Some<T> | undefined> {
    if (Entity.isId(id)) {
      const entity = await this.entities.findOne({ id });

      return entity ? this.toInstance(entity) : undefined;
    }

    const filter = id ? { id: { $in: id } } : {};
    return (await this.entities.find(filter)).map((x) => this.toInstance(x));
  }

  async insert(entity: T): Promise<void> {
    this.validateInstance(entity);

    await this.entities.create(entity);
  }

  async update(entity: T): Promise<void> {
    this.validateInstance(entity);

    await this.entities.findOneAndUpdate({ id: entity.id }, { $set: entity });
  }

  async delete(id: Some<Id>): Promise<void> {
    await this.entities.deleteMany({ id: { $in: arrayify(id) } });
  }

  private validateInstance(entity: T) {
    if (!(entity instanceof this._class)) {
      throw new RepositoryEntityInstanceError();
    }
  }

  private toInstance(entity: T) {
    return new this._class(entity);
  }
}

export { MongoRepository };
