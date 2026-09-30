import { client } from "@/apis/demo/client";

/**
 * 获取用户列表。
 * @param {{ username?: string }} params 用户筛选条件
 * @returns {Promise<{ items: Array<Object>, total: number }>} 分页用户列表
 */
export const getUsers = (params) => client.get("/platform/users", params);

/**
 * 新增用户。
 * @param {{ username: string, organization: string, role: string }} data 用户信息
 * @returns {Promise<Object>} 新增后的用户
 */
export const createUser = (data) => client.post("/platform/users", data);

/**
 * 编辑用户。
 * @param {number} id 用户 ID
 * @param {{ username: string, organization: string, role: string }} data 用户信息
 * @returns {Promise<Object>} 更新后的用户
 */
export const updateUser = (id, data) =>
  client.put(`/platform/users/${id}`, data);

/**
 * 删除用户。
 * @param {number} id 用户 ID
 * @returns {Promise<Object>} 删除结果
 */
export const deleteUser = (id) => client.delete(`/platform/users/${id}`);
