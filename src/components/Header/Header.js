import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../hooks/auth-hook";
import { Modal, Button, Drawer } from "antd";
import { MenuOutlined } from "@ant-design/icons";
import "./Header.css";

function Header() {
  const { token, logout } = useAuth();
  const [drawerVisible, setDrawerVisible] = useState(false);

  const confirmLogout = () => {
    Modal.confirm({
      title: "Confirm Logout",
      content: "Are you sure you want to log out?",
      okText: "Yes",
      cancelText: "No",
      onOk: () => logout(),
    });
  };

  const showDrawer = () => {
    setDrawerVisible(true);
  };

  const closeDrawer = () => {
    setDrawerVisible(false);
  };

  const navItems = (
    <>
      <li className="header__nav-item">
        <Link to="/todos" className="header__link">
          Home
        </Link>
      </li>
      {token && (
        <>
          <li className="header__nav-item">
            <Link to="/new" className="header__link">
              Add
            </Link>
          </li>
          <li className="header__nav-item">
            <Link to="/profile" className="header__link">
              Profile
            </Link>
          </li>
        </>
      )}
      {token ? (
        <li className="header__nav-item header__button-item">
          <Button
            onClick={confirmLogout}
            className="header__button header__button--logout"
            type="primary"
            danger
          >
            Logout
          </Button>
        </li>
      ) : (
        <li className="header__nav-item header__button-item">
          <Link to="/" className="header__button header__button--signin">
            Sign In
          </Link>
        </li>
      )}
    </>
  );

  return (
    <header className="header">
      <div className="header__container">
        <h1 className="header__title">To-Do-List</h1>
        <nav className="header__nav">
          <ul className="header__nav-list">{navItems}</ul>
          <Button
            className="header__menu-button"
            icon={<MenuOutlined />}
            onClick={showDrawer}
          />
        </nav>
      </div>

      <Drawer
        title="Navigation"
        placement="right"
        onClose={closeDrawer}
        visible={drawerVisible}
        className="header__drawer"
      >
        <ul className="header__drawer-list">{navItems}</ul>
      </Drawer>
    </header>
  );
}

export default Header;
