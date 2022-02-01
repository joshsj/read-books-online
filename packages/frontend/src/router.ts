import { Id } from "@client/models";
import { store } from "@frontend/store";
import Login from "@frontend/views/Login.vue";
import SignUp from "@frontend/views/SignUp.vue";
import Ticket from "@frontend/views/Ticket.vue";
import Tickets from "@frontend/views/Tickets.vue";
import User from "@frontend/views/User.vue";
import Users from "@frontend/views/Users.vue";
import {
  createRouter as createVueRouter,
  createWebHistory,
  RouteLocationRaw,
  RouteRecordRaw,
} from "vue-router";

declare module "vue-router" {
  interface RouteMeta {
    auth: "none" | "any" | ((to: RouteLocationNormalized) => boolean); //| Role[]
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
  login: route({
    path: "/login",
    component: Login,
    meta: { auth: "none" },
  }),

  signUp: route({
    path: "/signup",
    component: SignUp,
    meta: { auth: "none" },
  }),

  ticket: route<{ ticketId: Id }>({
    path: "/tickets/:ticketId",
    component: Ticket,
    meta: { auth: "any" },
    props: true,
  }),
  tickets: route({
    path: "/tickets",
    alias: "/",
    component: Tickets,
    meta: { auth: "any" },
  }),

  user: route<{ username: string }>({
    path: "/users/:username",
    component: User,
    props: true,
    meta: {
      auth: (to) => {
        if (store.user!.roles.some((r) => r !== "client")) {
          return true;
        }

        const username = to.params.username as string;

        return store.user!.username === username;
      },
    },
  }),
  users: route({
    path: "/users",
    component: Users,
    meta: { auth: "any" },
  }),

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
    const { auth } = to.meta;
    const routeAway = routeHelper({ name: "login" });

    if (auth === "none") {
      return;
    }

    if (!store.user) {
      return routeAway;
    }

    if (auth === "any") {
      return;
    }

    if (!auth(to)) {
      return routeAway;
    }

    return;
  });

  return router;
};
export { createRouter, routeHelper as route };
