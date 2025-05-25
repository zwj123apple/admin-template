import React from 'react';
import { Card, Row, Col, Statistic } from 'antd';
import { UserOutlined, ShoppingCartOutlined, FileOutlined, TeamOutlined } from '@ant-design/icons';

const Dashboard = () => {
  return (
    <div className="dashboard">
      <h2>仪表盘</h2>
      <Row gutter={16}>
        <Col span={6}>
          <Card>
            <Statistic 
              title="用户总数" 
              value={1128} 
              prefix={<UserOutlined />} 
              valueStyle={{ color: '#3f8600' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic 
              title="订单总数" 
              value={93} 
              prefix={<ShoppingCartOutlined />} 
              valueStyle={{ color: '#cf1322' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic 
              title="文章数量" 
              value={56} 
              prefix={<FileOutlined />} 
              valueStyle={{ color: '#1677ff' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic 
              title="团队数量" 
              value={12} 
              prefix={<TeamOutlined />} 
              valueStyle={{ color: '#722ed1' }}
            />
          </Card>
        </Col>
      </Row>
      
      <div style={{ marginTop: '24px' }}>
        <Card title="系统公告">
          <p>欢迎使用后台管理系统，这是一个基于React、Ant Design和Zustand构建的现代化管理系统。</p>
          <p>用户名: admin</p>
          <p>密码: 123456</p>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;