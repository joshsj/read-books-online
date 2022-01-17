import { route } from "@frontend/router";
import { store } from "@frontend/store";
import { Router, useRouter } from "vue-router";

const isLoggedIn = (): boolean => !!store.authenticationToken;

const login = (router: Router, token: string) => {
  store.authenticationToken = token;

  router.push(route({ name: "home" }));
};

const logout = (router: Router) => {
  store.authenticationToken = undefined;

  // TODO implement api request to expire refresh token

  router.push(route({ name: "login" }));
};

const useLogin = () => {
  const router = useRouter();

  return {
    login: (token: string) => login(router, token),
    logout: () => logout(router),
    isLoggedIn,
  };
};

export { useLogin };
