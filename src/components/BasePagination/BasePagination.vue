<template>
  <!-- 分页组件 -->
  <el-row class="base-pagination">
    <el-icon v-if="loading" class="pagination-loading"><Loading /></el-icon>
    <el-pagination
      :current-page="pagination.page"
      :page-size="pagination.pageSize"
      :page-sizes="PAGE_SIZES"
      :total="pagination.total"
      :disabled="loading"
      background
      layout="total, sizes, prev, pager, next, jumper"
      @current-change="(page) => emit('handleFn', { page })"
      @size-change="(pageSize) => emit('handleFn', { page: 1, page_size: pageSize })"
    />
  </el-row>
</template>

<script setup>
import { Loading } from "@element-plus/icons-vue";

import { PAGE_SIZES } from "@/config/options";

/**
 * 分页属性。
 * @property {object} pagination 当前页、页大小和总数
 * @property {boolean} loading 是否处于加载状态
 */
defineProps({
  pagination: { type: Object, required: true },
  loading: { type: Boolean, default: false },
});

const emit = defineEmits(["handleFn"]);
</script>

<style lang="scss" scoped>
.base-pagination {
  position: relative;
  display: flex;
  justify-content: center;
  padding: 18px 0;
  border-top: 1px solid var(--border);
  background: #fff;
}

.pagination-loading {
  position: absolute;
  left: calc(50% - 112px);
  color: var(--primary);
  animation: loading-rotate 1s linear infinite;
}

@keyframes loading-rotate {
  to {
    transform: rotate(360deg);
  }
}
</style>
