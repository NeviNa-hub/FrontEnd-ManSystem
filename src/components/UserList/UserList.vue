<template>
  <div class="users-list">
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
        <el-table-column prop="username" label="用户名" min-width="220" />
        <el-table-column prop="organization" label="所属组织" min-width="220" />
        <el-table-column :label="isAdmin ? '管理员权限' : '角色'" min-width="160">
          <template #default="{ row }">
            <el-tag
              :class="['role-tag', ROLE_TAG_CLASS_MAP[row.role]]"
              size="small"
              effect="plain"
            >
              {{ row.role }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column v-if="isAdmin" label="账号状态" width="120">
          <template #default="{ row }">
            <el-tag :type="row.status === '启用' ? 'success' : 'info'" effect="plain">
              {{ row.status || "启用" }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="joinedAt" label="加入时间" min-width="180" sortable />
        <el-table-column label="操作" :width="isAdmin ? 280 : 200" fixed="right">
          <template #default="{ row }">
            <el-button class="action-button action-button--view" link @click="openDialog('view', row)">
              查看
            </el-button>
            <el-button class="action-button action-button--edit" link @click="openDialog('edit', row)">
              修改
            </el-button>
            <el-button
              v-if="isAdmin"
              :class="[
                'action-button',
                row.status === '停用' ? 'action-button--activate' : 'action-button--deactivate',
              ]"
              link
              @click="handleAccountStatus(row)"
            >
              {{ row.status === "停用" ? "启用" : "停用" }}
            </el-button>
            <el-button class="action-button action-button--delete" link @click="handleDeleteUser(row)">
              删除
            </el-button>
          </template>
        </el-table-column>
        <template #empty><el-empty description="暂无用户数据" /></template>
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
      :show-confirm="dialogMode !== 'view'"
      @confirm="handleSubmitUser"
      @closed="resetDialog"
    >
      <el-form ref="formRef" :model="form" :rules="formRules" label-width="90px">
        <el-form-item label="用户名" prop="username">
          <el-input
            v-model="form.username"
            :disabled="isViewMode"
            placeholder="请输入用户名"
          />
        </el-form-item>
        <el-form-item label="所属组织" prop="organization">
          <el-input
            v-model="form.organization"
            :disabled="isViewMode"
            placeholder="请输入所属组织"
          />
        </el-form-item>
        <el-form-item label="角色" prop="role">
          <el-select v-model="form.role" :disabled="isViewMode" placeholder="请选择角色">
            <el-option
              v-for="role in roleOptions"
              :key="role"
              :label="role"
              :value="role"
            />
          </el-select>
        </el-form-item>
        <el-form-item v-if="isAdmin" label="账号状态" prop="status">
          <el-radio-group v-model="form.status" :disabled="isViewMode">
            <el-radio value="启用">启用</el-radio>
            <el-radio value="停用">停用</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item v-if="isViewMode" label="加入时间">
          <el-input :model-value="form.joinedAt || '-'" disabled />
        </el-form-item>
      </el-form>
    </BaseDialog>
  </div>
</template>

<script setup>
import { onMounted, reactive, ref } from "vue";
import { ElMessage } from "element-plus";

import { createUser, deleteUser, getUsers, updateUser } from "@/apis/users";
import BaseDialog from "@/components/BaseDialog/BaseDialog.vue";
import { ROLE_OPTIONS, ROLE_TAG_CLASS_MAP } from "@/config/options";
import { useCrudDialog } from "@/hooks/use-crud-dialog";
import { useList } from "@/hooks/use-list";
import { confirmAction, confirmDelete } from "@/utils/confirm-dialog";

const props = defineProps({
  pagination: { type: Object, required: true },
  isAdmin: { type: Boolean, default: false },
});
const ADMIN_ROLE_OPTIONS = ["超级管理员", "普通管理员"];

const { filters, items, loading, pagination, loadList, searchList, resetList } = useList({
  pagination: props.pagination,
  createInitialFilters: () => ({ username: "", joinedAtRange: [] }),
  getList: getUsers,
  buildParams: (currentFilters, currentPagination) => ({
    username: currentFilters.username,
    joinedAtStart: currentFilters.joinedAtRange[0],
    joinedAtEnd: currentFilters.joinedAtRange[1],
    page: currentPagination.page,
    pageSize: currentPagination.pageSize,
  }),
});

const formRef = ref();
const tableRef = ref();
const selectedRows = ref([]);
const formRules = {
  username: [{ required: true, message: "请输入用户名", trigger: "blur" }],
  organization: [{ required: true, message: "请输入所属组织", trigger: "blur" }],
  role: [{ required: true, message: "请选择角色", trigger: "change" }],
};

const createInitialForm = () => ({
  id: null,
  username: "",
  organization: props.isAdmin ? "HollyGlobe" : "",
  role: "",
  status: "启用",
  joinedAt: "",
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
  titles: {
    create: props.isAdmin ? "新增公司管理员" : "新增用户",
    edit: props.isAdmin ? "修改公司管理员" : "修改用户",
    view: props.isAdmin ? "公司管理员详情" : "用户详情",
  },
  clearValidate: () => formRef.value?.clearValidate(),
});

const handleSubmitUser = async () => {
  if (!(await formRef.value.validate())) return;

  submitting.value = true;
  try {
    if (dialogMode.value === "edit" && form.id) {
      await updateUser(form.id, {
        ...form,
        organization: props.isAdmin ? "HollyGlobe" : form.organization,
      });
    } else {
      await createUser({
        ...form,
        organization: props.isAdmin ? "HollyGlobe" : form.organization,
      });
    }
    dialogVisible.value = false;
    await loadList();
    ElMessage.success(
      dialogMode.value === "edit"
        ? props.isAdmin
          ? "公司管理员修改成功"
          : "用户修改成功"
        : props.isAdmin
        ? "公司管理员新增成功"
        : "用户新增成功"
    );
  } finally {
    submitting.value = false;
  }
};

const handleDeleteUser = async (user) => {
  try {
    const confirmed = await confirmDelete(`确认删除用户“${user.username}”吗？`);
    if (!confirmed) return;
    await deleteUser(user.id);
    await loadList();
    ElMessage.success(props.isAdmin ? "公司管理员删除成功" : "用户删除成功");
  } catch (error) {
    if (error !== "cancel" && error !== "close") throw error;
  }
};

const handleSelectionChange = (rows) => {
  selectedRows.value = rows;
};

const handleBatchDelete = async () => {
  const confirmed = await confirmDelete(
    `确认删除选中的 ${selectedRows.value.length} 名用户吗？`
  );
  if (!confirmed) return;
  await Promise.all(selectedRows.value.map((user) => deleteUser(user.id)));
  tableRef.value?.clearSelection();
  await loadList();
  ElMessage.success("批量删除成功");
};
const roleOptions = props.isAdmin ? ADMIN_ROLE_OPTIONS : ROLE_OPTIONS;

const handleAccountStatus = async (user) => {
  const nextStatus = user.status === "停用" ? "启用" : "停用";
  const confirmed = await confirmAction(
    `确认${nextStatus}公司管理员“${user.username}”吗？`,
    `${nextStatus}确认`
  );
  if (!confirmed) return;
  await updateUser(user.id, { status: nextStatus });
  await loadList();
  ElMessage.success(`公司管理员已${nextStatus}`);
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
