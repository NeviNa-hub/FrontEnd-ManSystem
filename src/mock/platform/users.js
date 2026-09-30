import { createPaginatedResult } from "@/mock/utils/pagination";

const users = [
  {
    id: 1,
    username: "admin",
    organization: "HollyGlobe",
    role: "超级管理员",
    status: "启用",
    joinedAt: "2024-01-15",
  },
  {
    id: 2,
    username: "zhangsan",
    organization: "HollyGlobe",
    role: "普通管理员",
    status: "启用",
    joinedAt: "2024-03-08",
  },
  {
    id: 3,
    username: "lisi",
    organization: "HollyGlobe",
    role: "普通管理员",
    status: "停用",
    joinedAt: "2024-05-21",
  },
];

/**
 * 模拟查询用户列表。
 * @param {{ username?: string, joinedAtStart?: string, joinedAtEnd?: string, page?: number, pageSize?: number }} params 查询参数
 * @returns {{ items: Array<Object>, total: number }} 用户分页结果
 */
export const handleUsers = (params) => {
  const username = params?.username?.trim();
  const joinedAtStart = params?.joinedAtStart;
  const joinedAtEnd = params?.joinedAtEnd;
  const filteredUsers = users.filter((user) => {
    return (
      (!username || user.username.includes(username)) &&
      (!joinedAtStart || user.joinedAt >= joinedAtStart) &&
      (!joinedAtEnd || user.joinedAt <= joinedAtEnd)
    );
  });

  return createPaginatedResult(filteredUsers, params);
};

/**
 * 模拟新增用户。
 * @param {{ username: string, organization: string, role: string }} data 用户信息
 * @returns {Object} 新增后的用户
 */
export const createUser = (data) => {
  const user = {
    id: Date.now(),
    ...data,
    joinedAt: new Date().toISOString().slice(0, 10),
  };

  users.unshift(user);
  return user;
};

/**
 * 模拟编辑用户。
 * @param {number} id 用户 ID
 * @param {Object} data 用户信息
 * @returns {Object} 更新后的用户
 */
export const updateUser = (id, data) => {
  const index = users.findIndex((user) => user.id === id);

  if (index === -1) return null;

  users[index] = { ...users[index], ...data };
  return users[index];
};

/**
 * 模拟删除用户。
 * @param {number} id 用户 ID
 * @returns {{ deleted: boolean }} 删除结果
 */
export const deleteUser = (id) => {
  const index = users.findIndex((user) => user.id === id);

  if (index === -1) return { deleted: false };

  users.splice(index, 1);
  return { deleted: true };
};
