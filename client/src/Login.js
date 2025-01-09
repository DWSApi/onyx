import React, { useState } from "react";
import { login } from './utils/api';
import { useNavigate } from 'react-router-dom';
import { decode } from "jwt-decode"; // Исправленный импорт
import { useAuth } from "./AuthContext"; // Импорт контекста авторизации

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();
    const { updateAuthState } = useAuth(); // Используем функцию для обновления состояния

    const handleLogin = async (e) => {
        e.preventDefault();
        setError(""); // Очистить предыдущие ошибки

        try {
            const response = await login(email, password);
            if (response.token) {
                const decodedToken = decode(response.token);  // Используем decode вместо jwtDecode
                console.log("Decoded Token:", decodedToken);  // Логирование для отладки

                const isAdmin = decodedToken.isAdmin || false;
                const name = decodedToken.name;  // Получаем имя из токена
                const role = decodedToken.role || "";  // Получаем роль из токена

                // Обновляем состояние в контексте
                updateAuthState(response.token, role, name); // Передаем корректные данные

                // Перенаправляем на главную страницу после логина
                navigate("/");  
            } else {
                setError("Не удалось войти. Проверьте введенные данные.");
            }
        } catch (error) {
            console.error("Login error:", error);
            setError("Ошибка при логине. Пожалуйста, попробуйте снова.");
        }
    };

    return (
        <div className="Login">
            <h2>Login</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <form onSubmit={handleLogin}>
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email"
                    required
                />
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    required
                />
                <button type="submit">Login</button>
            </form>
        </div>
    );
};

export default Login;
