/**
 * 工具函数统一导出
 */

// 导出日期时间工具
export * from './dateUtils';
export { default as dateUtils } from './dateUtils';

// 导出数据验证工具
export * from './validationUtils';
export { default as validationUtils } from './validationUtils';

// 导出本地存储工具
export * from './storageUtils';
export { default as storageUtils } from './storageUtils';

// 导出权限控制工具
export * from './authUtils';
export { default as authUtils } from './authUtils';

// 导出通用工具
export * from './commonUtils';
export { default as commonUtils } from './commonUtils';

// 默认导出所有工具
export default {
  dateUtils,
  validationUtils,
  storageUtils,
  authUtils,
  commonUtils
};