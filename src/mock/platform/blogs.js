import { createPaginatedResult } from "@/mock/utils/pagination";

const blogs = [
  {
    id: 1,
    title: "GEO 内容增长方法论",
    author: "admin",
    sort: 1,
    status: "已发布",
    createdAt: "2024-01-15",
  },
  {
    id: 2,
    title: "搜索流量运营指南",
    author: "zhangsan",
    sort: 2,
    status: "草稿",
    createdAt: "2024-03-08",
  },
  {
    id: 3,
    title: "高质量内容编辑规范",
    author: "lisi",
    sort: 3,
    status: "已发布",
    createdAt: "2024-05-21",
  },
  {
    id: 4,
    title: "GEO 内容增长方法论",
    author: "admin",
    sort: 1,
    status: "已发布",
    createdAt: "2024-01-15",
  },
  {
    id: 5,
    title: "GEO 内容增长方法论",
    author: "admin",
    sort: 1,
    status: "已发布",
    createdAt: "2024-01-15",
  },
  {
    id: 6,
    title: "搜索流量运营指南",
    author: "zhangsan",
    sort: 2,
    status: "草稿",
    createdAt: "2024-03-08",
  },
  {
    id: 7,
    title: "高质量内容编辑规范",
    author: "lisi",
    sort: 3,
    status: "已发布",
    createdAt: "2024-05-21",
  },
  {
    id: 8,
    title: "GEO 内容增长方法论",
    author: "admin",
    sort: 1,
    status: "已发布",
    createdAt: "2024-01-15",
  },
  {
    id: 9,
    title: "搜索流量运营指南",
    author: "zhangsan",
    sort: 2,
    status: "草稿",
    createdAt: "2024-03-08",
  },
  {
    id: 10,
    title: "高质量内容编辑规范",
    author: "lisi",
    sort: 3,
    status: "已发布",
    createdAt: "2024-05-21",
  },
  {
    id: 11,
    title: "GEO 内容增长方法论",
    author: "admin",
    sort: 1,
    status: "已发布",
    createdAt: "2024-01-15",
  },
  {
    id: 12,
    title: "搜索流量运营指南",
    author: "zhangsan",
    sort: 2,
    status: "草稿",
    createdAt: "2024-03-08",
  },
  {
    id: 13,
    title: "高质量内容编辑规范",
    author: "lisi",
    sort: 3,
    status: "已发布",
    createdAt: "2024-05-21",
  },
];

/**
 * 模拟查询博客列表。
 * @param {{ title?: string, author?: string, createdAtStart?: string, createdAtEnd?: string, page?: number, pageSize?: number }} params 查询参数
 * @returns {{ items: Array<Object>, total: number }} 博客分页结果
 */
export const handleBlogs = (params) => {
  const title = params?.title?.trim();
  const author = params?.author?.trim();
  const createdAtStart = params?.createdAtStart;
  const createdAtEnd = params?.createdAtEnd;
  const filteredBlogs = blogs.filter((blog) => {
    return (
      (!title || blog.title.includes(title)) &&
      (!author || blog.author.includes(author)) &&
      (!createdAtStart || blog.createdAt >= createdAtStart) &&
      (!createdAtEnd || blog.createdAt <= createdAtEnd)
    );
  });

  return createPaginatedResult(filteredBlogs, params);
};

/**
 * 模拟新增文章。
 * @param {{ title: string, author: string, sort: number, status: string }} data 文章信息
 * @returns {Object} 新增后的文章
 */
export const createBlog = (data) => {
  const blog = {
    id: Date.now(),
    ...data,
    createdAt: new Date().toISOString().slice(0, 10),
  };

  blogs.unshift(blog);
  return blog;
};

/**
 * 模拟删除文章。
 * @param {number} id 文章 ID
 * @returns {{ deleted: boolean }} 删除结果
 */
export const deleteBlog = (id) => {
  const index = blogs.findIndex((blog) => blog.id === id);

  if (index === -1) return { deleted: false };

  blogs.splice(index, 1);
  return { deleted: true };
};

/**
 * 模拟修改文章。
 * @param {number} id 文章 ID
 * @param {Object} data 文章信息
 * @returns {Object|null} 更新后的文章
 */
export const updateBlog = (id, data) => {
  const index = blogs.findIndex((blog) => blog.id === id);

  if (index === -1) return null;

  blogs[index] = { ...blogs[index], ...data };
  return blogs[index];
};
