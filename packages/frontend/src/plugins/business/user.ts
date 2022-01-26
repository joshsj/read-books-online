import { Role } from "@client/models";
import { store, UserStore } from "@frontend/store";

const useUserBusiness = () => ({
  hasRoles: (_roles: Role[], user?: UserStore): boolean => {
    const resolvedUser = user ?? store.user;

    if (!(_roles.length && resolvedUser)) {
      return false;
    }

    return _roles.every((r) => resolvedUser.roles.includes(r));
  },
});

export { useUserBusiness };
