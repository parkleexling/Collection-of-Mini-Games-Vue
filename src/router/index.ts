import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      redirect: "/home",
    },
    {
      path: "/home",
      component: () => import("../components/Home.vue"),
    },
    {
      path: "/minesweeper",
      component: () => import("../module/minesweeper/Minesweeper.vue"),
    },
  ],
});

export default router;
