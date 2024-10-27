import React from "react";
import { Modal } from "antd";

const ErrorModal = ({ error, clearError, title = "An Error Occurred" }) => {
  return (
    <Modal
      title={title}
      visible={!!error} 
      onOk={clearError}
      onCancel={clearError}
    >
      <p>{error}</p>
    </Modal>
  );
};

export default ErrorModal;
