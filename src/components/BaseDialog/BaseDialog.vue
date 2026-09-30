<template>
  <!-- 公共弹窗组件 -->
  <el-dialog
    :class="['base-dialog', { 'is-view-dialog': isView }]"
    :model-value="modelValue"
    :width="width"
    align-center
    :show-close="false"
    :close-on-click-modal="false"
    @update:model-value="emit('update:modelValue', $event)"
    @closed="emit('closed')"
  >
    <template #header>
      <div class="dialog-header">
        <span class="dialog-title">{{ title }}</span>
      </div>
    </template>

    <div class="dialog-content"><slot /></div>

    <template #footer>
      <span class="dialog-footer">
        <el-button :disabled="loading" @click="emit('update:modelValue', false)">
          {{ isView ? "关闭" : cancelText }}
        </el-button>
        <el-button
          v-if="showConfirm"
          type="primary"
          :loading="loading"
          @click="emit('confirm')"
        >
          {{ confirmText }}
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
/**
 * 对话框属性。
 * @property {boolean} modelValue 控制对话框显示状态
 * @property {string} title 对话框标题
 * @property {string|number} width 对话框宽度
 * @property {boolean} loading 控制提交按钮加载状态
 * @property {boolean} showConfirm 是否显示确认按钮
 * @property {string} confirmText 确认按钮文案
 * @property {string} cancelText 取消按钮文案
 */
defineProps({
  modelValue: { type: Boolean, default: false },
  title: { type: String, required: true },
  width: { type: [String, Number], default: 640 },
  loading: { type: Boolean, default: false },
  isView: { type: Boolean, default: false },
  showConfirm: { type: Boolean, default: true },
  confirmText: { type: String, default: "确定" },
  cancelText: { type: String, default: "取消" },
});

const emit = defineEmits(["update:modelValue", "confirm", "closed"]);
</script>

<style lang="scss" scoped>

.base-dialog {
  :deep(.el-dialog__header) {
    margin: 0;
    padding: 0;
  }

  :deep(.el-dialog__body) {
    padding: 0;
  }

  :deep(.el-dialog__footer) {
    padding-top: 0px;
  }

  :deep(.el-select),
  :deep(.el-input-number) {
    width: 100%;
  }
}

.base-dialog.is-view-dialog {
  :deep(.el-dialog__body) {
    background: linear-gradient(180deg, #faf9ff 0%, #fff 100%);
  }

  :deep(.el-form-item__label) {
    color: #697187;
    font-weight: 550;
  }

  :deep(.el-input.is-disabled .el-input__wrapper),
  :deep(.el-select.is-disabled .el-select__wrapper),
  :deep(.el-textarea.is-disabled .el-textarea__inner),
  :deep(.el-input-number.is-disabled) {
    border-color: #e1ddf5;
    background: #f7f6fc;
    box-shadow: 0 0 0 1px #e1ddf5 inset;
  }

  :deep(.el-input.is-disabled .el-input__inner),
  :deep(.el-select.is-disabled .el-select__selected-item),
  :deep(.el-textarea.is-disabled .el-textarea__inner),
  :deep(.el-input-number.is-disabled .el-input__inner) {
    color: #3f475a;
    -webkit-text-fill-color: #3f475a;
  }

  :deep(.el-select.is-disabled .el-select__caret),
  :deep(.el-input-number.is-disabled .el-input-number__decrease),
  :deep(.el-input-number.is-disabled .el-input-number__increase) {
    color: #8b81ca;
  }

  :deep(.el-radio.is-disabled) {
    color: #727b90;
  }

  :deep(.el-radio.is-disabled.is-checked .el-radio__inner) {
    border-color: var(--primary);
    background: var(--primary);
  }

  :deep(.el-radio.is-disabled.is-checked .el-radio__label) {
    color: #6554c5;
  }
}

.dialog-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  // padding: 0;
  padding-bottom: 16px;
  border-bottom: 1px solid var(--border);
}

.is-view-dialog .dialog-header {
  position: relative;
  padding-left: 14px;

  &::before {
    position: absolute;
    top: 3px;
    bottom: 19px;
    left: 0;
    width: 4px;
    border-radius: 4px;
    background: linear-gradient(180deg, #9d91e5 0%, var(--primary) 100%);
    content: "";
  }
}

.dialog-title {
  color: #202735;
  font-size: 18px;
  font-weight: 600;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding-top: 16px;
  border-top: 1px solid var(--border);
}

.dialog-content :deep(.el-form-item) {
  margin-bottom: 16px;
}

.dialog-content :deep(.el-form-item:last-child) {
  margin-bottom: 0;
}
</style>
