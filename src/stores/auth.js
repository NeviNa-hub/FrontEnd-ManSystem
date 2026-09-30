import { defineStore } from "pinia";
import Cookies from "js-cookie";

import { getSession, login as loginRequest } from "@/apis/auth";
import { TOKEN_KEY } from "@/utils/request";

// 认证状态管理
export const useAuthStore = defineStore("auth", {
  state: () => ({
    token: Cookies.get(TOKEN_KEY) || "",
    profile: null,
    initialized: false,
  }),
  getters: {
    isAuthenticated: (state) => Boolean(state.token && state.profile),
  },
  actions: {
    async login(credentials) {
      const payload = await loginRequest(credentials);
      if (!payload?.session) {
        throw new Error("登录接口未返回有效 Token");
      }
      this.token = payload.session;
      Cookies.set(TOKEN_KEY, payload.session, { sameSite: "Lax" });
      this.profile = payload.account || (await getSession());
      this.initialized = true;
    },

    async restoreSession() {
      if (!this.token) {
        this.clearSession();
        this.initialized = true;
        return false;
      }
      try {
        this.profile = await getSession();
        this.initialized = true;
        return true;
      } catch (error) {
        this.clearSession();
        this.initialized = true;
        throw error;
      }
    },

    clearSession() {
      this.token = "";
      this.profile = null;
      Cookies.remove(TOKEN_KEY);
    },

    logout() {
      this.clearSession();
    },
  },
});
