const SESSION_STORAGE_KEY = "hollygloba_demo_sessions";

const restoreSessions = () => {
  try {
    const stored = localStorage.getItem(SESSION_STORAGE_KEY);
    return new Map(stored ? JSON.parse(stored) : []);
  } catch {
    return new Map();
  }
};

const persistSessions = (sessions) => {
  localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify([...sessions]));
};

const sessions = restoreSessions();

const buildAccount = (username) => ({
  id: 1,
  username,
  name: username,
  email: `${username}@hollygloba.com`,
  roles: ["admin"],
});

/**
 * 模拟登录并创建演示会话。
 * @param {{ username: string }} body 登录信息
 * @returns {{ code: number, data: Object }} 登录响应
 */
export const handleLogin = (body) => {
  const session = `demo-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;

  sessions.set(session, body.username);
  persistSessions(sessions);

  return { code: 0, data: { session, account: buildAccount(body.username) } };
};

/**
 * 模拟获取当前登录用户。
 * @param {Object} headers 请求头
 * @returns {{ code: number, data?: Object, message?: string }} 用户资料响应
 */
export const handleMe = (headers) => {
  const username = sessions.get(headers["X-Demo-Session"]);

  if (!username) return { code: 401, message: "演示会话已失效，请重新登录" };

  return { code: 0, data: buildAccount(username) };
};
