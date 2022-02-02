import { isRBOError } from "@client/index";
import { Role, UpdateUserRequest, UserDto } from "@client/models";
import { client } from "@frontend/client";
import { store, UserStore } from "@frontend/store";
import { disabledToggleText } from "@frontend/utilities/user";
import { simpleAction } from ".";
import { useInteractor } from "../interactor";

const useUserBusiness = () => {
  const interactor = useInteractor();
  const { notify } = interactor;

  const canView = (username: string, user?: UserStore): boolean => {
    const resolvedUser = user ?? store.user;

    if (!resolvedUser) {
      return false;
    }

    return username === resolvedUser.username || resolvedUser.roles.includes("authorizer");
  };

  const canUpdate = canView;

  return {
    canView,
    canUpdate,

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

    canDisable: (targetUser: UserDto, user?: UserStore): boolean =>
      canUpdate(targetUser.username, user) && !targetUser.roles.includes("authorizer"),

    toggleDisabled: async (user: UserDto): Promise<boolean> => {
      const action = disabledToggleText(user.disabled);

      return simpleAction(
        interactor,
        () =>
          client.user.update({
            requestName: "updateUserRequest",
            userId: user._id,
            disabled: !user.disabled,
          }),
        `User ${action}d`,
        `Are you sure you want to ${action} this user?`
      );
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
