<template>
  <div class="blogs-list">
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
        <el-table-column prop="title" label="文章标题" min-width="280" />
        <el-table-column prop="author" label="作者" min-width="160" />
        <el-table-column prop="sort" label="排序" width="100" sortable="custom" />
        <el-table-column label="发布状态" width="140">
          <template #default="{ row }">
            <el-tag :type="row.status === '已发布' ? 'success' : 'info'" effect="plain"
              >{{ row.status }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createdAt" label="创建时间" min-width="180" sortable />
        <el-table-column label="操作" width="300" fixed="right">
          <template #default="{ row }">
            <el-button class="action-button action-button--view" link @click="openBlogDialog('view', row)">
              预览
            </el-button>
            <el-button class="action-button action-button--edit" link @click="openBlogDialog('edit', row)">
              修改
            </el-button>
            <el-button
              link
              :class="[
                'action-button',
                row.status === '已发布' ? 'action-button--deactivate' : 'action-button--activate',
              ]"
              :loading="actionLoadingId === row.id"
              @click="handlePublishToggle(row)"
            >
              {{ row.status === "已发布" ? "下架" : "发布" }}
            </el-button>
            <el-button class="action-button action-button--delete" link @click="handleDeleteBlog(row)">
              删除
            </el-button>
          </template>
        </el-table-column>
        <template #empty><el-empty description="暂无文章数据" /></template>
      </el-table>
      <div v-if="selectedRows.length" class="table-selection-actions">
        <span>已选 {{ selectedRows.length }} 项</span>
        <el-button type="danger" @click="handleBatchDelete">批删除</el-button>
      </div>
    </div>

    <BaseDialog
      :key="dialogMode"
      v-model="dialogVisible"
      :title="dialogTitle"
      :loading="submitting"
      :is-view="isViewMode"
      :show-confirm="!isViewMode"
      @confirm="handleSubmitBlog"
      @closed="resetDialog"
    >
      <el-form ref="formRef" :model="form" :rules="formRules" label-width="90px">
        <el-form-item label="文章标题" prop="title">
          <el-input
            v-model="form.title"
            :disabled="isViewMode"
            placeholder="请输入文章标题"
          />
        </el-form-item>
        <el-form-item label="作者" prop="author">
          <el-input
            v-model="form.author"
            :disabled="isViewMode"
            placeholder="请输入作者"
          />
        </el-form-item>
        <el-form-item label="博客内容" prop="content">
          <el-input
            v-model="form.content"
            :autosize="{ minRows: 5, maxRows: 10 }"
            :disabled="isViewMode"
            type="textarea"
          />
        </el-form-item>
        <el-form-item label="排序" prop="sort">
          <el-input-number
            v-model="form.sort"
            :disabled="isViewMode"
            :min="0"
            controls-position="right"
          />
        </el-form-item>
        <el-form-item label="发布状态" prop="status">
          <el-radio-group v-model="form.status" :disabled="isViewMode">
            <el-radio value="草稿">草稿</el-radio>
            <el-radio value="已发布">已发布</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item v-if="isViewMode" label="创建时间">
          <el-input :model-value="form.createdAt || '-'" disabled />
        </el-form-item>
      </el-form>
    </BaseDialog>
  </div>
</template>

<script setup>
import { onMounted, reactive, ref } from "vue";
import { ElMessage } from "element-plus";

import { createBlog, deleteBlog, getBlogs, updateBlog } from "@/apis/blogs";
import BaseDialog from "@/components/BaseDialog/BaseDialog.vue";
import { useCrudDialog } from "@/hooks/use-crud-dialog";
import { useList } from "@/hooks/use-list";
import { confirmAction, confirmDelete } from "@/utils/confirm-dialog";

const props = defineProps({ pagination: { type: Object, required: true } });
const DIALOG_TITLES = {
  create: "新增文章",
  edit: "修改文章",
  view: "文章详情",
};
const { filters, items, loading, pagination, loadList, searchList, resetList } = useList({
  pagination: props.pagination,
  createInitialFilters: () => ({ title: "", author: "", createdAtRange: [] }),
  getList: getBlogs,
  buildParams: (currentFilters, currentPagination) => ({
    title: currentFilters.title,
    author: currentFilters.author,
    createdAtStart: currentFilters.createdAtRange[0],
    createdAtEnd: currentFilters.createdAtRange[1],
    page: currentPagination.page,
    pageSize: currentPagination.pageSize,
  }),
});
const formRef = ref();
const tableRef = ref();
const selectedRows = ref([]);
const actionLoadingId = ref(null);
const formRules = {
  title: [{ required: true, message: "请输入文章标题", trigger: "blur" }],
  author: [{ required: true, message: "请输入作者", trigger: "blur" }],
  content: [{ required: false, message: "请输入博客内容", trigger: "blur" }],//非必填，自行输入，Markdown格式
  sort: [{ required: true, message: "请输入排序", trigger: "change" }],
  status: [{ required: true, message: "请选择发布状态", trigger: "change" }],
};
const createInitialForm = () => ({
  id: null,
  title: "",
  author: "",
  content: "",
  sort: 0,
  status: "草稿",
  createdAt: "",
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
  titles: DIALOG_TITLES,
  clearValidate: () => formRef.value?.clearValidate(),
});

const openBlogDialog = (mode, blog) => {
  openDialog(mode, blog);
};

const handleSubmitBlog = async () => {
  if (!(await formRef.value.validate())) return;
  submitting.value = true;
  try {
    if (dialogMode.value === "edit" && form.id) await updateBlog(form.id, form);
    else await createBlog(form);
    dialogVisible.value = false;
    await loadList();
    ElMessage.success(dialogMode.value === "edit" ? "文章修改成功" : "文章新增成功");
  } finally {
    submitting.value = false;
  }
};
const handleDeleteBlog = async (blog) => {
  if (!(await confirmDelete(`确认删除文章“${blog.title}”吗？`))) return;
  await deleteBlog(blog.id);
  await loadList();
  ElMessage.success("文章删除成功");
};

const handleSelectionChange = (rows) => {
  selectedRows.value = rows;
};

const handleBatchDelete = async () => {
  const confirmed = await confirmDelete(
    `确认删除选中的 ${selectedRows.value.length} 篇文章吗？`
  );
  if (!confirmed) return;
  await Promise.all(selectedRows.value.map((blog) => deleteBlog(blog.id)));
  tableRef.value?.clearSelection();
  await loadList();
  ElMessage.success("批量删除成功");
};
const handlePublishToggle = async (blog) => {
  const isPublished = blog.status === "已发布";
  const nextStatus = isPublished ? "草稿" : "已发布";
  const actionText = isPublished ? "下架" : "发布";
  if (
    !(await confirmAction(
      `确认${actionText}文章“${blog.title}”吗？`,
      `${actionText}确认`
    ))
  )
    return;
  actionLoadingId.value = blog.id;
  try {
    await updateBlog(blog.id, { status: nextStatus });
    await loadList();
    ElMessage.success(`文章${actionText}成功`);
  } finally {
    actionLoadingId.value = null;
  }
};

onMounted(loadList);
defineExpose({
  filters,
  loading,
  pagination,
  loadList,
  searchList,
  resetList,
  openCreateDialog: () => openBlogDialog("create"),
});
</script>
