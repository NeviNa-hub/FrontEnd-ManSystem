import { client } from "@/apis/demo/client";

/**
 * 获取博客分页列表。
 * @param {{ title?: string, author?: string, createdAtStart?: string, createdAtEnd?: string, page?: number, pageSize?: number }} params 查询条件
 * @returns {Promise<{ items: Array<Object>, total: number }>} 分页博客列表
 */
export const getBlogs = (params) => client.get("/platform/blogs", params);

/**
 * 新增文章。
 * @param {{ title: string, author: string, content: string, sort: number, status: string }} data 文章信息
 * @returns {Promise<Object>} 新增后的文章
 */
export const createBlog = (data) => client.post("/platform/blogs", data);

/**
 * 删除文章。
 * @param {number} id 文章 ID
 * @returns {Promise<Object>} 删除结果
 */
export const deleteBlog = (id) => client.delete(`/platform/blogs/${id}`);

/**
 * 修改文章。
 * @param {number} id 文章 ID
 * @param {Object} data 文章信息
 * @returns {Promise<Object>} 更新后的文章
 */
export const updateBlog = (id, data) =>
  client.put(`/platform/blogs/${id}`, data);
