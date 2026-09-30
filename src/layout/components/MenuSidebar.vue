<template>
  <aside class="admin-aside" :class="{ 'is-collapsed': isCollapse }">
    <!-- 标题 -->
    <div class="aside-brand">
      <span class="brand-mark">H</span>
      <span v-if="!isCollapse" class="brand-name">HollyGlobe</span>
    </div>

    <!-- 菜单 -->
    <div class="aside-scroll">
      <!-- 一级菜单（图标+标题） -->
      <el-menu
        :default-active="route.path"
        :collapse="isCollapse"
        :collapse-transition="false"
        router
        class="admin-menu"
      >
        <el-sub-menu
          v-for="menu in ADMIN_MENU"
          :key="menu.index"
          :index="menu.index"
          popper-class="admin-menu-popper"
        >
          <template #title>
            <img
              v-if="typeof menu.icon === 'string'"
              :src="menu.icon"
              class="menu-image-icon"
              alt=""
            />
            <el-icon v-else><component :is="menu.icon" /></el-icon>
            <span>{{ menu.title }}</span>
          </template>
          <el-menu-item
            v-for="item in menu.children"
            :key="item.index"
            :index="item.index"
          >
            <el-icon><component :is="item.icon" /></el-icon><span>{{ item.title }}</span>
          </el-menu-item>
          <button
            v-if="menu.externalUrl"
            type="button"
            class="external-menu-button"
            @click.stop="openExternalPage(menu.externalUrl)"
          >
            <el-icon><Link /></el-icon>
            <span>{{ menu.externalTitle }}</span>
          </button>
        </el-sub-menu>
      </el-menu>
    </div>

    <div class="aside-footer">
      <div class="user-profile">
        <span class="user-avatar">
          {{ displayName.slice(0, 1).toUpperCase() }}
        </span>
        <div v-if="!isCollapse" class="user-copy">
          <strong>{{ displayName }}</strong>
        </div>
        <el-tooltip v-if="!isCollapse" content="退出登录" placement="top">
          <el-button link class="user-more" @click="handleLogout">
            <el-icon><SwitchButton /></el-icon>
          </el-button>
        </el-tooltip>
      </div>
      <div type="button" class="collapse-button" @click="emit('toggle-collapse')" title>
        <!-- 提示：点击切换侧边栏宽度 -->
        <el-tooltip content="点击切换侧边栏宽度" placement="top">
          <el-icon><Expand v-if="isCollapse" /><Fold v-else /></el-icon>
        </el-tooltip>
      </div>
    </div>
  </aside>
</template>

