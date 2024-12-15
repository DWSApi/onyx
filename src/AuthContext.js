import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isAdmin, setIsAdmin] = useState(false);

    // Проверка, если токен есть, то устанавливаем isAdmin в true
    useEffect(() => {
        const storedIsAdmin = localStorage.getItem("isAdmin") === "true"; // Пример получения роли из localStorage
        setIsAdmin(storedIsAdmin);
    }, []);

    return (
        <AuthContext.Provider value={{ isAdmin }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};
