/**
 * 数据验证工具函数
 */

/**
 * 验证邮箱格式
 * @param {string} email - 邮箱地址
 * @returns {boolean} 是否为有效邮箱
 */
export const isValidEmail = (email) => {
  const regex = /^[\w-]+(\.[\w-]+)*@[\w-]+(\.[\w-]+)+$/;
  return regex.test(email);
};

/**
 * 验证手机号格式（中国大陆）
 * @param {string} phone - 手机号码
 * @returns {boolean} 是否为有效手机号
 */
export const isValidPhone = (phone) => {
  const regex = /^1[3-9]\d{9}$/;
  return regex.test(phone);
};

/**
 * 验证URL格式
 * @param {string} url - URL地址
 * @returns {boolean} 是否为有效URL
 */
export const isValidUrl = (url) => {
  try {
    new URL(url);
    return true;
  } catch (e) {
    return false;
  }
};

/**
 * 验证身份证号（中国大陆）
 * @param {string} idCard - 身份证号
 * @returns {boolean} 是否为有效身份证号
 */
export const isValidIdCard = (idCard) => {
  const regex = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
  return regex.test(idCard);
};

/**
 * 验证密码强度
 * @param {string} password - 密码
 * @param {Object} options - 选项
 * @param {number} options.minLength - 最小长度，默认8
 * @param {boolean} options.requireLowercase - 是否要求小写字母，默认true
 * @param {boolean} options.requireUppercase - 是否要求大写字母，默认true
 * @param {boolean} options.requireNumber - 是否要求数字，默认true
 * @param {boolean} options.requireSpecial - 是否要求特殊字符，默认true
 * @returns {Object} 包含isValid和message的对象
 */
export const validatePassword = (password, options = {}) => {
  const {
    minLength = 8,
    requireLowercase = true,
    requireUppercase = true,
    requireNumber = true,
    requireSpecial = true
  } = options;
  
  const result = {
    isValid: true,
    message: ''
  };
  
  if (!password || password.length < minLength) {
    result.isValid = false;
    result.message = `密码长度不能少于${minLength}位`;
    return result;
  }
  
  if (requireLowercase && !/[a-z]/.test(password)) {
    result.isValid = false;
    result.message = '密码必须包含小写字母';
    return result;
  }
  
  if (requireUppercase && !/[A-Z]/.test(password)) {
    result.isValid = false;
    result.message = '密码必须包含大写字母';
    return result;
  }
  
  if (requireNumber && !/\d/.test(password)) {
    result.isValid = false;
    result.message = '密码必须包含数字';
    return result;
  }
  
  if (requireSpecial && !/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    result.isValid = false;
    result.message = '密码必须包含特殊字符';
    return result;
  }
  
  return result;
};

/**
 * 验证表单字段
 * @param {Object} values - 表单值对象
 * @param {Object} rules - 验证规则
 * @returns {Object} 验证结果，包含errors对象
 */
export const validateForm = (values, rules) => {
  const errors = {};
  
  Object.keys(rules).forEach(field => {
    const fieldRules = rules[field];
    const value = values[field];
    
    // 必填验证
    if (fieldRules.required && (value === undefined || value === null || value === '')) {
      errors[field] = fieldRules.message || `${field}不能为空`;
      return;
    }
    
    // 自定义验证函数
    if (fieldRules.validator && typeof fieldRules.validator === 'function') {
      const result = fieldRules.validator(value, values);
      if (result !== true) {
        errors[field] = result;
        return;
      }
    }
    
    // 正则验证
    if (fieldRules.pattern && value) {
      const pattern = typeof fieldRules.pattern === 'string' 
        ? new RegExp(fieldRules.pattern)
        : fieldRules.pattern;
        
      if (!pattern.test(value)) {
        errors[field] = fieldRules.message || `${field}格式不正确`;
        return;
      }
    }
    
    // 长度验证
    if (value && fieldRules.min !== undefined && value.length < fieldRules.min) {
      errors[field] = fieldRules.message || `${field}长度不能小于${fieldRules.min}`;
      return;
    }
    
    if (value && fieldRules.max !== undefined && value.length > fieldRules.max) {
      errors[field] = fieldRules.message || `${field}长度不能大于${fieldRules.max}`;
      return;
    }
  });
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

export default {
  isValidEmail,
  isValidPhone,
  isValidUrl,
  isValidIdCard,
  validatePassword,
  validateForm
};