<script setup>
import { computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { Expand, Fold, Link, SwitchButton } from "@element-plus/icons-vue";

import { ADMIN_MENU } from "@/config/menu";
import { useAuthStore } from "@/stores/auth";
import { confirmAction } from "@/utils/confirm-dialog";

/**
 * 侧边栏属性。
 * @property {boolean} isCollapse 是否折叠侧边栏
 */
defineProps({ isCollapse: { type: Boolean, default: false } });
const emit = defineEmits(["toggle-collapse"]);
const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();
const displayName = computed(
  () => authStore.profile?.name || authStore.profile?.username || "用户"
);

const openExternalPage = (url) => {
  window.open(url, "_blank", "noopener,noreferrer");
};

/** 确认后退出登录并回到登录页。 */
const handleLogout = async () => {
  const confirmed = await confirmAction("确定退出登录吗？", "退出登录");
  if (!confirmed) return;
  authStore.logout();
  router.replace({ name: "login" });
};
</script>

<style lang="scss" scoped>
.admin-aside {
  display: flex;
  flex-shrink: 0;
  flex-direction: column;
  width: 248px;
  height: 100%;
  border-right: 1px solid #e8eaf0;
  color: #20232b;
  background: #fff;
  transition: width 0.2s;
}
.admin-aside.is-collapsed {
  width: 70px;
}

.admin-aside.is-collapsed .aside-brand {
  justify-content: center;
  padding: 0;
}

.admin-aside.is-collapsed .aside-scroll {
  padding-right: 8px;
  padding-left: 8px;
}

.admin-aside.is-collapsed .admin-menu {
  width: 100%;
}

.admin-aside.is-collapsed .admin-menu :deep(.el-menu--collapse) {
  width: 100%;
  transition: none;
}

.admin-aside.is-collapsed
  .admin-menu
  :deep(.el-menu--collapse > .el-sub-menu > .el-sub-menu__title),
.admin-aside.is-collapsed .admin-menu :deep(.el-menu--collapse > .el-menu-item) {
  width: 100%;
  padding-right: 0 !important;
  padding-left: 0 !important;
  transition: none;
}

.admin-aside.is-collapsed .admin-menu :deep(.el-sub-menu__title),
.admin-aside.is-collapsed .admin-menu :deep(.el-menu-item) {
  justify-content: center;
  padding: 0 !important;
}

.admin-aside.is-collapsed .admin-menu :deep(.el-icon) {
  margin: 0;
}

.admin-aside.is-collapsed .admin-menu :deep(.el-menu--collapse .el-icon) {
  display: inline-flex;
  visibility: visible;
  opacity: 1;
}

.admin-aside.is-collapsed .menu-image-icon {
  margin: 0;
}

.admin-aside.is-collapsed .external-menu-button {
  display: none;
}

.admin-aside.is-collapsed .admin-menu :deep(.el-sub-menu__title > span:not(.el-icon)),
.admin-aside.is-collapsed .admin-menu :deep(.el-menu-item > span:not(.el-icon)),
.admin-aside.is-collapsed .admin-menu :deep(.el-sub-menu__icon-arrow) {
  display: none;
}

.admin-aside.is-collapsed .admin-menu :deep(.el-sub-menu__title),
.admin-aside.is-collapsed .admin-menu :deep(.el-menu-item) {
  width: 56px;
  overflow: hidden;
}
.aside-brand {
  display: flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  gap: 15px;
  height: 60px;
  // padding: 0 20px;
  background: #e5e5e9;
}
.brand-mark {
  display: grid;
  flex: 0 0 32px;
  width: 32px;
  height: 32px;
  line-height: 32px;
  justify-self: center;
  text-align: center;
  border-radius: 5px;
  color: #fff;
  background: #4a4add;
  font-size: 22px;
  font-weight: 700;
}
.brand-name {
  color: #292d38;
  font-size: 15px;
  font-weight: 700;
  letter-spacing: 1.5px;
}
.aside-scroll {
  min-height: 0;
  flex: 1;
  overflow: hidden auto;
  // padding: 12px 16px;
}
.admin-menu {
  --el-menu-bg-color: transparent;
  --el-menu-text-color: #4c515c;
  --el-menu-hover-bg-color: #f3f3ff;
  --el-menu-active-color: #e5e5ff;
  --el-menu-item-height: 45px;
  border: 0;
}
.admin-menu :deep(.el-sub-menu__title),
.admin-menu :deep(.el-menu-item) {
  gap: 10px;
}
.admin-menu :deep(.el-sub-menu__title) {
  color: #22252d;
  font-weight: 600;
}

.admin-menu :deep(.el-sub-menu__title > .el-icon) {
  display: inline-flex;
  flex: 0 0 18px;
  width: 18px;
  height: 18px;
  margin-right: 0;
  visibility: visible;
  opacity: 1;
}

.menu-image-icon {
  flex: 0 0 30px;
  width: 30px;
  height: 30px;
  object-fit: contain;
}
.admin-menu :deep(.el-sub-menu .el-menu) {
  border: 0;
}
.admin-menu :deep(.el-menu-item.is-active) {
  color: #fff;
  background: #4848dc;
}

.external-menu-button {
  display: flex;
  align-items: center;
  width: 100%;
  gap: 10px;
  height: var(--el-menu-item-height);
  padding: 0 20px;
  border: 0;
  border-radius: 8px;
  color: #4c515c;
  background: transparent;
  font-size: 13px;
  text-align: left;
  cursor: pointer;
}

.external-menu-button:hover {
  background: #f3f3ff;
}
.aside-tools {
  display: none;
  padding: 10px 16px;
  border-top: 1px solid #f0f1f4;
}
.tool-button,
.collapse-button {
  display: flex;
  align-items: center;
  border: 0;
  color: #656b76;
  background: transparent;
  cursor: pointer;
}
.tool-button {
  width: 100%;
  gap: 10px;
  padding: 9px 10px;
  border-radius: 8px;
  font-size: 13px;
  text-align: left;
}
.tool-button:hover,
.collapse-button:hover {
  background: #f7f7fa;
}
.tool-shortcut {
  margin-left: auto;
  color: #a1a5ad;
  font-size: 11px;
}
.aside-footer {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 14px 16px 18px;
  border-top: 1px solid #f0f1f4;
}

.admin-aside.is-collapsed .aside-footer {
  flex-direction: column;
  padding-right: 8px;
  padding-left: 8px;
}

.admin-aside.is-collapsed .user-profile {
  flex: 0 0 auto;
  justify-content: center;
  width: 100%;
}
.user-profile {
  display: flex;
  min-width: 0;
  flex: 1;
  align-items: center;
  gap: 10px;
}
.user-avatar {
  display: grid;
  flex-shrink: 0;
  width: 34px;
  height: 34px;
  place-items: center;
  border-radius: 50%;
  color: #4640b8;
  background: #e9e8ff;
  font-size: 13px;
  font-weight: 600;
}
.user-copy {
  display: grid;
  min-width: 0;
  gap: 3px;
}
.user-copy strong,
.user-copy small {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.user-copy strong {
  color: #292d38;
  font-size: 12px;
}
.user-copy small {
  display: none;
  color: #989da7;
  font-size: 10px;
}
.user-more {
  margin-left: auto;
  color: #858a94;
}
.collapse-button {
  justify-content: center;
  width: 28px;
  height: 28px;
  padding: 0;
  border-radius: 6px;
}
</style>
