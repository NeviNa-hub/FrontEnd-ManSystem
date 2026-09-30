import { createPaginatedResult } from "@/mock/utils/pagination";

const organizations = [
  {
    id: 1,
    name: "HollyGloba 总部",
    owner: "admin",
    roles: ["超级管理员", "运营人员", "内容编辑", "技术人员"],
    status: "启用",
  },
  {
    id: 2,
    name: "华东区域",
    owner: "zhangsan",
    roles: ["运营人员", "内容编辑"],
    status: "启用",
  },
  {
    id: 3,
    name: "华南区域",
    owner: "lisi",
    roles: ["内容编辑", "技术人员"],
    status: "停用",
  },
];

/**
 * 模拟查询组织列表。
 * @param {{ name?: string, role?: string, page?: number, pageSize?: number }} params 查询参数
 * @returns {{ items: Array<Object>, total: number }} 组织分页结果
 */
export const handleOrganizations = (params) => {
  const name = params?.name?.trim();
  const role = params?.role;
  const filteredOrganizations = organizations.filter((organization) => {
    return (
      (!name || organization.name.includes(name)) &&
      (!role || organization.roles.includes(role))
    );
  });

  return createPaginatedResult(filteredOrganizations, params);
};

/**
 * 模拟新增组织。
 * @param {{ name: string, owner: string, roles: Array<string>, status: string }} data 组织信息
 * @returns {Object} 新增后的组织
 */
export const createOrganization = (data) => {
  const organization = { id: Date.now(), ...data };

  organizations.unshift(organization);
  return organization;
};

/**
 * 模拟删除组织。
 * @param {number} id 组织 ID
 * @returns {{ deleted: boolean }} 删除结果
 */
export const deleteOrganization = (id) => {
  const index = organizations.findIndex(
    (organization) => organization.id === id,
  );

  if (index === -1) return { deleted: false };

  organizations.splice(index, 1);
  return { deleted: true };
};

/**
 * 模拟修改组织。
 * @param {number} id 组织 ID
 * @param {Object} data 组织信息
 * @returns {Object|null} 更新后的组织
 */
export const updateOrganization = (id, data) => {
  const index = organizations.findIndex(
    (organization) => organization.id === id,
  );

  if (index === -1) return null;

  organizations[index] = { ...organizations[index], ...data };
  return organizations[index];
};
