import { Entity } from "@/domain/common/entity";
import { Id } from "@/domain/common/id";
import { RefreshToken, RefreshTokenValue } from "@/domain/entities/refreshToken";
import { User } from "@/domain/entities/user";

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
  exists(id: Id): Promise<boolean>;
};

type IRepository<T extends Entity> = IReadableRepository<T> & IWritableRepository<T>;

type IUserRepository = IRepository<User> & {
  getByUsername(username: string): Promise<User | undefined>;
};

type IRefreshTokenRepository = IRepository<RefreshToken> & {
  getByUserId(userId: Id): Promise<RefreshToken | undefined>;
  getByValue(value: RefreshTokenValue): Promise<RefreshToken | undefined>;
};

export {
  IWritableRepository,
  IReadableRepository,
  IRepository,
  IUserRepository,
  IRefreshTokenRepository,
};
