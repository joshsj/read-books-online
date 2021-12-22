type IdHelper<TId> = {
  newId(): TId;
  isId(id: any): id is TId;
};

type IWritableRepository<TEntity, TId> = {
  create(entity: TEntity): Promise<void>;
  create(entity: TEntity[]): Promise<void>;

  update(entity: TEntity): Promise<void>;
  update(entity: TEntity[]): Promise<void>;

  delete(id: TId): Promise<void>;
  delete(id: TId[]): Promise<void>;
} & IdHelper<TId>;

type IReadableRepository<TEntity, TId> = {
  get(id: TId): Promise<TEntity | undefined>;
  get(id: TId[]): Promise<TEntity[]>;
  get(): Promise<TEntity[]>;
} & IdHelper<TId>;

type IRepository<TEntity, TId> = IReadableRepository<TEntity, TId> &
  IWritableRepository<TEntity, TId>;

export { IWritableRepository, IReadableRepository, IRepository };
