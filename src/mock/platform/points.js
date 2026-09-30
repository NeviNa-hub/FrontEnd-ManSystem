import { createPaginatedResult } from "@/mock/utils/pagination";

const recharges = [
  {
    id: 1,
    phone: "13800138000",
    computePoints: 1000,
    mediaPoints: 500,
    createdAt: "2024-06-18 14:30:00",
    flows: [
      {
        type: "算力积分",
        amount: 1000,
        balance: 1000,
        createdAt: "2024-06-18 14:30:00",
        remark: "后台充值",
      },
      {
        type: "媒体积分",
        amount: 500,
        balance: 500,
        createdAt: "2024-06-18 14:30:00",
        remark: "后台充值",
      },
    ],
  },
];

export const handleRechargeRecords = (params) => {
  const phone = params?.phone?.trim();
  const records = phone
    ? recharges.filter((item) => item.phone.includes(phone))
    : recharges;
  return createPaginatedResult(records, params);
};

export const createRechargeRecord = (data) => {
  const computePoints = Number(data.computePoints || 0);
  const mediaPoints = Number(data.mediaPoints || 0);
  const createdAt = new Date().toISOString().replace("T", " ").slice(0, 19);
  const record = {
    id: Date.now(),
    phone: data.phone,
    computePoints,
    mediaPoints,
    createdAt,
    flows: [
      ...(computePoints
        ? [
            {
              type: "算力积分",
              amount: computePoints,
              balance: computePoints,
              createdAt,
              remark: "后台充值",
            },
          ]
        : []),
      ...(mediaPoints
        ? [
            {
              type: "媒体积分",
              amount: mediaPoints,
              balance: mediaPoints,
              createdAt,
              remark: "后台充值",
            },
          ]
        : []),
    ],
  };
  recharges.unshift(record);
  return record;
};
