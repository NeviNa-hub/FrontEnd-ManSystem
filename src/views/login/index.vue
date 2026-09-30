<template>
  <main class="login-page">
    <div class="grid-background"></div>
    <div class="ambient-light ambient-light--top"></div>
    <div class="ambient-light ambient-light--right"></div>
    <div class="ambient-light ambient-light--left"></div>

    <header class="brand-header">
      <div class="brand-block">
        <span class="brand-mark">H</span>
        <span class="brand-name">Hollyglobe</span>
        <span class="brand-badge">ENTERPRISE</span>
      </div>
      <div class="header-support">
        <span class="support-language">简体中文 <ArrowDown /></span>
        <span class="support-help"><QuestionFilled /> 帮助中心</span>
      </div>
    </header>

    <section class="login-main">
      <div class="security-badge">
        <span class="security-pulse"></span>
        Hollyglobe ID · 企业统一身份认证中心
      </div>

      <section class="auth-card">
        <aside class="visual-panel">
          <div class="panel-glow panel-glow--top"></div>
          <div class="panel-glow panel-glow--bottom"></div>
          <div class="workspace-brand">
            <span class="workspace-mark">H</span>
            Hollyglobe Workspace
          </div>

          <div class="visual-content">
            <div class="globe-icon">◎</div>
            <h2>欢迎来到 Hollyglobe</h2>
            <p>连接全球企业智能与协同</p>
            <div class="feature-list">
              <span><CircleCheck /> 企业级统一身份认证</span>
              <span><CircleCheck /> 安全可靠的数据协作</span>
            </div>
          </div>

          <div class="security-note"><Key /> 企业级合规与数据安全保障</div>
        </aside>

        <section class="form-panel">
          <div class="form-heading">
            <h1>登录</h1>
            <p>请输入您的账号信息以访问管理系统</p>
          </div>
          <el-form
            ref="formRef"
            class="login-form"
            :model="form"
            :rules="rules"
            @submit.prevent="handleSubmit"
          >
            <el-form-item label="企业账号" prop="username">
              <el-input
                v-model="form.username"
                size="large"
                placeholder="请输入账号"
                :prefix-icon="User"
                autocomplete="username"
              />
            </el-form-item>
            <el-form-item label="登录密码" prop="password">
              <el-input
                v-model="form.password"
                size="large"
                type="password"
                show-password
                placeholder="请输入密码"
                :prefix-icon="Lock"
                autocomplete="current-password"
                @keyup.enter="handleSubmit"
              />
            </el-form-item>
            <el-button
              class="submit-button"
              type="primary"
              size="large"
              :loading="submitting"
              native-type="submit"
            >
              登录
            </el-button>
          </el-form>
          <p class="form-security-tip"><Lock /> 登录信息将通过加密通道安全传输</p>
        </section>
      </section>
    </section>

    <footer class="security-footer">
      <span><CircleCheck /> 企业级身份与权限保护</span>
      <span class="footer-divider"></span>
      <span><Lock /> 端到端 TLS 加密传输</span>
      <small>© 2026 Hollyglobe Technologies</small>
    </footer>
  </main>
</template>

