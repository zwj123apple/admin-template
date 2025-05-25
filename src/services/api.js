import axios from 'axios';
import { message } from 'antd';
import { getToken, removeToken } from './auth';
import { USE_REAL_API } from '../config';

// 创建axios实例
const api = axios.create({
  // 根据配置决定是否使用真实API的URL
  baseURL: USE_REAL_API ? (import.meta.env.VITE_API_URL || '/api') : '/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// 请求拦截器
api.interceptors.request.use(
  config => {
    // 添加token到请求头
    const token = getToken();
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    console.error('请求错误:', error);
    return Promise.reject(error);
  }
);

// 响应拦截器
api.interceptors.response.use(
  response => {
    // 直接返回响应数据
    return response.data;
  },
  error => {
    const { response } = error;
    
    // 处理不同的错误状态码
    if (response) {
      const { status, data } = response;
      
      switch (status) {
        case 401: // 未授权
          message.error('登录已过期，请重新登录');
          removeToken();
          // 跳转到登录页
          window.location.href = '/login';
          break;
        case 403: // 禁止访问
          message.error('没有权限访问该资源');
          break;
        case 404: // 资源不存在
          message.error('请求的资源不存在');
          break;
        case 500: // 服务器错误
          message.error('服务器错误，请稍后再试');
          break;
        default:
          message.error(data.message || '请求失败');
      }
    } else {
      // 网络错误
      const errorMessage = error.code === 'ECONNABORTED' 
        ? '请求超时，请检查服务器是否正常运行' 
        : error.message === 'Network Error' 
          ? '无法连接到服务器，请确认后台服务是否已启动' 
          : '网络错误，请检查网络连接';
      
      message.error(errorMessage);
    }
    
    return Promise.reject(error);
  }
);

// 封装GET请求
export const get = (url, params) => {
  return api.get(url, { params });
};

// 封装POST请求
export const post = (url, data) => {
  return api.post(url, data);
};

// 封装PUT请求
export const put = (url, data) => {
  return api.put(url, data);
};

// 封装DELETE请求
export const del = (url) => {
  return api.delete(url);
};

export default api;