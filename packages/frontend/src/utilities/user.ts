import { Role } from "@client/models";
import { capitalize } from "@core/utilities/string";

const prettyRoles = (roles: Role[]) => roles.map(capitalize).join(", ");

const disabledToggleText = (disabled: boolean) => (disabled ? "enable" : "disable");

export { prettyRoles, disabledToggleText };
