import "./App.css";
import React from "react";
import { useNavigate, Route, Routes, Navigate } from "react-router-dom";
import Header from "./components/Header/Header";
import Form from "./components/Form/Form";
import ItemList from "./components/Item/ItemList";
import Login from "./components/Auth/Login";
import Register from "./components/Auth/Register";
import Profile from "./components/Profile/Profile";
import ForgotPassword from "./components/ForgotPassword/ForgotPassword";
import { AuthContext } from "./components/context/auth-context";
import { useAuth } from "./components/hooks/auth-hook";

function App() {
  const navigate = useNavigate();
  const { token, login, logout, role } = useAuth();
  let routes;

  if (token) {
    if (role === "user") {
      routes = (
        <Routes>
          <Route path="/todos" element={<ItemList />}></Route>
          <Route path="/new" element={<Form />}></Route>
          <Route path="/profile" element={<Profile />}></Route>
          <Route path="/update" element={<Form updateMode={true} />}></Route>
          <Route path="/*" element={<Navigate to="/todos" replace />} />
        </Routes>
      );
    } else {
      routes = (
        <Routes>
          <Route path="/" element={<ItemList />}></Route>
          <Route path="/new" element={<Form />}></Route>
          <Route path="/update" element={<Form updateMode={true} />}></Route>
          <Route path="/*" element={<Navigate to="/" replace />} />
        </Routes>
      );
    }
  } else {
    routes = (
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/todos" element={<ItemList />}></Route>
        <Route path="/register" element={<Register />} />
        <Route path="/reset-password" element={<ForgotPassword />} />{" "}
        <Route path="/*" element={<Navigate to="/login" replace />} />
      </Routes>
    );
  }

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn: !!token,
        token: token,
        role: role,
        login: login,
        logout: logout,
      }}
    >
      <React.Fragment>
        <Header />
        {routes}
        <div className="addNote-box">
          <button onClick={() => navigate("/new")}>ADD</button>
        </div>
      </React.Fragment>
    </AuthContext.Provider>
  );
}

export default App;
