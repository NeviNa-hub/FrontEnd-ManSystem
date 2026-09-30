/**
 * 根据页码与每页条数截取列表数据。
 * @param {Array<Object>} items 筛选后的完整列表
 * @param {{ page?: number, pageSize?: number }} params 分页参数
 * @returns {{ items: Array<Object>, total: number }} 分页结果
 */
export const createPaginatedResult = (items, params) => {
  const page = Number(params?.page) || 1;
  const pageSize = Number(params?.pageSize) || 10;
  const start = (page - 1) * pageSize;

  return { items: items.slice(start, start + pageSize), total: items.length };
};
