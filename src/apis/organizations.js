import { client } from "@/apis/demo/client";

/**
 * 获取组织分页列表。
 * @param {{ name?: string, role?: string, page?: number, pageSize?: number }} params 查询条件
 * @returns {Promise<{ items: Array<Object>, total: number }>} 分页组织列表
 */
export const getOrganizations = (params) =>
  client.get("/platform/organizations", params);

/**
 * 新增组织。
 * @param {{ name: string, owner: string, roles: Array<string>, status: string }} data 组织信息
 * @returns {Promise<Object>} 新增后的组织
 */
export const createOrganization = (data) =>
  client.post("/platform/organizations", data);

/**
 * 删除组织。
 * @param {number} id 组织 ID
 * @returns {Promise<Object>} 删除结果
 */
export const deleteOrganization = (id) =>
  client.delete(`/platform/organizations/${id}`);

/**
 * 修改组织。
 * @param {number} id 组织 ID
 * @param {Object} data 组织信息
 * @returns {Promise<Object>} 更新后的组织
 */
export const updateOrganization = (id, data) =>
  client.put(`/platform/organizations/${id}`, data);
