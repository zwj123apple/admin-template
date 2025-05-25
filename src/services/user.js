/**
 * 用户相关服务
 */
import { get, post, put, del } from './api';
import { USE_REAL_API } from '../config';

/**
 * 获取当前用户信息
 * @returns {Promise} 用户信息
 */
export const getCurrentUser = () => {
  return get('/user/current');
};

/**
 * 获取用户列表
 * @param {Object} params - 查询参数
 * @param {number} params.page - 页码
 * @param {number} params.pageSize - 每页条数
 * @returns {Promise} 用户列表数据
 */
export const getUserList = (params) => {
  // 根据配置决定是否使用/api前缀
  return get(USE_REAL_API ? '/users' : '/api/users', params);
};

/**
 * 获取用户详情
 * @param {string} id - 用户ID
 * @returns {Promise} 用户详情
 */
export const getUserDetail = (id) => {
  // 根据配置决定是否使用/api前缀
  return get(USE_REAL_API ? `/users/${id}` : `/api/users/${id}`);
};

/**
 * 创建用户
 * @param {Object} data - 用户数据
 * @returns {Promise} 创建结果
 */
export const createUser = (data) => {
  // 根据配置决定是否使用/api前缀
  return post(USE_REAL_API ? '/users' : '/api/users', data);
};

/**
 * 更新用户信息
 * @param {string} id - 用户ID
 * @param {Object} data - 用户数据
 * @returns {Promise} 更新结果
 */
export const updateUser = (id, data) => {
  // 根据配置决定是否使用/api前缀
  return put(USE_REAL_API ? `/users/${id}` : `/api/users/${id}`, data);
};

/**
 * 删除用户
 * @param {string} id - 用户ID
 * @returns {Promise} 删除结果
 */
export const deleteUser = (id) => {
  // 根据配置决定是否使用/api前缀
  return del(USE_REAL_API ? `/users/${id}` : `/api/users/${id}`);
};

/**
 * 更新用户密码
 * @param {Object} data - 密码数据
 * @param {string} data.oldPassword - 旧密码
 * @param {string} data.newPassword - 新密码
 * @returns {Promise} 更新结果
 */
export const updatePassword = (data) => {
  return post('/user/password', data);
};

/**
 * 更新用户个人资料
 * @param {Object} data - 个人资料数据
 * @returns {Promise} 更新结果
 */
export const updateProfile = (data) => {
  return put('/user/profile', data);
};