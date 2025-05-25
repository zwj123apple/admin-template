import React from 'react';
import { Table as AntTable } from 'antd';
import './style.css';

/**
 * 自定义表格组件，封装Ant Design的Table组件
 * @param {Object} props - 组件属性
 * @returns {JSX.Element} 表格组件
 */
const Table = (props) => {
  const { className, pagination, ...rest } = props;
  
  // 默认分页配置
  const defaultPagination = {
    showSizeChanger: true,
    showQuickJumper: true,
    showTotal: (total) => `共 ${total} 条记录`,
    pageSize: 10,
    pageSizeOptions: ['10', '20', '50', '100'],
    ...(pagination || {})
  };
  
  return (
    <AntTable 
      className={`custom-table ${className || ''}`}
      pagination={pagination === false ? false : defaultPagination}
      {...rest}
    />
  );
};

export default Table;