import { createRouter, createWebHistory, type RouteRecordRaw } from "vue-router";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: "home",
    component: () => import("../views/home.vue"),
  },
  {
    path: "/letter",
    name: "letter",
    component: () => import("../views/letter.vue"),
  },
  {
    path: "/welcome",
    name: "welcome",
    component: () => import("../views/welcome.vue"),
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
