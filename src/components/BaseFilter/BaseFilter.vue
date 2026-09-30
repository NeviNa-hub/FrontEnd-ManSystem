<template>
  <el-form class="filter-bar" :model="model" @submit.prevent="emit('search')">
    <div class="filter-fields"><slot /></div>
    <div class="filter-actions">
      <el-button type="primary" native-type="submit">查询</el-button>
      <el-button @click="emit('reset')">重置</el-button>
    </div>
  </el-form>
</template>

<script setup>
defineProps({
  model: { type: Object, required: true },
});

const emit = defineEmits(["search", "reset"]);
</script>
