import React, { useEffect, useState } from 'react';
import { Navigate, useNavigate, useLocation } from 'react-router-dom';
import { message, Spin } from 'antd';
import Login from '../../pages/Login';
import useUserStore from '../../store/userStore';
import { isLoggedIn as checkIsLoggedIn } from '../../services/auth';

/**
 * 登录页面包装组件
 * 处理自动登录逻辑和路由重定向
 * @returns {JSX.Element} 登录组件
 */
const LoginWrapper = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isLoggedIn } = useUserStore();
  const from = location.state?.from?.pathname || '/dashboard';
  const [checking, setChecking] = useState(true);
  
  useEffect(() => {
    // 检查是否已经登录（从sessionStorage检查token）
    const checkLoginStatus = async () => {
      try {
        // 如果store中未登录但sessionStorage中有token，则同步状态
        if (!isLoggedIn && checkIsLoggedIn()) {
          // 更新store状态
          message.success('已恢复登录状态');
          // 这里不需要手动导航，让下面的条件渲染处理
        }
      } finally {
        // 无论结果如何，标记检查完成
        setChecking(false);
      }
    };
    
    checkLoginStatus();
  }, [isLoggedIn]);
  
  // 如果正在检查登录状态，显示加载中
  if (checking) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Spin size="large" tip="正在检查登录状态..." />
      </div>
    );
  }

  // 如果已登录或sessionStorage中有token，重定向到来源页面或仪表盘
  if (isLoggedIn || checkIsLoggedIn()) {
    return <Navigate to={from} replace />;
  }
  
  // 否则显示登录页面
  return <Login />;

};

export default LoginWrapper;