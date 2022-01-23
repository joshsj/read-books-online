import { store } from "@frontend/store";
import Login from "@frontend/views/Login.vue";
import Ticket from "@frontend/views/Ticket.vue";
import Tickets from "@frontend/views/Tickets.vue";
import {
  createRouter as createVueRouter,
  createWebHistory,
  RouteLocationRaw,
  RouteRecordRaw,
} from "vue-router";
import { Id } from "@client/models";

declare module "vue-router" {
  interface RouteMeta {
    auth: "none" | "any"; // | Role[] | (() => boolean);
  }
}

type RouteDef<T> = RouteRecordRaw &
  Required<Pick<RouteRecordRaw, "meta">> & { helper: (arg: T) => RouteLocationRaw };

type Routes = typeof routes;
type RouteName = keyof Routes;

type HelperArg<T extends RouteName> = Parameters<Routes[T]["helper"]>[0] extends void
  ? {}
  : Parameters<Routes[T]["helper"]>[0];

const route = <T extends object | void = void>(
  raw: RouteRecordRaw & Required<Pick<RouteRecordRaw, "meta">>
): RouteDef<T> => {
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
  login: route({ path: "/login", component: Login, meta: { auth: "none" } }),

  tickets: route({
    path: "/tickets",
    alias: "/",
    component: Tickets,
    meta: { auth: "any" },
  }),

  ticket: route<{ ticketId: Id }>({
    path: "/tickets/:ticketId",
    component: Ticket,
    meta: { auth: "any" },
    props: true,
  }),

  account: route<{ username: string }>({
    path: "/accounts/:username",
    redirect: "/",
    meta: { auth: "any" },
    props: true,
  }),
  accounts: route({ path: "/accounts", redirect: "/", meta: { auth: "any" } }),

  noPath: route({ path: "/:noPath(.*)*", redirect: "/", meta: { auth: "none" } }),
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

    if (!store.user) {
      return routeHelper({ name: "login" });
    }

    return;
  });

  return router;
};
export { createRouter, routeHelper as route };
