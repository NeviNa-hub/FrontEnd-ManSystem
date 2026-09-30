import { DYNAMIC_ROUTE_CONFIG } from "@/config/menu";

// 视图组件映射表
const VIEW_COMPONENT_MAP = {
  "platform-users": () => import("@/views/platform/users/index.vue"),
  "platform-organizations": () =>
    import("@/views/platform/organizations/index.vue"),
  "platform-points": () => import("@/views/platform/points/index.vue"),
  "geo-users": () => import("@/views/geo/users/index.vue"),
  "geo-organizations": () => import("@/views/geo/organizations/index.vue"),
  "geo-blogs": () => import("@/views/geo/blogs/index.vue"),
  "seo-users": () => import("@/views/seo/users/index.vue"),
  "seo-organizations": () => import("@/views/seo/organizations/index.vue"),
  "seo-blogs": () => import("@/views/seo/blogs/index.vue"),
  "content-users": () => import("@/views/content/users/index.vue"),
  "content-organizations": () =>
    import("@/views/content/organizations/index.vue"),
  "content-blogs": () => import("@/views/content/blogs/index.vue"),
  placeholder: () => import("@/views/placeholder/index.vue"),
};

const DYNAMIC_ROUTES = DYNAMIC_ROUTE_CONFIG.map((route) => ({
  path: route.path.replace(/^\//, ""),
  name: route.name,
  component: VIEW_COMPONENT_MAP[route.view],
  meta: {
    requiresAuth: true,
    breadcrumb: route.breadcrumb,
    pageTitle: route.title,
  },
}));

let dynamicRoutesAdded = false;

/**
 * 注册当前会话可访问的动态路由。
 * @param {import("vue-router").Router} router 路由实例
 * @returns {boolean} 是否首次完成注册
 */
export const addDynamicRoutes = (router) => {
  if (dynamicRoutesAdded) return false;

  DYNAMIC_ROUTES.forEach((route) => {
    if (!router.hasRoute(route.name)) router.addRoute("admin-layout", route);
  });
  dynamicRoutesAdded = true;
  return true;
};

/**
 * 清理动态路由注册状态，供退出登录后重新建立会话使用。
 * @param {import("vue-router").Router} router 路由实例
 * @returns {void}
 */
export const removeDynamicRoutes = (router) => {
  DYNAMIC_ROUTES.forEach((route) => {
    if (router.hasRoute(route.name)) router.removeRoute(route.name);
  });
  dynamicRoutesAdded = false;
};
