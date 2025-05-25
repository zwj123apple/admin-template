import React from 'react';
import { Input as AntInput } from 'antd';
import './style.css';

/**
 * 自定义输入框组件，封装Ant Design的Input组件
 * @param {Object} props - 组件属性
 * @returns {JSX.Element} 输入框组件
 */
const Input = (props) => {
  const { className, ...rest } = props;
  
  return (
    <AntInput className={`custom-input ${className || ''}`} {...rest} />
  );
};

// 导出输入框类型
Input.Password = (props) => {
  const { className, ...rest } = props;
  return <AntInput.Password className={`custom-input ${className || ''}`} {...rest} />;
};

Input.TextArea = (props) => {
  const { className, ...rest } = props;
  return <AntInput.TextArea className={`custom-input ${className || ''}`} {...rest} />;
};

Input.Search = (props) => {
  const { className, ...rest } = props;
  return <AntInput.Search className={`custom-input ${className || ''}`} {...rest} />;
};

export default Input;