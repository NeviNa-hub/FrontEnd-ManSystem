<template>
  <section class="business-page blogs-page">
    <div class="page-heading">
      <div>
        <h1>博客管理</h1>
      </div>
      <el-button type="primary" @click="openCreateDialog">新增文章</el-button>
    </div>
    <div class="list-panel">
      <BaseLoading v-if="listRef" :visible="listRef.loading" />
      <BaseFilter
        v-if="listRef"
        :model="listRef.filters"
        @search="searchList"
        @reset="resetList"
      >
        <el-form-item label="文章标题">
          <el-input
            v-model="listRef.filters.title"
            clearable
            placeholder="请输入文章标题"
          />
        </el-form-item>
        <el-form-item label="作者">
          <el-input v-model="listRef.filters.author" clearable placeholder="请输入作者" />
        </el-form-item>
        <el-form-item label="创建时间">
          <el-date-picker
            v-model="listRef.filters.createdAtRange"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="YYYY-MM-DD"
            clearable
          />
        </el-form-item>
      </BaseFilter>
      <BlogList ref="listRef" :pagination="pagination" />
      <BasePagination
        :loading="listRef?.loading"
        :pagination="pagination"
        @handle-fn="handlePage"
      />
    </div>
  </section>
</template>

<script setup>
import { reactive, ref } from "vue";

import BaseFilter from "@/components/BaseFilter/BaseFilter.vue";
import BaseLoading from "@/components/BaseLoading/BaseLoading.vue";
import BasePagination from "@/components/BasePagination/BasePagination.vue";
import BlogList from "@/components/BlogList/BlogList.vue";

const listRef = ref();
const pagination = reactive({ page: 1, pageSize: 10, total: 0 });
const openCreateDialog = () => listRef.value?.openCreateDialog();
const searchList = () => {
  return listRef.value?.searchList();
};
const resetList = () => {
  return listRef.value?.resetList();
};
const handlePage = ({ page, page_size: pageSize }) => {
  pagination.page = page;
  if (pageSize) pagination.pageSize = pageSize;
  return listRef.value?.loadList();
};
</script>
