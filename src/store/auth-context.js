import React, { useState, useEffect, useCallback } from "react";

let logoutTimer;
const AuthContext = React.createContext({
  token: "",
  isLoggedIn: false,
  login: (token) => {},
  logout: () => {},
});

const calculateRemainingTime = (expTime) => {
  const ctime = new Date().getTime();
  const adjTime = new Date(expTime).getTime();
  const remTime = adjTime - ctime;
  return remTime;
};

const retriveStoredToken = () => {
  const storedToken = localStorage.getItem("token");
  const expiresInTime = localStorage.getItem("tokenExpiresIn");
  const remainingTime = calculateRemainingTime(expiresInTime);
  if (remainingTime <= 3600) {
    localStorage.removeItem("token");
    localStorage.removeItem("tokenExpiresIn");
    return null;
  }
  return {
    token: storedToken,
    duration: remainingTime,
  };
};

export const AuthContextProvider = (props) => {
  const tokenData = retriveStoredToken();
  let initalToken;
  if (tokenData) {
    initalToken = tokenData.token;
  }

  const [token, setToken] = useState(initalToken);

  const userIsLoggedIn = !!token;

  const logoutHandler = useCallback(() => {
    setToken(null);
    localStorage.removeItem("token");
    localStorage.removeItem("tokenExpiresIn");
    if (logoutTimer) {
      clearTimeout(logoutTimer);
    }
  }, []);

  const loginHandler = (token, expTime) => {
    localStorage.setItem("token", token);
    localStorage.setItem("tokenExpiresIn", expTime);
    setToken(token);
    const remTime = calculateRemainingTime(expTime);
    logoutTimer = setTimeout(logoutHandler, remTime);
  };

  const contextValue = {
    token: token,
    isLoggedIn: userIsLoggedIn,
    login: loginHandler,
    logout: logoutHandler,
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
