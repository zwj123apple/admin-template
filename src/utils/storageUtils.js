/**
 * 本地存储工具函数
 * 封装localStorage和sessionStorage的操作，并提供数据过期功能
 */

/**
 * 存储数据到localStorage
 * @param {string} key - 存储键名
 * @param {any} value - 存储的值
 * @param {number} [expires] - 过期时间（毫秒），不传则永不过期
 */
export const setLocalItem = (key, value, expires) => {
  const data = {
    value,
    time: Date.now()
  };
  
  if (expires) {
    data.expires = expires;
  }
  
  localStorage.setItem(key, JSON.stringify(data));
};

/**
 * 从localStorage获取数据
 * @param {string} key - 存储键名
 * @param {any} defaultValue - 默认值，当获取失败或已过期时返回
 * @returns {any} 存储的值或默认值
 */
export const getLocalItem = (key, defaultValue = null) => {
  const dataStr = localStorage.getItem(key);
  if (!dataStr) return defaultValue;
  
  try {
    const data = JSON.parse(dataStr);
    const { value, time, expires } = data;
    
    // 检查是否过期
    if (expires && Date.now() - time > expires) {
      localStorage.removeItem(key);
      return defaultValue;
    }
    
    return value;
  } catch (e) {
    // 如果解析失败，可能是旧版本直接存储的值，直接返回
    return dataStr;
  }
};

/**
 * 从localStorage移除数据
 * @param {string} key - 存储键名
 */
export const removeLocalItem = (key) => {
  localStorage.removeItem(key);
};

/**
 * 清空localStorage
 */
export const clearLocalStorage = () => {
  localStorage.clear();
};

/**
 * 存储数据到sessionStorage
 * @param {string} key - 存储键名
 * @param {any} value - 存储的值
 */
export const setSessionItem = (key, value) => {
  sessionStorage.setItem(key, JSON.stringify({
    value,
    time: Date.now()
  }));
};

/**
 * 从sessionStorage获取数据
 * @param {string} key - 存储键名
 * @param {any} defaultValue - 默认值，当获取失败时返回
 * @returns {any} 存储的值或默认值
 */
export const getSessionItem = (key, defaultValue = null) => {
  const dataStr = sessionStorage.getItem(key);
  if (!dataStr) return defaultValue;
  
  try {
    const { value } = JSON.parse(dataStr);
    return value;
  } catch (e) {
    // 如果解析失败，可能是旧版本直接存储的值，直接返回
    return dataStr;
  }
};

/**
 * 从sessionStorage移除数据
 * @param {string} key - 存储键名
 */
export const removeSessionItem = (key) => {
  sessionStorage.removeItem(key);
};

/**
 * 清空sessionStorage
 */
export const clearSessionStorage = () => {
  sessionStorage.clear();
};

/**
 * 获取所有localStorage的键
 * @returns {Array<string>} 键名数组
 */
export const getLocalKeys = () => {
  return Object.keys(localStorage);
};

/**
 * 获取所有sessionStorage的键
 * @returns {Array<string>} 键名数组
 */
export const getSessionKeys = () => {
  return Object.keys(sessionStorage);
};

/**
 * 检查localStorage中是否存在某个键
 * @param {string} key - 存储键名
 * @returns {boolean} 是否存在
 */
export const hasLocalItem = (key) => {
  return localStorage.getItem(key) !== null;
};

/**
 * 检查sessionStorage中是否存在某个键
 * @param {string} key - 存储键名
 * @returns {boolean} 是否存在
 */
export const hasSessionItem = (key) => {
  return sessionStorage.getItem(key) !== null;
};

export default {
  setLocalItem,
  getLocalItem,
  removeLocalItem,
  clearLocalStorage,
  setSessionItem,
  getSessionItem,
  removeSessionItem,
  clearSessionStorage,
  getLocalKeys,
  getSessionKeys,
  hasLocalItem,
  hasSessionItem
};