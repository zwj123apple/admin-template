import React, { useState, useEffect } from 'react';
import { Table, Card, Button, Space, Modal, message, Input, Form, Select } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, SearchOutlined } from '@ant-design/icons';
// 使用封装好的API服务替代直接使用axios
import { getUserList, createUser, updateUser, deleteUser } from '../../services/user';
import { format } from 'date-fns';
import { zhCN } from 'date-fns/locale'; // 导入中文语言包，用于本地化格式

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [form] = Form.useForm();
  const [editForm] = Form.useForm();
  
  // 获取用户列表
  const fetchUsers = async () => {
    setLoading(true);
    try {
      // 使用封装好的getUserList函数
      const response = await getUserList();
      console.log('API返回数据:', response);
      
      // 确保response是一个数组或包含数组的对象
      if (response && Array.isArray(response)) {
        // 直接是数组
        setUsers(response);
      } else if (response && response.data && Array.isArray(response.data)) {
        // 如果response是一个对象，且包含data数组字段
        setUsers(response.data);
      } else if (response && response.code === 200 && Array.isArray(response.data)) {
        // Mock API格式: { code: 200, message: '成功', data: [...] }
        setUsers(response.data);
      } else {
        console.error('API返回的数据格式不正确:', response);
        setUsers([]);
        message.error('获取用户列表失败: 返回数据格式不正确');
      }
    } catch (error) {
      console.error('获取用户列表失败:', error);
      message.error('获取用户列表失败: ' + (error.message || '未知错误'));
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  // 添加用户
  const handleAdd = async (values) => {
    try {
      // 导入MD5加密函数
      const { md5Encrypt } = await import('../../utils/commonUtils');
      
      // 创建一个新的对象，避免直接修改values
      const userData = { ...values };
      
      // 对密码进行MD5加密
      if (userData.password) {
        userData.password = md5Encrypt(userData.password);
      }
      
      // 删除确认密码字段，不需要发送到后端
      delete userData.confirmPassword;
      
      // 使用封装好的createUser函数
      await createUser(userData);
      message.success('添加成功');
      setAddModalVisible(false);
      form.resetFields();
      fetchUsers(); // 重新获取列表
    } catch (error) {
      message.error('添加失败: ' + error.message);
    }
  };

  // 编辑用户
  const handleEdit = async (values) => {
    try {
      // 使用封装好的updateUser函数
      await updateUser(currentUser.id, values);
      message.success('更新成功');
      setEditModalVisible(false);
      editForm.resetFields();
      fetchUsers(); // 重新获取列表
    } catch (error) {
      message.error('更新失败: ' + error.message);
    }
  };

  // 打开编辑模态框
  const showEditModal = (user) => {
    setCurrentUser(user);
    editForm.setFieldsValue({
      username: user.username,
      nickname: user.nickname,
      email: user.email,
      phoneNumber: user.phoneNumber,
      avatar: user.avatar,
      remark: user.remark,
    });
    setEditModalVisible(true);
  };

  // 删除用户
  const handleDelete = async (id) => {
    Modal.confirm({
      title: '确认删除',
      content: '确定要删除这个用户吗？',
      okText: '确认',
      cancelText: '取消',
      onOk: async () => {
        try {
          // 使用封装好的deleteUser函数
          await deleteUser(id);
          message.success('删除成功');
          fetchUsers(); // 重新获取列表
        } catch (error) {
          message.error('删除失败: ' + error.message);
        }
      },
    });
  };

  // 过滤用户列表
  const filteredUsers = Array.isArray(users) ? users.filter(user => 
    user && (user.username || user.nickname || user.email) && (
      (user.username && user.username.toLowerCase().includes(searchText.toLowerCase())) ||
      (user.nickname && user.nickname.toLowerCase().includes(searchText.toLowerCase())) ||
      (user.email && user.email.toLowerCase().includes(searchText.toLowerCase()))
    )
  ) : [];

  // 表格列定义
  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 80,
    },
    {
      title: '用户名',
      dataIndex: 'username',
      key: 'username',
    },
    {
      title: '邮箱',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: '电话号码',
      dataIndex: 'phoneNumber',
      key: 'phoneNumber',
    },
    {
      title: '昵称',
      dataIndex: 'nickname',
      key: 'nickname',
    },
    // {
    //   title: '角色',
    //   dataIndex: 'role',
    //   key: 'role',
    //   render: (role) => {
    //     const roleMap = {
    //       admin: '管理员',
    //       user: '普通用户',
    //       guest: '访客',
    //     };
    //     return roleMap[role] || role;
    //   },
    // },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      key: 'createTime',
      render:(createTime) =>{
        return  format(createTime, "yyyy年MM月dd日 HH:mm:ss", { locale: zhCN });

      }
    },
    {
      title: '备注',
      dataIndex: 'remark',
      key: 'remark',

    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Button 
            type="primary" 
            icon={<EditOutlined />} 
            size="small"
            onClick={() => showEditModal(record)}
          >
            编辑
          </Button>
          <Button 
            danger 
            icon={<DeleteOutlined />} 
            size="small"
            onClick={() => handleDelete(record.id)}
          >
            删除
          </Button>
        </Space>
      ),
    },
  ];

  // 初始加载
  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="user-list">
      <Card title="用户管理" 
        extra={
          <Space>
            <Input 
              placeholder="搜索用户" 
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              prefix={<SearchOutlined />}
              allowClear
            />
            <Button 
              type="primary" 
              icon={<PlusOutlined />}
              onClick={() => setAddModalVisible(true)}
            >
              添加用户
            </Button>
          </Space>
        }
      >
        <Table 
          columns={columns} 
          dataSource={filteredUsers} 
          rowKey="id" 
          loading={loading}
          pagination={{ 
            pageSize: 10,
            showTotal: (total) => `共 ${total} 条记录`,
          }}
        />
      </Card>

      {/* 添加用户模态框 */}
      <Modal
        title="添加用户"
        open={addModalVisible}
        onCancel={() => setAddModalVisible(false)}
        footer={null}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleAdd}
        >
          <Form.Item
            name="username"
            label="用户名"
            rules={[
              { required: true, message: '请输入用户名' },
              { min: 3, max: 50, message: '用户名长度应为3-50个字符' }
            ]}
          >
            <Input placeholder="请输入用户名（用于登录）" />
          </Form.Item>
          
          <Form.Item
            name="password"
            label="密码"
            rules={[
              { required: true, message: '请输入密码' },
              { min: 6, message: '密码长度至少为6个字符' }
            ]}
          >
            <Input.Password placeholder="请输入密码" />
          </Form.Item>
          
          <Form.Item
            name="confirmPassword"
            label="确认密码"
            dependencies={['password']}
            rules={[
              { required: true, message: '请确认密码' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('两次输入的密码不一致'));
                },
              }),
            ]}
          >
            <Input.Password placeholder="请再次输入密码" />
          </Form.Item>
          
          <Form.Item
            name="nickname"
            label="昵称"
          >
            <Input placeholder="请输入昵称（用于显示）" />
          </Form.Item>
          
          <Form.Item
            name="email"
            label="邮箱"
            rules={[
              { type: 'email', message: '请输入有效的邮箱地址' }
            ]}
          >
            <Input placeholder="请输入邮箱" />
          </Form.Item>
          
          <Form.Item
            name="phoneNumber"
            label="手机号"
            rules={[
              { pattern: /^1[3-9]\d{9}$/, message: '请输入有效的手机号码' }
            ]}
          >
            <Input placeholder="请输入手机号" />
          </Form.Item>
          
          <Form.Item
            name="avatar"
            label="头像URL"
          >
            <Input placeholder="请输入头像URL" />
          </Form.Item>
          
          <Form.Item
            name="remark"
            label="备注"
          >
            <Input.TextArea placeholder="请输入备注信息" rows={3} />
          </Form.Item>
          
          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                提交
              </Button>
              <Button onClick={() => setAddModalVisible(false)}>
                取消
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      {/* 编辑用户模态框 */}
      <Modal
        title="编辑用户"
        open={editModalVisible}
        onCancel={() => setEditModalVisible(false)}
        footer={null}
      >
        <Form
          form={editForm}
          layout="vertical"
          onFinish={handleEdit}
        >
          <Form.Item
            name="username"
            label="用户名"
            rules={[
              { required: true, message: '请输入用户名' },
              { min: 3, max: 50, message: '用户名长度应为3-50个字符' }
            ]}
          >
            <Input placeholder="请输入用户名（用于登录）" />
          </Form.Item>
          
          <Form.Item
            name="nickname"
            label="昵称"
          >
            <Input placeholder="请输入昵称（用于显示）" />
          </Form.Item>
          
          <Form.Item
            name="email"
            label="邮箱"
            rules={[
              { type: 'email', message: '请输入有效的邮箱地址' }
            ]}
          >
            <Input placeholder="请输入邮箱" />
          </Form.Item>
          
          <Form.Item
            name="phoneNumber"
            label="手机号"
            rules={[
              { pattern: /^1[3-9]\d{9}$/, message: '请输入有效的手机号码' }
            ]}
          >
            <Input placeholder="请输入手机号" />
          </Form.Item>
          
          <Form.Item
            name="avatar"
            label="头像URL"
          >
            <Input placeholder="请输入头像URL" />
          </Form.Item>
          
          <Form.Item
            name="remark"
            label="备注"
          >
            <Input.TextArea placeholder="请输入备注信息" rows={3} />
          </Form.Item>
          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                提交
              </Button>
              <Button onClick={() => setEditModalVisible(false)}>
                取消
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default UserList;