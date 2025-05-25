import React from 'react';
import { Modal, Form, Spin } from 'antd';
import './style.css';

/**
 * 通用详情弹窗组件
 * @param {Object} props - 组件属性
 * @param {boolean} props.visible - 是否可见
 * @param {Function} props.onCancel - 取消回调函数
 * @param {Function} props.onOk - 确认回调函数
 * @param {Object} props.data - 表单数据
 * @param {boolean} props.loading - 加载状态
 * @param {Array} props.items - 表单项配置
 * @returns {JSX.Element} 详情弹窗组件
 */
const DetailModal = (props) => {
  const { 
    visible, 
    onCancel, 
    onOk, 
    title = '详情', 
    data = {}, 
    loading = false,
    items = [],
    width = 600,
    ...rest 
  } = props;
  
  const [form] = Form.useForm();
  
  // 当数据变化时，重置表单
  React.useEffect(() => {
    if (visible && data) {
      form.setFieldsValue(data);
    }
  }, [visible, data, form]);
  
  // 处理确认
  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      onOk && onOk(values);
    } catch (error) {
      console.error('表单验证失败:', error);
    }
  };
  
  return (
    <Modal
      title={title}
      open={visible}
      onCancel={onCancel}
      onOk={handleOk}
      width={width}
      destroyOnClose
      {...rest}
    >
      <Spin spinning={loading}>
        <Form
          form={form}
          layout="vertical"
          initialValues={data}
        >
          {items.map((item, index) => (
            <Form.Item
              key={index}
              label={item.label}
              name={item.name}
              rules={item.rules}
            >
              {item.render()}
            </Form.Item>
          ))}
        </Form>
      </Spin>
    </Modal>
  );
};

export default DetailModal;