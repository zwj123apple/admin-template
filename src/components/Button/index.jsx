import React from 'react';
import { Button as AntButton } from 'antd';
import './style.css';

/**
 * 自定义按钮组件，封装Ant Design的Button组件
 * @param {Object} props - 组件属性
 * @returns {JSX.Element} 按钮组件
 */
const Button = (props) => {
  const { children, className, ...rest } = props;
  
  return (
    <AntButton className={`custom-button ${className || ''}`} {...rest}>
      {children}
    </AntButton>
  );
};

// 导出按钮类型
Button.Primary = (props) => <Button type="primary" {...props} />;
Button.Default = (props) => <Button {...props} />;
Button.Danger = (props) => <Button type="primary" danger {...props} />;
Button.Link = (props) => <Button type="link" {...props} />;

export default Button;