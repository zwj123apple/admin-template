import React from 'react';
import { Modal } from 'antd';
import './style.css';

/**
 * 通用确认弹窗组件
 * @param {Object} props - 组件属性
 * @param {boolean} props.visible - 是否可见
 * @param {Function} props.onCancel - 取消回调函数
 * @param {Function} props.onOk - 确认回调函数
 * @param {string} props.title - 标题
 * @param {string} props.content - 内容
 * @returns {JSX.Element} 确认弹窗组件
 */
const ConfirmModal = (props) => {
  const { 
    visible, 
    onCancel, 
    onOk, 
    title = '确认操作', 
    content = '确定要执行此操作吗？',
    okText = '确定',
    cancelText = '取消',
    okButtonProps = { danger: true },
    ...rest 
  } = props;
  
  return (
    <Modal
      title={title}
      open={visible}
      onCancel={onCancel}
      onOk={onOk}
      okText={okText}
      cancelText={cancelText}
      okButtonProps={okButtonProps}
      className="confirm-modal"
      destroyOnClose
      {...rest}
    >
      <div className="confirm-modal-content">
        {content}
      </div>
    </Modal>
  );
};

export default ConfirmModal;