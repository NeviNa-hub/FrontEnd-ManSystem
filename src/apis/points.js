import { client } from "@/apis/demo/client";

/** 获取积分充值记录。
 * @param {{ phone?: string, page?: number, pageSize?: number }} params 查询条件
 * @returns {Promise<{ items: Array<Object>, total: number }>} 充值记录
 */
export const getRechargeRecords = (params) =>
  client.get("/platform/points/recharges", params);

/** 创建积分充值记录。
 * @param {{ phone: string, computePoints?: number, mediaPoints?: number }} data 充值信息
 * @returns {Promise<Object>} 新增记录
 */
export const createRecharge = (data) =>
  client.post("/platform/points/recharges", data);

