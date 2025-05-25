import Mock from 'mockjs';

// 模拟用户数据
const users = Mock.mock({
  'list|10-50': [{
    'id|+1': 1,
    name: '@cname',
    email: '@email',
    'status|1': ['active', 'inactive'],
    'role|1': ['admin', 'user', 'guest'],
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=@word',
    createTime: '@datetime',
    address: '@county(true)',
    phone: /^1[3-9]\d{9}$/,
  }],
});

// 模拟登录接口
Mock.mock('/api/login', 'post', (options) => {
  const { username, password } = JSON.parse(options.body);
  if (username === 'admin' && password === '123456') {
    return {
      code: 200,
      message: '登录成功',
      data: {
        token: 'mock-token-' + Date.now(),
        userInfo: {
          id: 1,
          username: 'admin',
          name: '管理员',
          avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=admin',
          roles: ['admin'],
        },
      },
    };
  } else {
    return {
      code: 401,
      message: '用户名或密码错误',
      data: null,
    };
  }
});

// 模拟获取用户列表接口
Mock.mock('/api/users', 'get', () => {
  return {
    code: 200,
    message: '获取成功',
    data: users.list,
  };
});

// 模拟删除用户接口
Mock.mock(new RegExp('/api/users/\\d+'), 'delete', () => {
  return {
    code: 200,
    message: '删除成功',
    data: null,
  };
});

// 模拟添加用户接口
Mock.mock('/api/users', 'post', (options) => {
  const newUser = JSON.parse(options.body);
  newUser.id = Mock.Random.id(); // 生成随机ID
  newUser.createTime = Mock.Random.datetime(); // 生成创建时间
  users.list.unshift(newUser); // 添加到列表开头
  
  return {
    code: 200,
    message: '添加成功',
    data: newUser,
  };
});

// 模拟更新用户接口
Mock.mock(new RegExp('/api/users/\\d+'), 'put', (options) => {
  const updatedUser = JSON.parse(options.body);
  const url = options.url;
  const id = parseInt(url.match(/\/api\/users\/(\d+)/)[1]);
  
  // 查找并更新用户
  const index = users.list.findIndex(user => user.id === id);
  if (index !== -1) {
    users.list[index] = { ...users.list[index], ...updatedUser };
  }
  
  return {
    code: 200,
    message: '更新成功',
    data: users.list[index],
  };
});

export default Mock;