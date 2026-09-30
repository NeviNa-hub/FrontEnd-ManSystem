<template>
  <header class="admin-header">
    <el-breadcrumb class="header-breadcrumb" separator="/">
      <el-breadcrumb-item v-for="item in breadcrumbItems" :key="item">{{
        item
      }}</el-breadcrumb-item>
    </el-breadcrumb>
  </header>
</template>

<script setup>
import { computed } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();
const breadcrumbItems = computed(() => route.meta.breadcrumb || []);
</script>

<style lang="scss" scoped>
.admin-header {
  display: flex;
  flex-shrink: 0;
  align-items: center;
  height: 50px;
  line-height: 50px;
  padding: 0 20px;
  border-bottom: 1px solid var(--border);
  background: #fff;
}
.header-breadcrumb {
  flex: 1;
}
</style>
