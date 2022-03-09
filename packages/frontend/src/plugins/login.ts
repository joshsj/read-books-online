import { isRBOError } from "@client/index";
import { AccountDto, JWTPayloadDto, CreateUserRequest, TokensDto } from "@client/models";
import { RBOErrorDto } from "@client/types";
import { client } from "@frontend/client";
import { route } from "@frontend/router";
import { store, UserStore } from "@frontend/store";
import { Router, useRouter } from "vue-router";
import jwtDecode from "jwt-decode";
import { setCookie } from "@frontend/utilities/http";

const preserveTokens = ({ authentication, refresh }: TokensDto) => {
  const payload = jwtDecode(authentication.value) as JWTPayloadDto;

  setCookie({
    key: import.meta.env.VITE_REFRESH_TOKEN_KEY,
    value: refresh.value,
    expires: refresh.expires,
  });

  const userStore: UserStore = {
    authenticationToken: authentication.value,

    _id: payload.sub,
    username: payload.preferred_username,
    roles: payload.roles,
  };

  store.user = userStore;
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
  const tokens = await client.auth.post(accountDto);

  if (isRBOError(tokens)) {
    return tokens;
  }

  preserveTokens(tokens);

  router.push(route({ name: "tickets" }));
};

const logout = (router: Router) => {
  store.user = undefined;
  setCookie({
    key: import.meta.env.VITE_REFRESH_TOKEN_KEY,
    value: "expired",
    expires: new Date(0),
  });

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

export { useLogin, preserveTokens };
