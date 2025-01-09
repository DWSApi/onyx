import axios from 'axios';

const api = axios.create({
    baseURL: process.env.REACT_APP_API_URL || "http://localhost:5000",  // Использование переменной окружения для API URL
    headers: {
        "Content-Type": "application/json",
    },
});

// Регистрация
export const register = async (name, email, password) => {
    try {
        console.log("Sending registration data:", { name, email, password }); 
        const response = await api.post("/register", { name, email, password });
        return response.data;
    } catch (error) {
        console.error("Registration error:", error.response ? error.response.data : error.message);

        // Если сервер вернул конкретное сообщение об ошибке
        if (error.response && error.response.data) {
            const serverMessage = error.response.data.error || error.response.data.message || "Ошибка регистрации"; 
            throw new Error(serverMessage);
        }
        

        // Если сообщение отсутствует, выбрасываем стандартное
        throw new Error("Registration failed. Please try again.");
    }
};




// Логин
export const login = async (email, password) => {
    console.log(`Logging in with email: ${email}`);
    try {
        const response = await api.post('/login', { email, password });  // Исправлено на '/login'
        console.log("Login API response:", response.data);
        return response.data;
    } catch (error) {
        console.error("Login API error:", error);
        throw error;
    }
};

// Получение данных о текущем пользователе
export const getAccountData = async (token) => {
    const response = await fetch("http://localhost:5000/account", {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${token}`,
        },
    });

    if (!response.ok) {
        throw new Error('Ошибка при получении данных о пользователе');
    }

    return await response.json();
};

export const getAccountDatas = async (token) => {
    const response = await fetch("http://localhost:5000/apps", {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${token}`,
        },
    });

    if (!response.ok) {
        throw new Error('Ошибка при получении данных о пользователе');
    }

    return await response.json();
};

// Получение всех пользователей (админский маршрут)
export const getAllUsers = async (token) => {
    console.log("Fetching all users...");
    try {
        const response = await api.get('/admin/users', {  // Исправлено на '/admin/users'
            headers: { 'Authorization': `Bearer ${token}` }
        });
        console.log("All users data:", response.data);
        return response.data;
    } catch (error) {
        console.error("Error fetching all users:", error);
        throw error;
    }
};

// Удаление пользователя
export const deleteUser = async (id, token) => {
    console.log(`Deleting user with ID: ${id}`);
    try {
        const response = await api.delete(`/admin/users/${id}`, {  // Исправлено на '/admin/users/{id}'
            headers: { 'Authorization': `Bearer ${token}` }
        });
        console.log("Delete user response:", response.data);
        return response.data;
    } catch (error) {
        console.error("Error deleting user:", error);
        throw error;
    }
};

export default api;
