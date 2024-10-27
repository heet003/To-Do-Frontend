import React, { useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Form, Input, Typography, Button, message, Modal } from "antd";
import { AuthContext } from "../context/auth-context";
import { useAuth } from "../hooks/auth-hook";
import { useHttpClient } from "../hooks/http-hook";
import "./Auth.css";
import LoadingSpinner from "../UIElements/LoadingSpinner";

const { Text } = Typography;

const Auth = () => {
  const { theme } = useAuth();
  const navigate = useNavigate();
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const auth = useContext(AuthContext);
  const [form] = Form.useForm();

  const handleSubmit = async (values) => {
    let responseData;

    try {
      responseData = await sendRequest(
        `${process.env.REACT_APP_BACKEND_USERS}/login`,
        "POST",
        JSON.stringify(values),
        {
          "Content-Type": "application/json",
        }
      );
      message.success("Logged In Successfully! Refresh Once.");
      auth.login(responseData.role, responseData.token);
      setTimeout(() => {
        navigate("/chats");
      }, 5000);
    } catch (err) {
      message.error(err.message || "Something went wrong!");
    }
  };

  return (
    <React.Fragment>
      {isLoading && <LoadingSpinner asOverlay />}
      {error && (
        <Modal title="An Error Occurred" visible={!!error} onOk={clearError}>
          <p>{error}</p>
        </Modal>
      )}
      <div className={`auth-container ${theme}`}>
        <h2>{"Login"}</h2>
        <Form
          form={form}
          onFinish={handleSubmit}
          layout="vertical"
          className="auth-form"
        >
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
            rules={[{ required: true, message: "Please input your password!" }]}
            style={{ fontSize: "1rem" }}
          >
            <Input.Password />
          </Form.Item>
          <Text>
            <Link to="/reset-password" style={{ fontSize: "0.7rem" }}>
              Forgot your password?
            </Link>
          </Text>

          <Form.Item>
            <Button
              style={{ fontSize: "1rem" }}
              type="primary"
              htmlType="submit"
              block
            >
              {"Login"}
            </Button>
          </Form.Item>
        </Form>
        <Text className="auth-text " style={{ fontSize: "0.9rem" }}>
          {"Don't have an account?"}
          <Link
            className="auth-button"
            style={{ fontSize: "0.9rem" }}
            to={`/register`}
          >
            Sign Up Now
          </Link>
        </Text>
      </div>
    </React.Fragment>
  );
};

export default Auth;
