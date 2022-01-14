import Home from "@/views/Home.vue";
import {
  createRouter as createVueRouter,
  createWebHistory,
  RouteLocationRaw,
  RouteRecordRaw,
} from "vue-router";
import { Role } from "@/common/constants";

declare module "vue-router" {
  interface RouteMeta {
    auth: "none" | "any" | Role[] | (() => boolean);
  }
}

type RouteDef<T> = RouteRecordRaw & { helper: (arg: T) => RouteLocationRaw };

type Routes = typeof routes;
type RouteName = keyof Routes;

type HelperArg<T extends RouteName> = Parameters<Routes[T]["helper"]>[0] extends void
  ? {}
  : Parameters<Routes[T]["helper"]>[0];

const route = <T extends object | void = void>(raw: RouteRecordRaw): RouteDef<T> => {
  const helper = (arg: T) =>
    arg
      ? Object.entries(arg).reduce<string>(
          (path, [key, value]) => path.replace(`:${key}`, value),
          raw.path
        )
      : raw.path;

  return { ...raw, helper };
};

const routes = {
  home: route({ path: "/", component: Home }),
  profile: route<{ id: string }>({ path: "/profile/:id", component: Home }),
};

const routeHelper = <T extends RouteName>(args: { name: T } & HelperArg<T>): RouteLocationRaw =>
  routes[args.name].helper(args as never);

const createRouter = () => {
  const router = createVueRouter({
    routes: Object.values(routes),
    history: createWebHistory(),
  });

  router.beforeEach((to) => {
    if (to.meta.auth === "none") {
      return;
    }

    throw new Error("Authentication route guards not implemented");
  });

  return router;
};
export { createRouter, routeHelper as route };
