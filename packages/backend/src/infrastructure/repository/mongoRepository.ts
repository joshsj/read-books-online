import { entityNotFound } from "@backend/application/common/error/messages";
import { RBOError } from "@backend/application/common/error/rboError";
import { IRepository } from "@backend/application/common/interfaces/repository";
import { Entity, isEntity } from "@backend/domain/common/entity";
import { Id, isId } from "@backend/domain/common/id";
import { ensure } from "@core/utilities";
import { Model } from "mongoose";
import { ObjectSchema, ValidationError } from "yup";

type Some<T> = T | T[];
type Associable<T> = {
  [K in keyof T]: T[K] extends Date
    ? T[K]
    : T[K] extends Array<any>
    ? Id[]
    : T[K] extends object
    ? Associable<T[K]>
    : T[K];
};

const arrayify = <T>(x: T | T[]): T[] => (Array.isArray(x) ? x : [x]);

class MongoRepository<T extends Entity> implements IRepository<T> {
  constructor(protected readonly helper: ObjectSchema<T>, protected readonly model: Model<T>) {}

  get(): Promise<T[]>;
  get(id: Id): Promise<T | undefined>;
  get(id: Id[]): Promise<T[]>;
  async get(_id?: Some<Id>): Promise<Some<T> | undefined> {
    if (isId(_id)) {
      return ((await this.model.findById(_id).lean({ autopopulate: true }).exec()) ??
        undefined) as T;
    }

    const filter = _id ? { _id: { $in: _id } } : {};
    return (await this.model.find(filter).lean({ autopopulate: true }).exec()) as T[];
  }

  async exists(_id: Id): Promise<boolean> {
    return this.model.exists({ id: _id });
  }

  async insert(entity: T): Promise<void> {
    await this.validate(entity);

    const associableEntity = this.mapAssociations(entity);

    await this.model.create(associableEntity);
  }

  async update(entity: T): Promise<void> {
    await this.validate(entity);

    const associableEntity = this.mapAssociations(entity);

    const result = await this.model.updateOne(
      { _id: entity._id },
      { $set: { ...associableEntity, _id: undefined } }
    );

    ensure(!!result.modifiedCount, new RBOError("missing", entityNotFound(entity._id)));
  }

  async delete(_id: Some<Id>): Promise<void> {
    await this.model.deleteMany({ _id: { $in: arrayify(_id) } });
  }

  private async validate(entity: T): Promise<void | never> {
    try {
      await this.helper.validate(entity, { strict: true });
    } catch (err) {
      throw err instanceof ValidationError ? new RBOError("validation", err.message) : err;
    }
  }

  // i hate repository patterns
  private mapAssociations(entity: T): Associable<T> {
    return Object.entries(entity).reduce<any>((obj, curr) => {
      const [key, value] = curr as [any, any];
      let newValue: any = value;

      if (typeof value === "object") {
        if (isEntity(value)) {
          newValue = value._id;
        }

        if (Array.isArray(value)) {
          newValue = value.map((x) => (isEntity(x) ? x._id : x));
        }
      }

      obj[key] = newValue;

      return obj;
    }, {});
  }
}

export { MongoRepository };
