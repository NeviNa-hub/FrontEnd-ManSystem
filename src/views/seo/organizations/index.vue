<template>
  <section class="business-page organizations-page">
    <div class="page-heading">
      <div>
        <h1>组织管理</h1>
      </div>
      <el-button type="primary" @click="openCreateDialog">新增组织</el-button>
    </div>
    <div class="list-panel">
      <BaseLoading v-if="listRef" :visible="listRef.loading" />
      <BaseFilter
        v-if="listRef"
        :model="listRef.filters"
        @search="searchList"
        @reset="resetList"
      >
        <el-form-item label="组织名称">
          <el-input
            v-model="listRef.filters.name"
            clearable
            placeholder="请输入组织名称"
          />
        </el-form-item>
        <el-form-item label="角色池">
          <el-select v-model="listRef.filters.role" clearable placeholder="请选择角色池">
            <el-option
              v-for="role in ROLE_OPTIONS"
              :key="role"
              :label="role"
              :value="role"
            />
          </el-select>
        </el-form-item>
      </BaseFilter>
      <OrganizationList ref="listRef" :pagination="pagination" />
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
import OrganizationList from "@/components/OrganizationList/OrganizationList.vue";
import { ROLE_OPTIONS } from "@/config/options";

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
