import { Role } from "@client/models";
import { store, UserStore } from "@frontend/store";

const useUserBusiness = () => ({
  canView: (username: string, user?: UserStore): boolean => {
    const resolvedUser = user ?? store.user;

    if (!resolvedUser) {
      return false;
    }

    return resolvedUser.roles.some((r) => r !== "client") || username === resolvedUser.username;
  },

  hasRoles: (_roles: Role[], user?: UserStore): boolean => {
    const resolvedUser = user ?? store.user;

    if (!(_roles.length && resolvedUser)) {
      return false;
    }

    return _roles.every((r) => resolvedUser.roles.includes(r));
  },
});

export { useUserBusiness };
