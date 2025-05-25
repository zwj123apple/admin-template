/**
 * 请求工具函数
 * 封装axios，处理请求拦截、响应拦截、错误处理等
 */

import axios from 'axios';
import { message } from 'antd';
import { getSessionItem, removeSessionItem } from './storageUtils';

// 创建axios实例
const request = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  timeout: 10000, // 请求超时时间
  headers: {
    'Content-Type': 'application/json'
  }
});

// 请求拦截器
request.interceptors.request.use(
  config => {
    // 从sessionStorage中获取token
    const token = getSessionItem('token');
    
    // 如果有token，则添加到请求头中
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  error => {
    // 请求错误处理
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// 响应拦截器
request.interceptors.response.use(
  response => {
    // 如果响应成功，直接返回数据
    const res = response.data;
    
    // 根据后端接口规范，判断请求是否成功
    // 这里假设后端返回的数据格式为 { code: number, data: any, message: string }
    if (res.code === 200 || res.code === 0) {
      return res.data;
    }
    
    // 处理特定错误码
    if (res.code === 401) {
      // 未授权，清除token并跳转到登录页
      message.error('登录已过期，请重新登录');
      removeSessionItem('token');
      removeSessionItem('userInfo');
      window.location.href = '/login';
      return Promise.reject(new Error(res.message || '未授权'));
    }
    
    // 其他错误码处理
    message.error(res.message || '请求失败');
    return Promise.reject(new Error(res.message || '请求失败'));
  },
  error => {
    // 处理HTTP错误状态码
    if (error.response) {
      const { status, data } = error.response;
      
      switch (status) {
        case 401:
          // 未授权，清除token并跳转到登录页
          message.error('登录已过期，请重新登录');
          removeSessionItem('token');
          removeSessionItem('userInfo');
          window.location.href = '/login';
          break;
        case 403:
          message.error('没有权限访问该资源');
          break;
        case 404:
          message.error('请求的资源不存在');
          break;
        case 500:
          message.error('服务器错误，请稍后再试');
          break;
        default:
          message.error(data.message || `请求失败(${status})`);
      }
    } else if (error.request) {
      // 请求已发送但没有收到响应
      message.error('网络异常，请检查网络连接');
    } else {
      // 请求配置出错
      message.error('请求配置错误: ' + error.message);
    }
    
    console.error('Response error:', error);
    return Promise.reject(error);
  }
);

/**
 * GET请求
 * @param {string} url - 请求地址
 * @param {Object} [params] - 请求参数
 * @param {Object} [config] - 额外配置
 * @returns {Promise} 请求Promise
 */
export const get = (url, params = {}, config = {}) => {
  return request({
    method: 'get',
    url,
    params,
    ...config
  });
};

/**
 * POST请求
 * @param {string} url - 请求地址
 * @param {Object} [data] - 请求数据
 * @param {Object} [config] - 额外配置
 * @returns {Promise} 请求Promise
 */
export const post = (url, data = {}, config = {}) => {
  return request({
    method: 'post',
    url,
    data,
    ...config
  });
};

/**
 * PUT请求
 * @param {string} url - 请求地址
 * @param {Object} [data] - 请求数据
 * @param {Object} [config] - 额外配置
 * @returns {Promise} 请求Promise
 */
export const put = (url, data = {}, config = {}) => {
  return request({
    method: 'put',
    url,
    data,
    ...config
  });
};

/**
 * DELETE请求
 * @param {string} url - 请求地址
 * @param {Object} [params] - 请求参数
 * @param {Object} [config] - 额外配置
 * @returns {Promise} 请求Promise
 */
export const del = (url, params = {}, config = {}) => {
  return request({
    method: 'delete',
    url,
    params,
    ...config
  });
};

/**
 * 上传文件
 * @param {string} url - 上传地址
 * @param {FormData} formData - 表单数据
 * @param {Function} [onProgress] - 上传进度回调
 * @param {Object} [config] - 额外配置
 * @returns {Promise} 上传Promise
 */
export const upload = (url, formData, onProgress, config = {}) => {
  return request({
    method: 'post',
    url,
    data: formData,
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    onUploadProgress: onProgress ? e => {
      const progress = Math.round((e.loaded * 100) / e.total);
      onProgress(progress);
    } : undefined,
    ...config
  });
};

/**
 * 下载文件
 * @param {string} url - 下载地址
 * @param {Object} [params] - 请求参数
 * @param {string} [filename] - 文件名
 * @param {Function} [onProgress] - 下载进度回调
 * @param {Object} [config] - 额外配置
 * @returns {Promise} 下载Promise
 */
export const download = (url, params = {}, filename, onProgress, config = {}) => {
  return request({
    method: 'get',
    url,
    params,
    responseType: 'blob',
    onDownloadProgress: onProgress ? e => {
      const progress = Math.round((e.loaded * 100) / e.total);
      onProgress(progress);
    } : undefined,
    ...config
  }).then(blob => {
    // 创建a标签并模拟点击下载
    const link = document.createElement('a');
    const objectUrl = URL.createObjectURL(blob);
    
    link.href = objectUrl;
    link.download = filename || 'download';
    document.body.appendChild(link);
    link.click();
    
    // 清理
    URL.revokeObjectURL(objectUrl);
    document.body.removeChild(link);
    
    return blob;
  });
};

// 导出axios实例和请求方法
export default {
  request,
  get,
  post,
  put,
  delete: del,
  upload,
  download
};