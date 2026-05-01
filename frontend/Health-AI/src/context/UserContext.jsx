import { createContext, useContext, useEffect, useState } from "react";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [userId, setUserIdState] = useState(() => {
    return localStorage.getItem("loggedInUserId") || "";
  });

  const [user, setUserState] = useState(() => {
    const savedUser = localStorage.getItem("loggedInUser");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const login = (userData) => {
    setUserState(userData);
    setUserIdState(userData.id);

    localStorage.setItem("loggedInUser", JSON.stringify(userData));
    localStorage.setItem("loggedInUserId", userData.id);
  };

  const logout = () => {
    setUserState(null);
    setUserIdState("");

    localStorage.removeItem("loggedInUser");
    localStorage.removeItem("loggedInUserId");
    localStorage.removeItem("selectedUserId");
  };

  const setUserId = (id) => {
    setUserIdState(id);

    if (id) {
      localStorage.setItem("loggedInUserId", id);
    } else {
      localStorage.removeItem("loggedInUserId");
    }
  };

  useEffect(() => {
    if (userId) {
      localStorage.setItem("loggedInUserId", userId);
    }
  }, [userId]);

  return (
    <UserContext.Provider
      value={{
        user,
        userId,
        isAuthenticated: Boolean(userId),
        login,
        logout,
        setUserId,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);