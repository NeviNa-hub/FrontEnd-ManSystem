import Cookies from "js-cookie";

import request from "@/utils/request";
import { TOKEN_KEY } from "@/utils/request";

// 仅显式配置 VITE_USE_MOCK=false 时走真实后端，未配置默认本地 Mock。
const USE_MOCK = import.meta.env.VITE_USE_MOCK !== "false";

let mockServicePromise;

// 懒加载演示服务，Mock 代码不进入真实模式打包路径。
const loadMockService = () => {
  if (!mockServicePromise) {
    mockServicePromise = import("@/mock/service");
  }

  return mockServicePromise;
};

const dispatch = async (method, url, data) => {
  if (!USE_MOCK) {
    return request({ method, url, data });
  }

  const service = await loadMockService();
  const headers = { "X-Demo-Session": Cookies.get(TOKEN_KEY) || "" };
  const payload = await service.handleRequest({ method, url, data, headers });

  if (payload.code !== 0) {
    throw new Error(payload.message || "请求失败");
  }

  return payload.data;
};

/**
 * Demo 客户端：API 统一入口，Mock 开关见 .env.example。
 */
export const client = {
  /**
   * 发起 GET 请求，resolve 为响应 data。
   * @param {string} url 请求路径
   * @returns {Promise<any>} 响应 data
   */
  get: (url, params) => dispatch("get", url, params),

  /**
   * 发起 POST 请求，resolve 为响应 data。
   * @param {string} url 请求路径
   * @param {any} data 请求体
   * @returns {Promise<any>} 响应 data
   */
  post: (url, data) => dispatch("post", url, data),
  put: (url, data) => dispatch("put", url, data),
  delete: (url, data) => dispatch("delete", url, data),
};
