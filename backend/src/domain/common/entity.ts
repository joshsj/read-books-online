type Entity = { id: string };

type AuditedEntity = {
  created: Date;
  createdBy: string;

  modified: Date;
  modifiedBy: string;
};