<script setup>
import { reactive, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { ElMessage } from "element-plus";
import { ArrowDown, CircleCheck, Key, Lock, QuestionFilled, User } from "@element-plus/icons-vue";

import { useAuthStore } from "@/stores/auth";

const router = useRouter();
const route = useRoute();
const authStore = useAuthStore();
const formRef = ref();
const submitting = ref(false);
const form = reactive({ username: "", password: "" });
const rules = {
  username: [{ required: true, message: "请输入账号", trigger: "blur" }],
  password: [
    { required: true, message: "请输入密码", trigger: "blur" },
    { min: 1, message: "密码至少 1 位", trigger: "blur" },
  ],
};

// 获取安全的登录后跳转地址。
const getRedirectPath = () => {
  const redirect = typeof route.query.redirect === "string" ? route.query.redirect : "/";
  return redirect.startsWith("/") && !redirect.startsWith("//") ? redirect : "/";
};

// 提交登录表单。
const handleSubmit = async () => {
  const valid = await formRef.value.validate().catch(() => false);
  if (!valid) return;

  submitting.value = true;
  try {
    authStore.clearSession();
    await authStore.login(form);
    ElMessage.success("登录成功");
    await router.replace(getRedirectPath());
  } catch (error) {
    ElMessage.error(error.message || "登录失败，请稍后重试");
  } finally {
    submitting.value = false;
  }
};
</script>

<style lang="scss" scoped>
.login-page {
  position: relative;
  display: flex;
  width: 100%;
  min-width: 1440px;
  height: 100dvh;
  min-height: 760px;
  flex-direction: column;
  overflow: hidden;
  color: #27364b;
  background: #f8fbff;
}

.grid-background {
  position: absolute;
  inset: 0;
  opacity: 0.55;
  background-image: radial-gradient(rgb(14 165 233 / 16%) 1px, transparent 1px);
  background-size: 24px 24px;
}

.ambient-light {
  position: absolute;
  pointer-events: none;
  filter: blur(80px);

  &--top {
    top: -260px;
    left: calc(50% - 450px);
    width: 900px;
    height: 500px;
    border-radius: 50%;
    background: rgb(186 230 253 / 58%);
  }

  &--right {
    top: 28%;
    right: -200px;
    width: 480px;
    height: 480px;
    border-radius: 50%;
    background: rgb(186 230 253 / 48%);
  }

  &--left {
    bottom: -200px;
    left: -130px;
    width: 400px;
    height: 400px;
    border-radius: 50%;
    background: rgb(165 243 252 / 40%);
  }
}

.brand-header,
.security-footer,
.login-main {
  position: relative;
  z-index: 1;
}

.brand-header {
  display: flex;
  height: 66px;
  padding: 0 7.5%;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid rgb(186 230 253 / 66%);
  background: rgb(255 255 255 / 68%);
  backdrop-filter: blur(14px);
}

.brand-block,
.header-support,
.support-language,
.support-help,
.workspace-brand,
.security-note,
.security-footer,
.security-footer span,
.form-security-tip {
  display: flex;
  align-items: center;
}

.brand-block {
  gap: 10px;
}

.brand-mark,
.workspace-mark {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  background: linear-gradient(135deg, #0284c7, #22d3ee);
  font-weight: 750;
}

.brand-mark {
  width: 32px;
  height: 32px;
  border-radius: 10px;
  box-shadow: 0 5px 14px rgb(14 165 233 / 24%);
}

.brand-name {
  color: #172033;
  font-size: 20px;
  font-weight: 750;
  letter-spacing: -0.5px;
}

.brand-badge {
  padding: 3px 8px;
  border: 1px solid #c8e9fa;
  border-radius: 999px;
  color: #0580bc;
  background: #f0faff;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.8px;
}

.header-support {
  gap: 20px;
  color: #64748b;
  font-size: 12px;
}

.support-language {
  gap: 4px;
  padding: 6px 10px;
  border: 1px solid #dce7f0;
  border-radius: 7px;
  background: rgb(255 255 255 / 85%);

  svg {
    width: 13px;
  }
}

.support-help {
  gap: 5px;

  svg {
    width: 15px;
    color: #0ea5e9;
  }
}

.login-main {
  display: flex;
  flex: 1;
  min-height: 0;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 36px 24px;
}

.security-badge {
  display: flex;
  gap: 9px;
  margin-bottom: 20px;
  padding: 7px 13px;
  align-items: center;
  border: 1px solid #d7edf8;
  border-radius: 999px;
  color: #607087;
  background: rgb(255 255 255 / 78%);
  box-shadow: 0 4px 12px rgb(14 165 233 / 7%);
  font-size: 12px;
}

.security-pulse {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #0ea5e9;
  box-shadow: 0 0 0 4px rgb(14 165 233 / 15%);
}

.auth-card {
  display: flex;
  width: 860px;
  min-height: 470px;
  overflow: hidden;
  border: 1px solid rgb(186 230 253 / 82%);
  border-radius: 24px;
  background: rgb(255 255 255 / 88%);
  box-shadow: 0 22px 52px -18px rgb(14 165 233 / 19%);
  backdrop-filter: blur(20px);
}

.visual-panel {
  position: relative;
  display: flex;
  width: 41%;
  padding: 34px;
  flex-direction: column;
  overflow: hidden;
  color: #334155;
  background: linear-gradient(145deg, rgb(224 242 254 / 80%), rgb(236 254 255 / 72%));
  border-right: 1px solid rgb(186 230 253 / 72%);
}

.panel-glow {
  position: absolute;
  width: 180px;
  height: 180px;
  border-radius: 50%;
  pointer-events: none;
  filter: blur(25px);

  &--top {
    top: -72px;
    left: -72px;
    background: rgb(125 211 252 / 35%);
  }

  &--bottom {
    right: -62px;
    bottom: -50px;
    background: rgb(103 232 249 / 28%);
  }
}

.workspace-brand,
.security-note {
  position: relative;
  z-index: 1;
  gap: 8px;
  color: #1e3a5f;
  font-size: 14px;
  font-weight: 700;
}

.workspace-mark {
  width: 26px;
  height: 26px;
  border-radius: 8px;
  font-size: 13px;
}

.visual-content {
  position: relative;
  z-index: 1;
  margin: auto 0;

  h2 {
    margin: 0 0 8px;
    color: #152b46;
    font-size: 25px;
    letter-spacing: -0.7px;
  }

  p {
    margin: 0 0 26px;
    color: #5b7089;
    font-size: 14px;
  }
}

.globe-icon {
  display: flex;
  width: 54px;
  height: 54px;
  margin-bottom: 23px;
  align-items: center;
  justify-content: center;
  border: 1px solid rgb(255 255 255 / 70%);
  border-radius: 17px;
  color: #078bcb;
  background: rgb(255 255 255 / 72%);
  box-shadow: 0 8px 18px rgb(14 165 233 / 16%);
  font-size: 32px;
}

.feature-list {
  display: grid;
  gap: 9px;

  span {
    display: flex;
    width: fit-content;
    gap: 7px;
    padding: 7px 10px;
    align-items: center;
    border: 1px solid rgb(186 230 253 / 78%);
    border-radius: 8px;
    color: #52677f;
    background: rgb(255 255 255 / 62%);
    font-size: 12px;
  }

  svg,
  .security-note svg {
    width: 15px;
    color: #0ea5e9;
  }
}

.security-note {
  padding-top: 18px;
  border-top: 1px solid rgb(186 230 253 / 74%);
  color: #61758c;
  font-size: 12px;
  font-weight: 500;

  svg {
    width: 15px;
    color: #0ea5e9;
  }
}

.form-panel {
  display: flex;
  width: 59%;
  padding: 52px 64px 38px;
  flex-direction: column;
  justify-content: center;
  background: rgb(255 255 255 / 92%);
}

.form-heading {
  margin-bottom: 29px;

  h1 {
    margin: 0 0 5px;
    color: #172033;
    font-size: 25px;
    letter-spacing: -0.6px;
  }

  p {
    margin: 0;
    color: #8895a7;
    font-size: 12px;
  }
}

.login-form {
  :deep(.el-form-item) {
    margin-bottom: 18px;
  }

  :deep(.el-form-item__label) {
    padding-bottom: 6px;
    color: #405168;
    font-size: 12px;
    font-weight: 600;
    line-height: 1;
  }

  :deep(.el-input__wrapper) {
    min-height: 44px;
    padding: 0 13px;
    border-radius: 10px;
    background: #f8fafc;
    box-shadow: 0 0 0 1px #dce4ed inset;

    &:hover {
      box-shadow: 0 0 0 1px #a9d9f2 inset;
    }

    &.is-focus {
      background: #fff;
      box-shadow: 0 0 0 2px rgb(14 165 233 / 18%);
    }
  }

  :deep(.el-input__prefix-inner) {
    color: #8ca2b8;
  }
}

.submit-button {
  width: 100%;
  height: 44px;
  margin-top: 8px;
  border: none;
  border-radius: 10px;
  background: linear-gradient(135deg, #20b6ed 0%, #098fcf 100%);
  box-shadow: 0 8px 18px rgb(14 165 233 / 26%);
  font-weight: 600;

  &:hover {
    background: linear-gradient(135deg, #12a9e0 0%, #057dbb 100%);
    box-shadow: 0 10px 22px rgb(14 165 233 / 34%);
  }
}

.form-security-tip {
  gap: 5px;
  margin: 17px 0 0;
  justify-content: center;
  color: #99a5b4;
  font-size: 11px;

  svg {
    width: 13px;
    color: #72bddd;
  }
}

.security-footer {
  min-height: 54px;
  padding: 0 7.5%;
  gap: 15px;
  border-top: 1px solid rgb(186 230 253 / 60%);
  color: #7b8da2;
  background: rgb(255 255 255 / 42%);
  font-size: 11px;

  span {
    gap: 5px;

    svg {
      width: 14px;
      color: #0ea5e9;
    }
  }

  small {
    margin-left: auto;
    font-size: 11px;
  }
}

.footer-divider {
  width: 1px;
  height: 13px;
  background: #d6e1ea;
}
</style>
