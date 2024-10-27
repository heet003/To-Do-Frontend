import React, { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Form, Input, Typography, Button, message, Upload } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { AuthContext } from "../context/auth-context";
import { useAuth } from "../hooks/auth-hook";
import { useHttpClient } from "../hooks/http-hook";
import "./Auth.css";
import LoadingSpinner from "../UIElements/LoadingSpinner";
import ErrorModal from "../UIElements/ErrorModal";

const { Text } = Typography;


const Auth = () => {
  const { theme } = useAuth();
  const navigate = useNavigate();
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const auth = useContext(AuthContext);
  const [imageFile, setImageFile] = useState(null);
  const [form] = Form.useForm();

  const handleImageInput = (info) => {
    if (info.fileList.length > 0) {
      const file = info.fileList[0].originFileObj;
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageFile(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (values) => {
    let responseData;

    try {
      responseData = await sendRequest(
        `${process.env.REACT_APP_BACKEND_USERS}/signup`,
        "POST",
        JSON.stringify({
          ...values,
          image: imageFile,
        }),
        {
          "Content-Type": "application/json",
        }
      );
      message.success("Sign Up Successful! Refresh Once.");
      
      auth.login(responseData.role, responseData.token);
      navigate("/chats");
    } catch (err) {
      message.error(err.message || "Something went wrong!");
    }
  };

  return (
    <React.Fragment>
      {isLoading && <LoadingSpinner asOverlay />}
      {error && (
        <ErrorModal
          error={error}
          title="An Error Occurred"
          visible={!!error}
          onOk={clearError}
        />
      )}
      <div className={`auth-container ${theme}`}>
        <h2>Signup</h2>
        <Form
          form={form}
          onFinish={handleSubmit}
          layout="vertical"
          className="auth-form"
        >
          <Form.Item
            label="Name"
            name="name"
            rules={[{ required: true, message: "Please input your name!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Email"
            name="email"
            rules={[{ required: true, message: "Please input your email!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Password"
            name="password"
            rules={[
              { required: true, message: "Please input your password!" },
              //   { validator: passwordValidator },
            ]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item label="Image">
            <Upload beforeUpload={() => false} onChange={handleImageInput}>
              <Button icon={<UploadOutlined />}>Click to Upload</Button>
            </Upload>
          </Form.Item>
          <Form.Item>
            <Button
              style={{ fontSize: "1rem" }}
              type="primary"
              htmlType="submit"
              block
            >
              Sign Up
            </Button>
          </Form.Item>
        </Form>
        <Text className="auth-text " style={{ fontSize: "0.9rem" }}>
          Already have an account?
          <Link
            className="auth-button"
            style={{ fontSize: "0.9rem" }}
            to={`/login`}
          >
            Login Now
          </Link>
        </Text>
      </div>
    </React.Fragment>
  );
};

export default Auth;
