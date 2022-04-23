import React, { useState, useEffect, useCallback } from "react";

let logoutTimer;
const AuthContext = React.createContext({
  token: "",
  isLoggedIn: false,
  login: (token) => {},
  logout: () => {},
  username: "",
});

const calculateRemainingTime = (expTime) => {
  const ctime = new Date().getTime();
  const adjTime = new Date(expTime).getTime();
  const remTime = adjTime - ctime;
  return remTime;
};

const retriveStoredToken = () => {
  const username = localStorage.getItem("username");
  const storedToken = localStorage.getItem("token");
  const expiresInTime = localStorage.getItem("tokenExpiresIn");
  const remainingTime = calculateRemainingTime(expiresInTime);
  if (remainingTime <= 3600) {
    localStorage.removeItem("token");
    localStorage.removeItem("tokenExpiresIn");
    localStorage.removeItem("username");
    return null;
  }
  return {
    token: storedToken,
    duration: remainingTime,
    username: username,
  };
};

export const AuthContextProvider = (props) => {
  const tokenData = retriveStoredToken();
  let initalToken;
  let initalUsername;
  if (tokenData) {
    initalToken = tokenData.token;
    initalUsername = tokenData.username;
  }

  const [token, setToken] = useState(initalToken);
  const [username, setUsername] = useState(initalUsername);

  const userIsLoggedIn = !!token;

  const logoutHandler = useCallback(() => {
    setToken(null);
    localStorage.removeItem("token");
    localStorage.removeItem("tokenExpiresIn");
    localStorage.removeItem("username");
    if (logoutTimer) {
      clearTimeout(logoutTimer);
    }
  }, []);

  const loginHandler = (token, username, expTime) => {
    localStorage.setItem("token", token);
    localStorage.setItem("tokenExpiresIn", expTime);
    localStorage.setItem("username", username);
    setToken(token);
    setUsername(username);
    const remTime = calculateRemainingTime(expTime);
    logoutTimer = setTimeout(logoutHandler, remTime);
  };

  const contextValue = {
    token: token,
    isLoggedIn: userIsLoggedIn,
    login: loginHandler,
    logout: logoutHandler,
    username: username,
  };

  useEffect(() => {
    if (tokenData) {
      console.log(tokenData.duration);
      logoutTimer = setTimeout(logoutHandler, tokenData.duration);
    }
  }, [tokenData, logoutHandler]);

  return (
    <AuthContext.Provider value={contextValue}>
      {props.children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
