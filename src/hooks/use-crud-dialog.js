import { computed, nextTick, ref } from "vue";

/**
 * 管理新增、查看和修改共用弹窗的状态。
 * @param {{ form: Object, createInitialForm: () => Object, titles: Record<string, string>, normalizeRecord?: (record: Object) => Object, clearValidate?: () => void }} options 弹窗配置
 * @returns {{ dialogVisible: import("vue").Ref<boolean>, dialogMode: import("vue").Ref<string>, submitting: import("vue").Ref<boolean>, isViewMode: import("vue").ComputedRef<boolean>, dialogTitle: import("vue").ComputedRef<string>, openDialog: (mode: string, record?: Object) => void, resetDialog: () => void }} 弹窗状态与操作
 */
export const useCrudDialog = ({
  form,
  createInitialForm,
  titles,
  normalizeRecord,
  clearValidate,
}) => {
  const dialogVisible = ref(false);
  const dialogMode = ref("create");
  const submitting = ref(false);
  const isViewMode = computed(() => dialogMode.value === "view");
  const dialogTitle = computed(() => titles[dialogMode.value]);
  const resetForm = () => Object.assign(form, createInitialForm());

  const openDialog = (mode, record = {}) => {
    dialogMode.value = mode;
    resetForm();
    Object.assign(form, normalizeRecord ? normalizeRecord(record) : record);
    dialogVisible.value = true;
    nextTick(() => clearValidate?.());
  };

  const resetDialog = () => {
    clearValidate?.();
    resetForm();
    dialogMode.value = "create";
  };

  return {
    dialogVisible,
    dialogMode,
    submitting,
    isViewMode,
    dialogTitle,
    openDialog,
    resetDialog,
  };
};
