import { TicketQuery } from "@backend/application/ticket/queries/ticketQuery";
import { Entity } from "@backend/domain/common/entity";
import { Id } from "@backend/domain/common/id";
import { Message } from "@backend/domain/entities/message";
import { ReferenceData } from "@backend/domain/entities/referenceData";
import { RefreshToken, RefreshTokenValue } from "@backend/domain/entities/refreshToken";
import { Ticket } from "@backend/domain/entities/ticket";
import { User } from "@backend/domain/entities/user";

type QueryResult<T> = {
  items: T[];
  total: number;
};

type IWritableRepository<T extends Entity> = {
  insert(entity: T): Promise<void>;
  update(entity: T): Promise<void>;
  delete(id: Id): Promise<void>;
  delete(id: Id[]): Promise<void>;
};

type IReadableRepository<T extends Entity> = {
  get(): Promise<T[]>;
  get(id: Id): Promise<T | null>;
  get(id: Id[]): Promise<T[]>;
  exists(id: Id): Promise<boolean>;
};

type IRepository<T extends Entity> = IReadableRepository<T> & IWritableRepository<T>;

type IReferenceDataRepository = {
  getReferenceData(): Promise<ReferenceData[]>;
};

type IUserRepository = IRepository<User> &
  IReferenceDataRepository & {
    getByUsername(username: string): Promise<User | null>;
    existsByUsername(username: string): Promise<boolean>;
  };

type IRefreshTokenRepository = IRepository<RefreshToken> & {
  getByUserId(userId: Id): Promise<RefreshToken | null>;
  getByValue(value: RefreshTokenValue): Promise<RefreshToken | null>;
};

type ITicketRepository = IRepository<Ticket> & {
  query(query: TicketQuery): Promise<QueryResult<Ticket>>;
};

type IMessageRepository = IRepository<Message> & {
  getByTicketId(ticketId: Id): Promise<Message[]>;
};

export {
  IWritableRepository,
  IReadableRepository,
  IRepository,
  QueryResult,
  IUserRepository,
  IRefreshTokenRepository,
  ITicketRepository,
  IMessageRepository,
};
