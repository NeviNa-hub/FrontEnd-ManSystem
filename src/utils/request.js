import axios from "axios";
import Cookies from "js-cookie";

const TOKEN_KEY = "hollygloba_token";

// 创建 Axios 实例
const request = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "/api",
  timeout: 15000,
});

// 请求拦截器
request.interceptors.request.use((config) => {
  const token = Cookies.get(TOKEN_KEY);

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// 响应拦截器
request.interceptors.response.use(
  (response) => {
    const payload = response.data;

    if (payload && typeof payload === "object" && "code" in payload) {
      if (payload.code !== 0 && payload.code !== 200) {
        return Promise.reject(new Error(payload.message || "请求失败"));
      }

      return payload.data;
    }

    return payload;
  },
  (error) => {
    const message =
      error.response?.data?.message || error.message || "网络请求失败";
    return Promise.reject(new Error(message));
  },
);

export { TOKEN_KEY };
export default request;
