import Home from "@/views/Home.vue";
import {
  createRouter as createVueRouter,
  createWebHistory,
  RouteLocationRaw,
  RouteRecordRaw,
} from "vue-router";

type RouteDef<T = void> = RouteRecordRaw & { helper: (arg: T) => RouteLocationRaw };

type Routes = typeof routes;
type RouteName = keyof Routes;

type HelperArg<T extends RouteName> = Parameters<Routes[T]["helper"]>[0] extends void
  ? {}
  : Parameters<Routes[T]["helper"]>[0];

const home: RouteDef = {
  path: "/",
  component: Home,
  helper: () => home.path,
};

const routes = { home };

const route = <T extends RouteName>(args: { name: T } & HelperArg<T>): RouteLocationRaw =>
  routes[args.name].helper(args as never);

const createRouter = () =>
  createVueRouter({
    routes: Object.values(routes),
    history: createWebHistory(),
  });

export { createRouter, route };
