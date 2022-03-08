import { notFound } from "@backend/application/common/error/messages";
import { RBOError } from "@backend/application/common/error/rboError";
import { IRepository, QueryResult } from "@backend/application/common/interfaces/repository";
import { Entity, isEntity } from "@backend/domain/common/entity";
import { Id, isId } from "@backend/domain/common/id";
import { SortDirection as SortDirection } from "@backend/domain/constants/sortDirection";
import { ReferenceData } from "@backend/domain/entities/referenceData";
import { ensure } from "@core/utilities";
import { FilterQuery, Model } from "mongoose";
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
type Query<T> = {
  filter?: FilterQuery<T>;
  sort?: {
    field: keyof T | string;
    direction: SortDirection;
  };
  page?: {
    number: number;
    size: number;
  };
};

const arrayify = <T>(x: T | T[]): T[] => (Array.isArray(x) ? x : [x]);

class MongoRepository<T extends Entity> implements IRepository<T> {
  private readonly EscapePaginationValue = 0;

  constructor(protected readonly helper: ObjectSchema<T>, protected readonly model: Model<T>) {}

  get(): Promise<T[]>;
  get(id: Id): Promise<T | null>;
  get(id: Id[]): Promise<T[]>;
  async get(_id?: Some<Id>): Promise<Some<T> | null> {
    if (isId(_id)) {
      return await this.model.findById(_id).lean<T>({ autopopulate: true }).exec();
    }

    const filter = _id ? { _id: { $in: _id } } : {};
    return await this.model.find(filter).lean<T[]>({ autopopulate: true }).exec();
  }

  protected async _query({ filter, sort, page }: Query<T>): Promise<QueryResult<T>> {
    return {
      items: await this.model
        .find(filter ?? {})
        .sort(sort ? { [sort.field]: sort.direction } : {})
        .skip(page ? (page.number - 1) * page.size : this.EscapePaginationValue)
        .limit(page ? page.size : this.EscapePaginationValue)
        .lean<T[]>({ autopopulate: true })
        .exec(),

      total: await this.model.count().exec(),
    };
  }

  async exists(_id: Id): Promise<boolean> {
    return await this.model.exists({ _id });
  }

  async insert(entity: T): Promise<void> {
    await this.validate(entity);

    const associableEntity = this.depopulate(entity);

    await this.model.create(associableEntity);
  }

  async update(entity: T): Promise<void> {
    await this.validate(entity);

    const associableEntity = this.depopulate(entity);

    const result = await this.model.updateOne(
      { _id: entity._id },
      { $set: { ...associableEntity, _id: undefined } }
    );

    ensure(!!result.matchedCount, new RBOError("missing", notFound(entity._id)));
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
  private depopulate(entity: T): Associable<T> {
    return Object.entries(entity).reduce<any>((obj, curr) => {
      const [key, value] = curr as [any, any];
      let newValue: any = value;

      if (typeof value === "object" && value !== null) {
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

  protected async getReferenceData(field: string): Promise<ReferenceData[]> {
    return await this.model.aggregate([{ $project: { value: `$${field}` } }]);
  }
}

export { MongoRepository };
