import React, { useState } from 'react';
import { Form, Input, Button, Card, message, Spin, Alert } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import useUserStore from '../../store/userStore';
import './style.css';

const Login = () => {
  const navigate = useNavigate();
  const { login, loading, error } = useUserStore();
  const [loginError, setLoginError] = useState('');
  const [form] = Form.useForm();

  const handleSubmit = async (values) => {
    const { username, password } = values;
    setLoginError(''); // 清除之前的错误信息
    const result = await login(username, password);
    
    if (result.success) {
      message.success('登录成功');
      // 确保导航到仪表盘页面
      setTimeout(() => {
        navigate('/dashboard');
      }, 100);
    } else {
      setLoginError(result.message || '登录失败');
    }
  };

  return (
    <div className="login-container">
      <div className="login-content">
        <Card title="后台管理系统" className="login-card">
          <Spin spinning={loading}>
            {loginError && (
              <Alert
                message="登录失败"
                description={loginError}
                type="error"
                showIcon
                style={{ marginBottom: 16 }}
              />
            )}
            <Form
              form={form}
              name="login"
              onFinish={handleSubmit}
              initialValues={{ username: 'admin', password: '123456' }}
            >
              <Form.Item
                name="username"
                rules={[{ required: true, message: '请输入用户名' }]}
              >
                <Input 
                  prefix={<UserOutlined />} 
                  placeholder="用户名: admin" 
                  size="large" 
                />
              </Form.Item>

              <Form.Item
                name="password"
                rules={[{ required: true, message: '请输入密码' }]}
              >
                <Input.Password 
                  prefix={<LockOutlined />} 
                  placeholder="密码: 123456" 
                  size="large" 
                />
              </Form.Item>

              <Form.Item>
                <Button type="primary" htmlType="submit" block size="large" loading={loading}>
                  登录
                </Button>
              </Form.Item>
            </Form>
          </Spin>
        </Card>
      </div>
    </div>
  );
};

export default Login;