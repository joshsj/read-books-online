type Entity<TId> = { id: TId };

type AuditedEntity<TId> = {
  created: Date;
  createdBy: TId;

  modified: Date;
  modifiedBy: TId;
};
