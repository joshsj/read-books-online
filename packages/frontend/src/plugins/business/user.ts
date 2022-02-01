import { isRBOError } from "@client/index";
import { Role, UpdateUserRequest } from "@client/models";
import { client } from "@frontend/client";
import { store, UserStore } from "@frontend/store";
import { useInteractor } from "../interactor";

const useUserBusiness = () => {
  const { notify } = useInteractor();

  const canView = (username: string, user?: UserStore): boolean => {
    const resolvedUser = user ?? store.user;

    if (!resolvedUser) {
      return false;
    }

    return username === resolvedUser.username || resolvedUser.roles.includes("authorizer");
  };

  return {
    canView,
    canUpdate: (username: string, user?: UserStore): boolean => canView(username, user),
    canUpdateRoles: (user?: UserStore): boolean => {
      const resolvedUser = user ?? store.user;

      if (!resolvedUser) {
        return false;
      }

      return resolvedUser.roles.includes("authorizer");
    },

    update: async (request: UpdateUserRequest): Promise<boolean> => {
      const response = await client.user.update(request);

      if (isRBOError(response)) {
        notify(response);
        return false;
      }

      notify({ message: "Update successful", variant: "success" });
      return true;
    },

    hasRoles: (_roles: Role[], user?: UserStore): boolean => {
      const resolvedUser = user ?? store.user;

      if (!(_roles.length && resolvedUser)) {
        return false;
      }

      return _roles.every((r) => resolvedUser.roles.includes(r));
    },
  };
};

export { useUserBusiness };
