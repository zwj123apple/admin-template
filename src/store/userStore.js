import { create } from 'zustand';
import { getToken, getUserInfo, setToken, setUserInfo, removeToken, removeUserInfo } from '../services/auth';
import { post } from '../services/api';

// 初始化状态，检查sessionStorage中是否有token
const getInitialState = () => {
  const token = getToken();
  const userInfo = getUserInfo();
  return {
    token,
    userInfo,
    isLoggedIn: !!token,
    loading: false,
    error: null
  };
};

// 创建不使用持久化的store
const useUserStore = create((set, get) => ({
  // 使用初始状态
  ...getInitialState(),

  // 登录方法
  login: async (username, password) => {
    set({ loading: true, error: null });
    try {
      // 导入MD5加密函数
      const { md5Encrypt } = await import('../utils/commonUtils');
      // 对密码进行MD5加密
      const encryptedPassword = md5Encrypt(password);
      const response = await post('/auth/login', { username, password: encryptedPassword });
      if (response.code === 200) {
        const { token, userInfo } = response.data;
        // 使用auth.js中的方法保存token和用户信息
        setToken(token);
        setUserInfo(userInfo);
        set({ token, userInfo, isLoggedIn: true, loading: false });
        return { success: true };
      } else {
        set({ error: response.message, loading: false });
        return { success: false, message: response.message };
      }
    } catch (error) {
      // 处理不同类型的错误
      let errorMessage = '登录失败';
      
      if (error.response) {
        // 服务器返回了错误状态码
        errorMessage = error.response.data?.message || `服务器错误 (${error.response.status})`;
      } else if (error.request) {
        // 请求已发送但没有收到响应
        if (error.code === 'ECONNABORTED') {
          errorMessage = '登录请求超时，请检查服务器是否正常运行';
        } else if (error.message === 'Network Error') {
          errorMessage = '无法连接到服务器，请确认后台服务是否已启动';
        } else {
          errorMessage = '网络请求失败，请检查网络连接';
        }
      } else {
        // 请求设置时出错
        errorMessage = error.message || '登录请求配置错误';
      }
      
      set({ error: errorMessage, loading: false });
      return { success: false, message: errorMessage };
    }
  },

  // 登出方法
  logout: () => {
    // 使用auth.js中的方法清除token和用户信息
    removeToken();
    removeUserInfo();
    set({ token: null, userInfo: null, isLoggedIn: false });
  },

  // 获取用户信息
  getUserInfo: () => {
    return get().userInfo;
  },
}));



export default useUserStore;