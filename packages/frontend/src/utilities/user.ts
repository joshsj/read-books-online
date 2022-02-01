import { Role } from "@client/models";
import { capitalize } from "@core/utilities/string";

const prettyRoles = (roles: Role[]) => roles.map(capitalize).join(", ");

export { prettyRoles };
