import {
  Coin,
  Document,
  OfficeBuilding,
  Setting,
  User,
} from "@element-plus/icons-vue";

import contentLogo from "@/assets/images/content-logo.png";
import geoLogo from "@/assets/images/geo-logo.png";
import seoLogo from "@/assets/images/seo-logo.png";

/** 管理后台导航与页面配置。 */
export const NAVIGATION_CONFIG = [
  {
    index: "platform",
    title: "权限管理",
    icon: Coin,
    children: [
      {
        path: "/platform/users",
        name: "platform-users",
        title: "公司管理员",
        icon: User,
        view: "platform-users",
      },
      {
        path: "/platform/organizations",
        name: "platform-organizations",
        title: "组织管理",
        icon: OfficeBuilding,
        view: "platform-organizations",
      },
      {
        path: "/platform/points",
        name: "platform-points",
        title: "积分充值",
        icon: Coin,
        view: "platform-points",
      },
    ],
  },
  {
    index: "platform-geo",
    title: "GEO特工队",
    icon: geoLogo,
    externalUrl: "https://testai.geoagent.com.cn/",
    externalTitle: "进入 GEO 官方平台",
    children: [
      {
        path: "/geo/users",
        name: "platform-geo-users",
        title: "用户管理",
        icon: User,
        view: "geo-users",
      },
      {
        path: "/geo/organizations",
        name: "platform-geo-organizations",
        title: "组织管理",
        icon: OfficeBuilding,
        view: "geo-organizations",
      },
      {
        path: "/geo/blogs",
        name: "platform-geo-blogs",
        title: "博客管理",
        icon: Document,
        view: "geo-blogs",
      },
    ],
  },
  {
    index: "platform-seo",
    title: "SEO特工队",
    icon: seoLogo,
    externalUrl: "https://testai.seoagent.com.cn/",
    externalTitle: "进入 SEO 官方平台",
    children: [
      {
        path: "/seo/users",
        name: "platform-seo-users",
        title: "用户管理",
        icon: User,
        view: "seo-users",
      },
      {
        path: "/seo/organizations",
        name: "platform-seo-organizations",
        title: "组织管理",
        icon: OfficeBuilding,
        view: "seo-organizations",
      },
      {
        path: "/seo/blogs",
        name: "platform-seo-blogs",
        title: "博客管理",
        icon: Document,
        view: "seo-blogs",
      },
    ],
  },
    {
    index: "platform-content",
    title: "内容特工队",
    icon: contentLogo,
    externalUrl: "https://testweb.reelsagent.com/home",
    externalTitle: "进入内容官方平台",
    children: [
      {
        path: "/content/users",
        name: "platform-content-users",
        title: "用户管理",
        icon: User,
        view: "content-users",
      },
      {
        path: "/content/organizations",
        name: "platform-content-organizations",
        title: "组织管理",
        icon: OfficeBuilding,
        view: "content-organizations",
      },
      {
        path: "/content/blogs",
        name: "platform-content-blogs",
        title: "博客管理",
        icon: Document,
        view: "content-blogs",
      },
    ],
  },
];

/** 侧边栏渲染配置。 */
export const ADMIN_MENU = NAVIGATION_CONFIG.map(
  ({ index, title, icon, children, externalUrl, externalTitle }) => ({
    index,
    title,
    icon,
    externalUrl,
    externalTitle,
    children: children.map((item) => ({
      index: item.path,
      title: item.title,
      icon: item.icon,
    })),
  }),
);

/** 动态路由注册配置。 */
export const DYNAMIC_ROUTE_CONFIG = NAVIGATION_CONFIG.flatMap((group) =>
  group.children.map((item) => ({
    ...item,
    breadcrumb: [group.title, item.title],
  })),
);
