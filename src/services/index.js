/**
 * 服务层统一导出
 */

// 导出API请求方法
export { get, post, put, del } from './api';

// 导出认证相关服务
export {
  setToken,
  getToken,
  removeToken,
  setUserInfo,
  getUserInfo,
  removeUserInfo,
  login,
  logout,
  isLoggedIn
} from './auth';

// 导出用户相关服务
export {
  getCurrentUser,
  getUserList,
  getUserDetail,
  createUser,
  updateUser,
  deleteUser,
  updatePassword,
  updateProfile
} from './user';