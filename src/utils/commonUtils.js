/**
 * 通用工具函数
 * 包含常用的辅助函数，如防抖、节流、深拷贝等
 */

/**
 * 防抖函数
 * 在连续触发事件时，只在最后一次触发事件后等待指定时间后执行函数
 * @param {Function} fn - 要执行的函数
 * @param {number} delay - 延迟时间（毫秒）
 * @returns {Function} 防抖处理后的函数
 */
export const debounce = (fn, delay = 300) => {
  let timer = null;
  
  return function(...args) {
    const context = this;
    
    if (timer) {
      clearTimeout(timer);
    }
    
    timer = setTimeout(() => {
      fn.apply(context, args);
      timer = null;
    }, delay);
  };
};

/**
 * 节流函数
 * 在连续触发事件时，每隔一段时间只执行一次函数
 * @param {Function} fn - 要执行的函数
 * @param {number} interval - 间隔时间（毫秒）
 * @returns {Function} 节流处理后的函数
 */
export const throttle = (fn, interval = 300) => {
  let lastTime = 0;
  
  return function(...args) {
    const context = this;
    const now = Date.now();
    
    if (now - lastTime >= interval) {
      fn.apply(context, args);
      lastTime = now;
    }
  };
};

/**
 * 深拷贝函数
 * @param {any} obj - 要拷贝的对象
 * @returns {any} 拷贝后的对象
 */
export const deepClone = (obj) => {
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }
  
  // 处理日期对象
  if (obj instanceof Date) {
    return new Date(obj.getTime());
  }
  
  // 处理数组
  if (Array.isArray(obj)) {
    return obj.map(item => deepClone(item));
  }
  
  // 处理普通对象
  const clonedObj = {};
  Object.keys(obj).forEach(key => {
    clonedObj[key] = deepClone(obj[key]);
  });
  
  return clonedObj;
};

/**
 * 生成唯一ID
 * @param {string} [prefix=''] - ID前缀
 * @returns {string} 唯一ID
 */
export const generateUniqueId = (prefix = '') => {
  const timestamp = Date.now().toString(36);
  const randomStr = Math.random().toString(36).substr(2, 5);
  return `${prefix}${timestamp}-${randomStr}`;
};

/**
 * 格式化金额
 * @param {number} amount - 金额
 * @param {number} [decimals=2] - 小数位数
 * @param {string} [thousandsSep=','] - 千分位分隔符
 * @param {string} [decimalSep='.'] - 小数点分隔符
 * @returns {string} 格式化后的金额字符串
 */
export const formatMoney = (amount, decimals = 2, thousandsSep = ',', decimalSep = '.') => {
  if (isNaN(amount)) {
    return '0.00';
  }
  
  const fixedAmount = parseFloat(amount).toFixed(decimals);
  const [intPart, decimalPart] = fixedAmount.split('.');
  
  const formattedIntPart = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, thousandsSep);
  
  return decimalPart ? `${formattedIntPart}${decimalSep}${decimalPart}` : formattedIntPart;
};

/**
 * 获取URL参数
 * @param {string} [name] - 参数名，不传则返回所有参数对象
 * @param {string} [url] - URL，不传则使用当前页面URL
 * @returns {string|Object|null} 参数值或参数对象
 */
export const getUrlParams = (name, url) => {
  const urlStr = url || window.location.href;
  const queryString = urlStr.indexOf('?') > -1 ? urlStr.split('?')[1] : '';
  
  if (!queryString) {
    return name ? null : {};
  }
  
  const params = {};
  queryString.split('&').forEach(param => {
    const [key, value] = param.split('=');
    params[decodeURIComponent(key)] = decodeURIComponent(value || '');
  });
  
  return name ? params[name] || null : params;
};

/**
 * 将对象转换为URL查询字符串
 * @param {Object} params - 参数对象
 * @returns {string} URL查询字符串
 */
export const objectToQueryString = (params) => {
  if (!params || typeof params !== 'object') {
    return '';
  }
  
  return Object.keys(params)
    .filter(key => params[key] != null) // 过滤掉null和undefined
    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
    .join('&');
};

/**
 * 将数组转换为树形结构
 * @param {Array} array - 原始数组
 * @param {Object} options - 配置选项
 * @param {string} [options.id='id'] - ID字段名
 * @param {string} [options.parentId='parentId'] - 父ID字段名
 * @param {string} [options.children='children'] - 子节点字段名
 * @returns {Array} 树形结构数组
 */
export const arrayToTree = (array, options = {}) => {
  const {
    id = 'id',
    parentId = 'parentId',
    children = 'children'
  } = options;
  
  const result = [];
  const map = {};
  
  // 创建节点映射
  array.forEach(item => {
    map[item[id]] = { ...item, [children]: [] };
  });
  
  // 构建树形结构
  array.forEach(item => {
    const node = map[item[id]];
    
    if (item[parentId] && map[item[parentId]]) {
      // 有父节点，添加到父节点的children中
      map[item[parentId]][children].push(node);
    } else {
      // 没有父节点或父节点不存在，作为根节点
      result.push(node);
    }
  });
  
  return result;
};

/**
 * 将树形结构转换为扁平数组
 * @param {Array} tree - 树形结构数组
 * @param {Object} options - 配置选项
 * @param {string} [options.children='children'] - 子节点字段名
 * @returns {Array} 扁平化后的数组
 */
export const treeToArray = (tree, options = {}) => {
  const { children = 'children' } = options;
  const result = [];
  
  const flatten = (nodes, parent = null) => {
    nodes.forEach(node => {
      const clonedNode = { ...node };
      
      if (parent) {
        clonedNode.parent = parent;
      }
      
      const childNodes = clonedNode[children];
      delete clonedNode[children];
      
      result.push(clonedNode);
      
      if (childNodes && childNodes.length > 0) {
        flatten(childNodes, clonedNode);
      }
    });
  };
  
  flatten(tree);
  return result;
};

// 导入MD5库
import md5 from 'js-md5';

/**
 * MD5加密
 * @param {string} str - 要加密的字符串
 * @returns {string} MD5加密后的字符串
 */
export const md5Encrypt = (str) => {
  if (!str) return '';
  return md5(str);
};

export default {
  debounce,
  throttle,
  deepClone,
  generateUniqueId,
  formatMoney,
  getUrlParams,
  objectToQueryString,
  arrayToTree,
  treeToArray,
  md5Encrypt
};