import { ElMessageBox } from "element-plus";

/**
 * 打开公共删除确认弹窗。
 * @param {string} message 删除提示内容
 * @returns {Promise<boolean>} 用户是否确认删除
 */
export const confirmDelete = async (message) => {
  return confirmAction(message, "删除确认");
};

/**
 * 打开公共操作确认弹窗。
 * @param {string} message 确认提示内容
 * @param {string} title 弹窗标题
 * @returns {Promise<boolean>} 用户是否确认操作
 */
export const confirmAction = async (message, title = "操作确认") => {
  try {
    await ElMessageBox.confirm(message, title, { type: "warning" });
    return true;
  } catch (error) {
    if (error === "cancel" || error === "close") return false;
    throw error;
  }
};
