import { handleLogin, handleMe } from "@/mock/auth";
import {
  createBlog,
  deleteBlog,
  handleBlogs,
  updateBlog,
} from "@/mock/platform/blogs";
import {
  createOrganization,
  deleteOrganization,
  handleOrganizations,
  updateOrganization,
} from "@/mock/platform/organizations";
import {
  createUser,
  deleteUser,
  handleUsers,
  updateUser,
} from "@/mock/platform/users";
import {
  createRechargeRecord,
  handleRechargeRecords,
} from "@/mock/platform/points";

const MOCK_HANDLERS = {
  "POST /auth/login": ({ data }) => handleLogin(data),
  "GET /auth/me": ({ headers }) => handleMe(headers),
  "GET /platform/users": ({ data }) => ({ code: 0, data: handleUsers(data) }),
  "POST /platform/users": ({ data }) => ({ code: 0, data: createUser(data) }),
  "PUT /platform/users/:id": ({ data, id }) => ({
    code: 0,
    data: updateUser(id, data),
  }),
  "DELETE /platform/users/:id": ({ id }) => ({ code: 0, data: deleteUser(id) }),
  "GET /platform/organizations": ({ data }) => ({
    code: 0,
    data: handleOrganizations(data),
  }),
  "POST /platform/organizations": ({ data }) => ({
    code: 0,
    data: createOrganization(data),
  }),
  "DELETE /platform/organizations/:id": ({ id }) => ({
    code: 0,
    data: deleteOrganization(id),
  }),
  "PUT /platform/organizations/:id": ({ data, id }) => ({
    code: 0,
    data: updateOrganization(id, data),
  }),
  "GET /platform/points/recharges": ({ data }) => ({
    code: 0,
    data: handleRechargeRecords(data),
  }),
  "POST /platform/points/recharges": ({ data }) => ({
    code: 0,
    data: createRechargeRecord(data),
  }),
  "GET /platform/blogs": ({ data }) => ({ code: 0, data: handleBlogs(data) }),
  "POST /platform/blogs": ({ data }) => ({ code: 0, data: createBlog(data) }),
  "DELETE /platform/blogs/:id": ({ id }) => ({ code: 0, data: deleteBlog(id) }),
  "PUT /platform/blogs/:id": ({ data, id }) => ({
    code: 0,
    data: updateBlog(id, data),
  }),
};

/**
 * 分发一次 Mock 请求，并返回 { code, data } 响应体。
 * @param {{ method: string, url: string, data?: any, headers?: Object }} options 请求参数
 * @returns {Promise<Object>} 模拟响应体
 */
export const handleRequest = ({ method, url, data, headers }) =>
  new Promise((resolve) => {
    setTimeout(() => {
      const methodName = method.toUpperCase();
      const handler = MOCK_HANDLERS[`${methodName} ${url}`];
      const resourceMatch = url.match(/^\/platform\/users\/(\d+)$/);
      const organizationMatch = url.match(/^\/platform\/organizations\/(\d+)$/);
      const blogMatch = url.match(/^\/platform\/blogs\/(\d+)$/);

      if (handler) {
        resolve(handler({ data, headers }));
        return;
      }

      if (resourceMatch) {
        const resourceHandler =
          MOCK_HANDLERS[`${methodName} /platform/users/:id`];
        resolve(
          resourceHandler({ data, headers, id: Number(resourceMatch[1]) }),
        );
        return;
      }

      if (organizationMatch) {
        const resourceHandler =
          MOCK_HANDLERS[`${methodName} /platform/organizations/:id`];
        resolve(
          resourceHandler({ data, headers, id: Number(organizationMatch[1]) }),
        );
        return;
      }

      if (blogMatch) {
        const resourceHandler =
          MOCK_HANDLERS[`${methodName} /platform/blogs/:id`];
        resolve(resourceHandler({ data, headers, id: Number(blogMatch[1]) }));
        return;
      }

      resolve({
        code: 404,
        message: `Mock 未实现: ${method.toUpperCase()} ${url}`,
      });
    }, 200);
  });
