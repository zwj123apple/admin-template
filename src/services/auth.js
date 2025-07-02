/**
 * 认证相关服务
 */
import { post } from './api';

// Token存储的键名
const TOKEN_KEY = 'admin_token';
const USER_INFO_KEY = 'admin_user_info';

/**
 * 存储token到sessionStorage
 * @param {string} token - 用户令牌
 */
export const setToken = (token) => {
  localStorage.setItem(TOKEN_KEY, token);
};

/**
 * 从sessionStorage获取token
 * @returns {string|null} 用户令牌
 */
export const getToken = () => {
  return localStorage.getItem(TOKEN_KEY);
};

/**
 * 从sessionStorage移除token
 */
export const removeToken = () => {
  localStorage.removeItem(TOKEN_KEY);
};

/**
 * 存储用户信息到sessionStorage
 * @param {Object} userInfo - 用户信息
 */
export const setUserInfo = (userInfo) => {
  localStorage.setItem(USER_INFO_KEY, JSON.stringify(userInfo));
};

/**
 * 从sessionStorage获取用户信息
 * @returns {Object|null} 用户信息
 */
export const getUserInfo = () => {
  const userInfo = localStorage.getItem(USER_INFO_KEY);
  return userInfo ? JSON.parse(userInfo) : null;
};

/**
 * 从sessionStorage移除用户信息
 */
export const removeUserInfo = () => {
  localStorage.removeItem(USER_INFO_KEY);
};

/**
 * 登录服务
 * @param {Object} data - 登录信息
 * @param {string} data.username - 用户名
 * @param {string} data.password - 密码
 * @returns {Promise} 登录结果
 */
export const login = async (data) => {
  const result = await post('/auth/login', data);
  if (result && result.token) {
    setToken(result.token);
    setUserInfo(result.userInfo);
  }
  return result;
};

/**
 * 登出服务
 * @returns {Promise} 登出结果
 */
export const logout = async () => {
  try {
    await post('/auth/logout');
  } catch (error) {
    console.error('登出失败:', error);
  } finally {
    // 无论请求是否成功，都清除本地存储
    removeToken();
    removeUserInfo();
  }
};

/**
 * 检查用户是否已登录
 * @returns {boolean} 是否已登录
 */
export const isLoggedIn = () => {
  return !!getToken();
};