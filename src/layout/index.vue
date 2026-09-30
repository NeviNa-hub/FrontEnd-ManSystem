<template>
  <!-- 布局组件 -->
  <div class="admin-layout">
    <MenuSidebar
      :is-collapse="isCollapse"
      @toggle-collapse="isCollapse = !isCollapse"
    />
    <div class="admin-body">
      <HeadNavbar />
      <!-- 主内容区域 -->
      <main class="admin-main"><RouterView /></main>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { RouterView } from "vue-router";
import HeadNavbar from "./components/HeadNavbar.vue";
import MenuSidebar from "./components/MenuSidebar.vue";

const isCollapse = ref(false);
</script>

<style lang="scss" scoped>
.admin-layout {
  position: fixed;
  inset: 0;
  width: 100%;
  display: flex;
  overflow: hidden;
}

.admin-body {
  display: flex;
  flex: 1;
  min-width: 0;
  flex-direction: column;
  overflow: hidden;
}

.admin-main {
  flex: 1;
  min-height: 0;
  min-width: 0;
  overflow-x: hidden;
  overflow-y: auto;
  padding: 0;
  background: #f5f7fa;
}
</style>
