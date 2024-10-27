import { useState, useCallback, useEffect } from "react";
import Cookies from "js-cookie";

let logoutTimer;

export const useAuth = () => {
  const [token, setToken] = useState(null);
  const [tokenExpirationDate, setTokenExpirationDate] = useState(null);
  const [role, setRole] = useState("");
  const [theme, setTheme] = useState("light");

  const login = useCallback((role, token, expirationDate) => {
    setToken(token);
    setRole(role);
    const tokenExpirationDate =
      expirationDate ||
      new Date(new Date().getTime() + 1000 * 60 * 60 * 24 * 7);
    setTokenExpirationDate(tokenExpirationDate);

    Cookies.set(
      "userData",
      JSON.stringify({
        role: role,
        token: token,
        expiration: tokenExpirationDate.toISOString(),
      }),
      { expires: 7 }
    );
  }, []);

  const logout = useCallback(() => {
    setToken(null);
    setTokenExpirationDate(null);
    setRole(null);
    setTheme("light"); 
    Cookies.remove("userData");
    Cookies.remove("theme");
  }, []);

  const toggleTheme = useCallback(() => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    Cookies.set("theme", newTheme, { expires: 7 });
    document.documentElement.setAttribute("data-theme", newTheme);
  }, [theme]);

  useEffect(() => {
    if (token && tokenExpirationDate) {
      const remainingTime =
        tokenExpirationDate.getTime() - new Date().getTime();
      logoutTimer = setTimeout(logout, remainingTime);
    } else {
      clearTimeout(logoutTimer);
    }
  }, [token, logout, tokenExpirationDate]);

  useEffect(() => {
    const storedData = Cookies.get("userData");
    if (storedData) {
      const parsedData = JSON.parse(storedData);
      if (parsedData.token && new Date(parsedData.expiration) > new Date()) {
        login(
          parsedData.role,
          parsedData.token,
          new Date(parsedData.expiration)
        );
      }
    }

    const storedTheme = Cookies.get("theme");
    if (storedTheme) {
      setTheme(storedTheme);
      document.documentElement.setAttribute("data-theme", storedTheme);
    }
  }, [login]);

  return { token, login, logout, role, theme, toggleTheme };
};
