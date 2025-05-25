/**
 * 权限控制工具函数
 * 用于管理用户权限和访问控制
 */

import { getSessionItem } from './storageUtils';

// 权限常量
export const PERMISSIONS = {
  // 用户管理权限
  USER_VIEW: 'user:view',       // 查看用户列表
  USER_CREATE: 'user:create',   // 创建用户
  USER_EDIT: 'user:edit',       // 编辑用户
  USER_DELETE: 'user:delete',   // 删除用户
  
  // 角色管理权限
  ROLE_VIEW: 'role:view',       // 查看角色列表
  ROLE_CREATE: 'role:create',   // 创建角色
  ROLE_EDIT: 'role:edit',       // 编辑角色
  ROLE_DELETE: 'role:delete',   // 删除角色
  
  // 系统设置权限
  SETTINGS_VIEW: 'settings:view',     // 查看系统设置
  SETTINGS_EDIT: 'settings:edit',     // 编辑系统设置
  
  // 数据统计权限
  STATS_VIEW: 'stats:view',     // 查看统计数据
  
  // 管理员权限
  ADMIN: 'admin'                // 管理员权限（最高权限）
};

// 角色权限映射
export const ROLE_PERMISSIONS = {
  admin: [
    PERMISSIONS.ADMIN,
    // 管理员拥有所有权限
    PERMISSIONS.USER_VIEW,
    PERMISSIONS.USER_CREATE,
    PERMISSIONS.USER_EDIT,
    PERMISSIONS.USER_DELETE,
    PERMISSIONS.ROLE_VIEW,
    PERMISSIONS.ROLE_CREATE,
    PERMISSIONS.ROLE_EDIT,
    PERMISSIONS.ROLE_DELETE,
    PERMISSIONS.SETTINGS_VIEW,
    PERMISSIONS.SETTINGS_EDIT,
    PERMISSIONS.STATS_VIEW
  ],
  manager: [
    // 经理拥有部分权限
    PERMISSIONS.USER_VIEW,
    PERMISSIONS.USER_CREATE,
    PERMISSIONS.USER_EDIT,
    PERMISSIONS.ROLE_VIEW,
    PERMISSIONS.SETTINGS_VIEW,
    PERMISSIONS.STATS_VIEW
  ],
  user: [
    // 普通用户拥有基本权限
    PERMISSIONS.USER_VIEW,
    PERMISSIONS.SETTINGS_VIEW,
    PERMISSIONS.STATS_VIEW
  ],
  guest: [
    // 访客拥有最低权限
    PERMISSIONS.USER_VIEW,
    PERMISSIONS.STATS_VIEW
  ]
};

/**
 * 获取当前用户的角色
 * @returns {string|null} 用户角色
 */
export const getUserRole = () => {
  const userInfo = getSessionItem('userInfo');
  return userInfo ? userInfo.role : null;
};

/**
 * 获取当前用户的权限列表
 * @returns {Array<string>} 权限列表
 */
export const getUserPermissions = () => {
  const role = getUserRole();
  return role ? ROLE_PERMISSIONS[role] || [] : [];
};

/**
 * 检查当前用户是否拥有指定权限
 * @param {string|Array<string>} permission - 权限或权限列表
 * @returns {boolean} 是否拥有权限
 */
export const hasPermission = (permission) => {
  const userPermissions = getUserPermissions();
  
  // 如果用户拥有管理员权限，直接返回true
  if (userPermissions.includes(PERMISSIONS.ADMIN)) {
    return true;
  }
  
  // 检查单个权限
  if (typeof permission === 'string') {
    return userPermissions.includes(permission);
  }
  
  // 检查多个权限（要求全部满足）
  if (Array.isArray(permission)) {
    return permission.every(p => userPermissions.includes(p));
  }
  
  return false;
};

/**
 * 检查当前用户是否拥有指定权限中的任意一个
 * @param {Array<string>} permissions - 权限列表
 * @returns {boolean} 是否拥有任意一个权限
 */
export const hasAnyPermission = (permissions) => {
  const userPermissions = getUserPermissions();
  
  // 如果用户拥有管理员权限，直接返回true
  if (userPermissions.includes(PERMISSIONS.ADMIN)) {
    return true;
  }
  
  // 检查是否拥有任意一个权限
  return Array.isArray(permissions) && permissions.some(p => userPermissions.includes(p));
};

/**
 * 权限控制组件包装器
 * 用于根据权限条件渲染组件
 * @param {React.ReactNode} children - 子组件
 * @param {string|Array<string>} permission - 所需权限
 * @param {React.ReactNode} [fallback=null] - 无权限时显示的内容
 * @returns {React.ReactNode} 根据权限条件渲染的组件
 */
export const AuthWrapper = ({ children, permission, fallback = null }) => {
  return hasPermission(permission) ? children : fallback;
};

export default {
  PERMISSIONS,
  ROLE_PERMISSIONS,
  getUserRole,
  getUserPermissions,
  hasPermission,
  hasAnyPermission,
  AuthWrapper
};