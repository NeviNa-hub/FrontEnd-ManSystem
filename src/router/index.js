import { createRouter, createWebHistory } from "vue-router";

import { useAuthStore } from "@/stores/auth";
import { addDynamicRoutes } from "@/stores/router";

// 路由配置
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/login",
      name: "login",
      component: () => import("@/views/login/index.vue"),
    },
    {
      path: "/",
      name: "admin-layout",
      component: () => import("@/layout/index.vue"),
      meta: { requiresAuth: true },
      children: [{ path: "", redirect: "/platform/users" }],
    },
  ],
});

// 路由守卫
router.beforeEach(async (to) => {
  const authStore = useAuthStore();

  if (!authStore.initialized) {
    try {
      await authStore.restoreSession();
    } catch {
      // 会话失效时由 restoreSession 清理，继续按未登录处理。
    }
  }

  if (authStore.isAuthenticated) {
    const routesAdded = addDynamicRoutes(router);
    if (routesAdded && to.name === undefined) {
      return to.fullPath;
    }
  }

  if (to.name === "login" && authStore.isAuthenticated) {
    return "/";
  }

  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    return { name: "login", query: { redirect: to.fullPath } };
  }

  return true;
});

export default router;
