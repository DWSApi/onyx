import React, { useState, useEffect } from "react";
import { getAllUsers, deleteUser, getAccountData } from "./utils/api"; 
import { useNavigate } from "react-router-dom"; 

const AdminPanel = () => {
    const [users, setUsers] = useState([]);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUsers = async () => {
            console.log("Fetching users...");
            const token = localStorage.getItem("token");
            if (!token) {
                console.log("Token not found.");
                setError("Токен не найден");
                navigate("/login"); 
                return;
            }

            try {
                // Получаем данные текущего пользователя
                console.log("Fetching current user...");
                const currentUser = await getAccountData(token);
                console.log("Current user:", currentUser);  // Логируем все данные                

                // Проверка, является ли текущий пользователь администратором (если isAdmin == 1)
                console.log("isAdmin value:", currentUser.isAdmin);  // Логируем значение isAdmin
                if (currentUser.isAdmin != 1) {
                    console.log("User is not admin.");
                    setError("У вас нет прав для доступа к этой странице.");
                    navigate("/"); 
                    return;
                }
                
                

                // Получаем список всех пользователей
                console.log("Fetching all users...");
                const data = await getAllUsers(token);
                console.log("Users data:", data);
                setUsers(data);
            } catch (error) {
                console.error("Error fetching users:", error);
                setError("Ошибка подключения к серверу.");
            }
        };

        fetchUsers();
    }, [navigate]);

    const handleDeleteUser = async (id) => {
        console.log(`Deleting user with id ${id}...`);
        const token = localStorage.getItem("token");
        if (!token) {
            console.log("Token not found.");
            setError("Токен не найден");
            return;
        }

        try {
            const data = await deleteUser(id, token);
            console.log("Delete response:", data);
            if (data.success) {
                setUsers((prevUsers) => prevUsers.filter((user) => user.id !== id));  // Обновление списка пользователей
            } else {
                setError(data.message || "Не удалось удалить пользователя.");
            }
        } catch (error) {
            console.error("Error deleting user:", error);
            setError("Ошибка удаления пользователя.");
        }
    };

    return (
        <div className="admin-panel">
            <h2>Панель администратора</h2>
            {error && <p className="error">{error}</p>}
            {users.length > 0 ? (
                <ul className="Admins">
                    {users.map((user) => (
                        <li key={user.id}>
                            {user.name} ({user.email})
                            <button className="bntAdm" onClick={() => handleDeleteUser(user.id)}>
                                Удалить
                            </button>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>Пользователи не найдены.</p>
            )}
        </div>
    );
};

export default AdminPanel;
