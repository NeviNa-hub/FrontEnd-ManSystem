<template>
  <!-- 占位页面组件 -->
  <section class="business-page">
    <div class="page-heading">
      <div>
        <h1>{{ pageTitle }}</h1>
        <p>该功能正在建设中</p>
      </div>
    </div>
    <el-card shadow="never"><el-empty description="暂未开放" /></el-card>
  </section>
</template>

<script setup>
import { computed } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();
const pageTitle = computed(() => route.meta.pageTitle || "功能页面");
</script>
