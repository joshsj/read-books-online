import { AuditedBaseEntity } from "@/domain/common/auditedBaseEntity";
import { BaseEntitySchema } from "./baseEntity";
import { getModelForClass, prop } from "@typegoose/typegoose";

class AuditedBaseEntitySchema
  extends BaseEntitySchema
  implements AuditedBaseEntity
{
  @prop() created!: Date;
  @prop() createdBy!: string;

  @prop() modified!: Date;
  @prop() modifiedBy!: string;
}

const AuditedBaseEntityModel = getModelForClass(AuditedBaseEntitySchema);

export { AuditedBaseEntitySchema, AuditedBaseEntityModel };
