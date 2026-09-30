<template>
  <div class="organizations-list">
    <div class="data-table">
      <el-table
        ref="tableRef"
        :data="items"
        height="100%"
        row-key="id"
        stripe
        highlight-current-row
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55" />
        <el-table-column prop="name" label="组织名称" min-width="220" />
        <el-table-column prop="owner" label="负责人" min-width="180" />
        <el-table-column label="可授权角色池" min-width="360" show-overflow-tooltip>
          <template #default="{ row }">
            <el-tag
              v-for="role in row.roles"
              :key="role"
              :class="['role-tag', ROLE_TAG_CLASS_MAP[role]]"
              size="small"
              effect="plain"
            >
              {{ role }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="状态" width="140">
          <template #default="{ row }">
            <el-tag :type="row.status === '启用' ? 'success' : 'info'" effect="plain">
              {{ row.status }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="220" fixed="right">
          <template #default="{ row }">
            <el-button class="action-button action-button--view" link @click="openDialog('view', row)">
              查看
            </el-button>
            <el-button class="action-button action-button--edit" link @click="openDialog('edit', row)">
              修改
            </el-button>
            <el-button class="action-button action-button--delete" link @click="handleDeleteOrganization(row)">
              删除
            </el-button>
          </template>
        </el-table-column>
        <template #empty><el-empty description="暂无组织数据" /></template>
      </el-table>
      <div v-if="selectedRows.length" class="table-selection-actions">
        <span>已选 {{ selectedRows.length }} 项</span>
        <el-button type="danger" @click="handleBatchDelete">批删除</el-button>
      </div>
    </div>

    <BaseDialog
      v-model="dialogVisible"
      :title="dialogTitle"
      :loading="submitting"
      :is-view="isViewMode"
      :show-confirm="!isViewMode"
      @confirm="handleSubmitOrganization"
      @closed="resetDialog"
    >
      <el-form ref="formRef" :model="form" :rules="formRules" label-width="110px">
        <el-form-item label="组织名称" prop="name">
          <el-input
            v-model="form.name"
            :disabled="isViewMode"
            placeholder="请输入组织名称"
          />
        </el-form-item>
        <el-form-item label="负责人" prop="owner">
          <el-input
            v-model="form.owner"
            :disabled="isViewMode"
            placeholder="请输入负责人"
          />
        </el-form-item>
        <el-form-item label="可授权角色池" prop="roles">
          <el-select
            v-model="form.roles"
            :disabled="isViewMode"
            multiple
            clearable
            placeholder="请选择角色池"
          >
            <el-option
              v-for="role in ROLE_OPTIONS"
              :key="role"
              :label="role"
              :value="role"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-radio-group v-model="form.status" :disabled="isViewMode">
            <el-radio value="启用">启用</el-radio>
            <el-radio value="停用">停用</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
    </BaseDialog>
  </div>
</template>

<script setup>
import { onMounted, reactive, ref } from "vue";
import { ElMessage } from "element-plus";

import {
  createOrganization,
  deleteOrganization,
  getOrganizations,
  updateOrganization,
} from "@/apis/organizations";
import BaseDialog from "@/components/BaseDialog/BaseDialog.vue";
import { ROLE_OPTIONS, ROLE_TAG_CLASS_MAP } from "@/config/options";
import { useCrudDialog } from "@/hooks/use-crud-dialog";
import { useList } from "@/hooks/use-list";
import { confirmDelete } from "@/utils/confirm-dialog";

const props = defineProps({ pagination: { type: Object, required: true } });
const { filters, items, loading, pagination, loadList, searchList, resetList } = useList({
  pagination: props.pagination,
  createInitialFilters: () => ({ name: "", role: "" }),
  getList: getOrganizations,
});
const formRef = ref();
const tableRef = ref();
const selectedRows = ref([]);
// 表单验证规则
const formRules = {
  name: [{ required: true, message: "请输入组织名称", trigger: "blur" }],
  owner: [{ required: true, message: "请输入负责人", trigger: "blur" }],
  roles: [{ required: true, message: "请选择可授权角色", trigger: "change" }],
  status: [{ required: true, message: "请选择状态", trigger: "change" }],
};
const createInitialForm = () => ({
  id: null,
  name: "",
  owner: "",
  roles: [],
  status: "启用",
});
const form = reactive(createInitialForm());

const {
  dialogVisible,
  dialogMode,
  submitting,
  isViewMode,
  dialogTitle,
  openDialog,
  resetDialog,
} = useCrudDialog({
  form,
  createInitialForm,
  titles: { create: "新增组织", edit: "修改组织", view: "组织详情" },
  normalizeRecord: (organization) => ({
    ...organization,
    roles: [...(organization.roles || [])],
  }),
  clearValidate: () => formRef.value?.clearValidate(),
});
const handleSubmitOrganization = async () => {
  if (!(await formRef.value.validate())) return;
  submitting.value = true;
  try {
    if (dialogMode.value === "edit" && form.id) await updateOrganization(form.id, form);
    else await createOrganization(form);
    dialogVisible.value = false;
    await loadList();
    ElMessage.success(dialogMode.value === "edit" ? "组织修改成功" : "组织新增成功");
  } finally {
    submitting.value = false;
  }
};
const handleDeleteOrganization = async (organization) => {
  if (!(await confirmDelete(`确认删除组织“${organization.name}”吗？`))) return;
  await deleteOrganization(organization.id);
  await loadList();
  ElMessage.success("组织删除成功");
};

const handleSelectionChange = (rows) => {
  selectedRows.value = rows;
};

const handleBatchDelete = async () => {
  const confirmed = await confirmDelete(
    `确认删除选中的 ${selectedRows.value.length} 个组织吗？`
  );
  if (!confirmed) return;
  await Promise.all(
    selectedRows.value.map((organization) => deleteOrganization(organization.id))
  );
  tableRef.value?.clearSelection();
  await loadList();
  ElMessage.success("批量删除成功");
};

onMounted(loadList);
defineExpose({
  filters,
  loading,
  pagination,
  loadList,
  searchList,
  resetList,
  openCreateDialog: () => openDialog("create"),
});
</script>
