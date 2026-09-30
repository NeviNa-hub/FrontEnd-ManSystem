<template>
  <Teleport to="body">
    <div v-if="visible" class="base-loading" role="status" aria-live="polite">
      <div class="loading-panel">
        <el-icon class="loading-icon" :size="28"><Loading /></el-icon>
        <span>{{ text }}</span>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { Loading } from "@element-plus/icons-vue";

defineProps({
  visible: { type: Boolean, default: false },
  text: { type: String, default: "加载中..." },
});
</script>

<style lang="scss" scoped>
.base-loading {
  position: fixed;
  z-index: 3000;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgb(15 23 42 / 35%);
}

.loading-panel {
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  min-width: 110px;
  padding: 20px 24px;
  color: #475569;
  font-size: 14px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 8px 24px rgb(15 23 42 / 15%);
}

.loading-icon {
  color: var(--primary);
  animation: loading-rotate 1s linear infinite;
}

@keyframes loading-rotate {
  to {
    transform: rotate(360deg);
  }
}
</style>
