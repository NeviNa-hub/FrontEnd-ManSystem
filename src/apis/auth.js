import { client } from "@/apis/demo/client";

/**
 * 登录：Mock 模式下任意账号密码均可登录成功。
 * @param {{ username: string, password: string }} credentials 登录凭据
 * @returns {Promise<Object>} 登录结果，含 session 与 account
 */
export const login = (credentials) => client.post("/auth/login", credentials);

/**
 * 获取当前登录用户资料。
 * @returns {Promise<Object>} 用户资料
 */
export const getSession = () => client.get("/auth/me");
