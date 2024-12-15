import React, { useState } from "react";
import { login } from './utils/api';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from "jwt-decode";  // Изменен импорт

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");  
    const navigate = useNavigate();  

    const handleLogin = async (e) => {
        e.preventDefault(); // Останавливает перезагрузку страницы при отправке формы
        console.log("Attempting login...");
        setError("");  

        try {
            const response = await login(email, password);
            console.log("Login response:", response);
    
            if (response.token) {
                console.log("Login successful. Token:", response.token);
                localStorage.setItem("token", response.token);  
    
                // Декодирование токена для извлечения isAdmin
                const decodedToken = jwtDecode(response.token); // Используем jwtDecode
                const isAdmin = decodedToken.isAdmin || false;
                console.log("User is admin:", isAdmin);
                localStorage.setItem("isAdmin", isAdmin ? "true" : "false");
    
                navigate("/");  
            } else {
                console.log("Login failed. Invalid credentials.");
                setError("Не удалось войти. Проверьте введенные данные.");
            }
        } catch (error) {
            console.error("Login error:", error);
            setError("Ошибка при логине. Пожалуйста, попробуйте снова.");
        }
    };
    
    return (
        <div>
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
