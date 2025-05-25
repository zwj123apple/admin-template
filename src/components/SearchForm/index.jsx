import React from 'react';
import { Form, Row, Col, Button } from 'antd';
import './style.css';

/**
 * 通用搜索表单组件
 * @param {Object} props - 组件属性
 * @param {Array} props.items - 搜索项配置
 * @param {Function} props.onSearch - 搜索回调函数
 * @param {Function} props.onReset - 重置回调函数
 * @returns {JSX.Element} 搜索表单组件
 */
const SearchForm = (props) => {
  const { items = [], onSearch, onReset, className = '', ...rest } = props;
  const [form] = Form.useForm();

  // 处理搜索
  const handleSearch = () => {
    const values = form.getFieldsValue();
    onSearch && onSearch(values);
  };

  // 处理重置
  const handleReset = () => {
    form.resetFields();
    onReset && onReset();
  };

  return (
    <div className={`search-form ${className}`}>
      <Form form={form} layout="horizontal" {...rest}>
        <Row gutter={16}>
          {items.map((item, index) => (
            <Col key={index} xs={24} sm={12} md={8} lg={6}>
              <Form.Item label={item.label} name={item.name}>
                {item.render()}
              </Form.Item>
            </Col>
          ))}
          <Col xs={24} sm={12} md={8} lg={6}>
            <Form.Item className="search-form-btns">
              <Button type="primary" onClick={handleSearch}>搜索</Button>
              <Button onClick={handleReset}>重置</Button>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </div>
  );
};

export default SearchForm;