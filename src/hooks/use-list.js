import { onBeforeUnmount, reactive, ref } from "vue";

/**
 * 管理列表查询、分页和请求状态，避免旧请求覆盖新请求。
 * @param {{ createInitialFilters: () => Object, getList: (params: Object) => Promise<Object>, buildParams?: (filters: Object, pagination: Object) => Object }} options 列表配置
 * @returns {Object} 列表状态与操作方法
 */
export const useList = ({ createInitialFilters, getList, buildParams, pagination: listPagination }) => {
  const filters = reactive(createInitialFilters());
  const items = ref([]);
  const loading = ref(false);
  const pagination = listPagination || reactive({ page: 1, pageSize: 10, total: 0 });
  let requestId = 0;

  const loadList = async () => {
    const currentRequestId = requestId + 1;
    requestId = currentRequestId;
    loading.value = true;

    try {
      const params = buildParams
        ? buildParams(filters, pagination)
        : { ...filters, ...pagination };
      const result = await getList(params);

      if (currentRequestId !== requestId) return;

      items.value = result.items;
      pagination.total = result.total;
    } finally {
      if (currentRequestId === requestId) loading.value = false;
    }
  };

  const searchList = async () => {
    pagination.page = 1;
    await loadList();
  };
  const resetList = async () => {
    Object.assign(filters, createInitialFilters());
    pagination.page = 1;
    await loadList();
  };
  onBeforeUnmount(() => {
    requestId += 1;
  });

  return {
    filters,
    items,
    loading,
    pagination,
    loadList,
    searchList,
    resetList,
  };
};
