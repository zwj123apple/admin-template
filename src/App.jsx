import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import { message } from 'antd';
import zhCN from 'antd/locale/zh_CN';

// 导入页面和布局
import MainLayout from './layouts/MainLayout';
import Dashboard from './pages/Dashboard';
import UserList from './pages/UserList';
import NotFound from './pages/NotFound';
import useUserStore from './store/userStore';

// 导入全局样式
import './App.css';

// 导入配置
import { USE_REAL_API } from './config';

// 路由守卫组件
const PrivateRoute = ({ children }) => {
  const { isLoggedIn } = useUserStore();
  const location = useLocation();
  
  // 从store或localStorage检查登录状态
  const isAuthenticated = isLoggedIn || localStorage.getItem('admin_token');
  
  if (!isAuthenticated) {
    // 如果未登录，重定向到登录页
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  
  return children;
};

// 导入登录页面包装组件
import LoginWrapper from './components/LoginWrapper';


function App() {
  // 根据配置决定是否导入mock数据
  useEffect(() => {
    if (!USE_REAL_API) {
      import('./mock');
    }
  }, []);

  return (
    <ConfigProvider locale={zhCN}>
      <Router>
        <Routes>
          {/* 登录页面路由 */}
          <Route path="/login" element={<LoginWrapper />} />
          
          {/* 主布局路由（需要登录） */}
          <Route path="/dashboard" element={
            <PrivateRoute>
              <MainLayout>
                <Dashboard />
              </MainLayout>
            </PrivateRoute>
          } />
          
          <Route path="/users" element={
            <PrivateRoute>
              <MainLayout>
                <UserList />
              </MainLayout>
            </PrivateRoute>
          } />
          
          {/* 404页面 */}
          <Route path="/404" element={<NotFound />} />
          
          {/* 默认重定向到仪表盘 */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          
          {/* 未匹配的路由重定向到404 */}
          <Route path="*" element={<Navigate to="/404" replace />} />
        </Routes>
      </Router>
    </ConfigProvider>
  );
}

export default App;
