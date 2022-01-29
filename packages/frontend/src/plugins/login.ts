import { isRBOError } from "@client/index";
import { AccountDto, JWTPayloadDto, CreateUserRequest } from "@client/models";
import { RBOErrorDto } from "@client/types";
import { client } from "@frontend/client";
import { route } from "@frontend/router";
import { store, UserStore } from "@frontend/store";
import { Router, useRouter } from "vue-router";
import jwtDecode from "jwt-decode";

const toUserStore = (token: string): UserStore => {
  const payload = jwtDecode(token) as JWTPayloadDto;

  const store: UserStore = {
    authenticationToken: token,

    _id: payload.sub,
    username: payload.preferred_username,
    roles: payload.roles,
  };

  return store;
};

const isLoggedIn = (): boolean => !!store.user;

const signUp = async (router: Router, request: CreateUserRequest) => {
  const response = await client.user.create(request);

  if (isRBOError(response)) {
    return response;
  }

  return await login(router, request);
};

const login = async (router: Router, accountDto: AccountDto): Promise<RBOErrorDto | void> => {
  const response = await client.auth.post(accountDto);

  if (isRBOError(response)) {
    return response;
  }

  store.user = toUserStore(response.token);
  router.push(route({ name: "tickets" }));
};

const logout = (router: Router) => {
  store.user = undefined;

  client.auth.delete();

  router.push(route({ name: "login" }));
};

const useLogin = () => {
  const router = useRouter();

  return {
    signUp: (request: CreateUserRequest) => signUp(router, request),
    login: (accountDto: AccountDto) => login(router, accountDto),
    logout: () => logout(router),
    isLoggedIn,
  };
};

export { useLogin, toUserStore };
