<template>
  <section class="business-page points-page">
    <div class="page-heading">
      <div>
        <h1>积分充值</h1>
        <p>为用户充值算力积分或媒体积分</p>
      </div>
    </div>
    <el-button class="recharge-trigger" type="primary" @click="openRechargeDialog">
      积分充值
    </el-button>
    <BaseDialog
      v-model="rechargeVisible"
      title="充值信息"
      width="640"
      :loading="submitting"
      confirm-text="确认充值"
      @confirm="handleRecharge"
      @closed="resetForm"
    >
      <template #header><span class="card-title">充值信息</span></template>
      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        label-width="110px"
        class="recharge-form"
      >
        <el-form-item label="手机号" prop="phone">
          <el-input v-model="form.phone" clearable placeholder="请输入用户手机号" />
        </el-form-item>
        <el-form-item label="算力积分" prop="computePoints">
          <el-input
            v-model="form.computePoints"
            clearable
            placeholder="非必填，自行输入"
          />
        </el-form-item>
        <el-form-item label="媒体积分" prop="mediaPoints">
          <el-input v-model="form.mediaPoints" clearable placeholder="非必填，自行输入" />
        </el-form-item>
      </el-form>
    </BaseDialog>
    <el-card class="records-card list-panel">
      <template #header><span class="card-title">已充值记录</span></template>
      <div class="data-table">
        <el-table v-loading="loading" :data="records" height="100%" stripe>
          <el-table-column prop="phone" label="手机号" min-width="180" />
          <el-table-column prop="computePoints" label="算力积分" min-width="140" />
          <el-table-column prop="mediaPoints" label="媒体积分" min-width="140" />
          <el-table-column prop="createdAt" label="充值时间" min-width="190" sortable />
          <el-table-column label="操作" width="140" fixed="right">
            <template #default="{ row }">
              <el-button class="action-button action-button--flow" link @click="showFlows(row)">
                查看流水
              </el-button>
            </template>
          </el-table-column>
          <template #empty><el-empty description="暂无充值记录" /></template>
        </el-table>
      </div>
      <BasePagination :pagination="pagination" @handle-fn="handlePage" />
    </el-card>
    <BaseDialog
      v-model="detailVisible"
      title="积分流水详情"
      width="760"
      :show-confirm="false"
    >
      <el-descriptions :column="2" border class="detail-summary">
        <el-descriptions-item label="手机号">{{
          detailRecord?.phone
        }}</el-descriptions-item>
        <el-descriptions-item label="充值时间">{{
          detailRecord?.createdAt
        }}</el-descriptions-item>
      </el-descriptions>
      <el-table :data="detailRecord?.flows || []" stripe>
        <el-table-column prop="type" label="积分类型" />
        <el-table-column prop="amount" label="变动数量" />
        <el-table-column prop="balance" label="变动后余额" />
        <el-table-column prop="remark" label="备注" />
        <el-table-column prop="createdAt" label="时间" sortable />
      </el-table>
    </BaseDialog>
  </section>
</template>

<script setup>
import { onMounted, reactive, ref } from "vue";
import { ElMessage } from "element-plus";

import { createRecharge, getRechargeRecords } from "@/apis/points";
import BaseDialog from "@/components/BaseDialog/BaseDialog.vue";
import BasePagination from "@/components/BasePagination/BasePagination.vue";

const formRef = ref();
const form = reactive({ phone: "", computePoints: "", mediaPoints: "" });
const validatePoints = (_rule, value, callback) => {
  if (value !== "" && (!/^\d+(\.\d+)?$/.test(String(value)) || Number(value) <= 0)) {
    callback(new Error("请输入大于 0 的数字"));
  } else {
    callback();
  }
};
const rules = {
  phone: [
    { required: true, message: "请输入手机号", trigger: "blur" },
    { pattern: /^1\d{10}$/, message: "请输入正确的手机号", trigger: "blur" },
  ],
  computePoints: [{ validator: validatePoints, trigger: "blur" }],
  mediaPoints: [{ validator: validatePoints, trigger: "blur" }],
};
const records = ref([]);
const loading = ref(false);
const submitting = ref(false);
const rechargeVisible = ref(false);
const detailVisible = ref(false);
const detailRecord = ref(null);
const pagination = reactive({ page: 1, pageSize: 10, total: 0 });

const loadRecords = async () => {
  loading.value = true;
  try {
    const result = await getRechargeRecords({
      page: pagination.page,
      pageSize: pagination.pageSize,
    });
    records.value = result.items;
    pagination.total = result.total;
  } finally {
    loading.value = false;
  }
};
const handleRecharge = async () => {
  if (!(await formRef.value.validate())) return;
  if (!form.computePoints && !form.mediaPoints) {
    ElMessage.warning("算力积分和媒体积分至少填写一项");
    return;
  }
  submitting.value = true;
  try {
    await createRecharge({ ...form });
    ElMessage.success("充值成功");
    rechargeVisible.value = false;
    resetForm();
    pagination.page = 1;
    await loadRecords();
  } finally {
    submitting.value = false;
  }
};
const resetForm = () => {
  formRef.value?.resetFields();
};
const showFlows = (record) => {
  detailRecord.value = record;
  detailVisible.value = true;
};
const openRechargeDialog = () => {
  rechargeVisible.value = true;
};
const handlePage = ({ page, page_size: pageSize }) => {
  pagination.page = page;
  if (pageSize) pagination.pageSize = pageSize;
  return loadRecords();
};

onMounted(loadRecords);
</script>

<style lang="scss" scoped>
.points-page {
  gap: 0;
  overflow: hidden;
}
.recharge-trigger {
  align-self: flex-end;
  margin-top: -58px;
  margin-bottom: 20px;
}
.card-title {
  color: #283044;
  font-size: 16px;
  font-weight: 600;
}
.recharge-form {
  padding: 8px 0 0;
}
.recharge-form :deep(.el-input) {
  width: 360px;
}
.records-card {
  min-height: 0;
  flex: 1;
}
.records-card :deep(.el-card__body) {
  display: flex;
  min-height: 0;
  flex: 1;
  flex-direction: column;
  padding: 0;
}
.records-card :deep(.el-card__header) {
  flex-shrink: 0;
}
.data-table {
  min-height: 0;
  flex: 1;
  overflow: hidden;
}
.data-table :deep(.el-table__body-wrapper) {
  overflow-y: auto;
}
.data-table :deep(.el-table__body-wrapper::-webkit-scrollbar) {
  width: 8px;
}
.data-table :deep(.el-table__body-wrapper::-webkit-scrollbar-thumb) {
  border-radius: 4px;
  background: #c6cad3;
}
.data-table :deep(.el-table__body-wrapper::-webkit-scrollbar-track) {
  background: #f3f4f6;
}
.records-card :deep(.base-pagination) {
  flex-shrink: 0;
}
.detail-summary {
  margin-bottom: 20px;
}
</style>
