import Home from "@/views/Home.vue";
import {
  createRouter as createVueRouter,
  createWebHistory,
  RouteLocationRaw,
  RouteRecordRaw,
} from "vue-router";

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

const createRouter = () =>
  createVueRouter({
    routes: Object.values(routes),
    history: createWebHistory(),
  });

export { createRouter, routeHelper as route };
