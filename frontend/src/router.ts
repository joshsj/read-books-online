import { createRouter as createVueRouter, createWebHistory } from "vue-router";
import { RouteRecordRaw } from "vue-router/dist/vue-router";
import Home from "@/views/Home.vue";

const routes: RouteRecordRaw[] = [
  {
    path: "/",
    component: Home,
  },
];

const createRouter = () =>
  createVueRouter({
    routes,
    history: createWebHistory(),
  });

export { createRouter, routes };
