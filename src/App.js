import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from "react-router-dom";
import { Navigate } from "react-router-dom";
import "./App.css";
import Register from "./Register";
import Login from "./Login";
import AdminPanel from "./Admin";
import { getAccountData } from './utils/api'; // Подключение правильного импорта
import { useAuth } from "./AuthContext"; // Хук для контекста

function App() {
  return (
    <Router>
      <div className="app">
        <Header />
        <Routes>
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Home />} />
          <Route path="/admin" element={<ProtectedRoute><AdminPanel /></ProtectedRoute>} />
          <Route path="/services" element={<Services />} />
          <Route path="/support" element={<Support />} />
          <Route path="/account" element={<Account />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

const Header = () => {
  const { isAdmin } = useAuth(); // Получаем isAdmin из контекста

  if (isAdmin === undefined) {
    return <div>Loading...</div>; // Пока состояние не определено
  }

  return (
    <header className="header">
      <div className="logo">EnergoSales</div>
      <nav>
        <Link to="/">Home</Link>
        <Link to="/services">Services</Link>
        <Link to="/support">Support</Link>
        <Link to="/account">My Account</Link>
        <Link to="/contact">Contact</Link>
        {isAdmin && <Link to="/admin">Admin Panel</Link>}
        <Link to="/Login">Login</Link>
        <Link to="/Register">Register</Link>
      </nav>
    </header>
  );
};

function ProtectedRoute({ children }) {
  const isAdmin = localStorage.getItem("isAdmin") === "true";
  return isAdmin ? children : <Navigate to="/" />;
}

// Home Component
function Home() {
  return (
    <div className="home">
      <h1>Welcome to EnergoSales</h1>
      <p>Your trusted partner in energy management and sustainable solutions.</p>
      <Link to="/services" className="btn">Explore Our Services</Link>
    </div>
  );
}

// Services Component
function Services() {
  const services = [
    { title: "Billing and Payments", description: "Manage and pay your bills effortlessly." },
    { title: "Energy Efficiency Solutions", description: "Optimize your energy consumption." },
    { title: "Sustainable Energy Options", description: "Switch to renewable energy sources." },
  ];
  return (
    <div className="services">
      <h2>Our Services</h2>
      <div className="service-cards">
        {services.map((service, index) => (
          <div key={index} className="card">
            <h3>{service.title}</h3>
            <p>{service.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// Support Component
function Support() {
  return (
    <div className="support">
      <h2>Customer Support</h2>
      <p>Need assistance? We're here to help!</p>
      <ul>
        <li>FAQs and Knowledge Base</li>
        <li>Live Chat Support</li>
        <li>Call us at 1-800-ENERGY</li>
      </ul>
    </div>
  );
}

// Account Component
function Account() {
  const [account, setAccount] = useState(null);
  const [error, setError] = useState("");
  const navigate = useNavigate();  // Хук для навигации

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }
  
    const fetchAccountData = async () => {
      try {
        const data = await getAccountData(token); // Получаем данные пользователя
        setAccount(data); // Сохраняем их в состояние
      } catch (error) {
        console.error("Ошибка при получении данных пользователя:", error);
        setError("Ошибка при загрузке данных пользователя.");
      }
    };
  
    fetchAccountData();
  }, [navigate]);  // добавлен navigate в зависимости
  

  // Функция выхода
  const handleLogout = () => {
    localStorage.removeItem("token"); // Удаляем токен
    navigate("/login"); // Перенаправляем на страницу входа
  };

  if (error) {
    return <div className="account"><p>{error}</p></div>;
  }

  if (!account) {
    return <div className="account"><p>Загрузка...</p></div>;
  }

  return (
    <div className="account">
      <h2>Мой аккаунт</h2>
      <p>Имя: {account.name}</p>
      <p>Email: {account.email}</p>
      <p>Текущий баланс: {account.balance}</p>
      <button className="btn">Заплатить сейчас</button>

      {/* Кнопка "Выйти" */}
      <button className="btn logout" onClick={handleLogout}>
        Выйти
      </button>
    </div>
  );
}

// Contact Component
function Contact() {
  return (
    <div className="contact">
      <h2>Contact Us</h2>
      <form>
        <label>
          Name:
          <input type="text" name="name" required />
        </label>
        <label>
          Email:
          <input type="email" name="email" required />
        </label>
        <label>
          Message:
          <textarea name="message" required></textarea>
        </label>
        <button type="submit">Send</button>
      </form>
    </div>
  );
}

// Footer Component
function Footer() {
  return (
    <footer className="footer">
      <p>&copy; 2024 EnergoSales. All rights reserved.</p>
      <nav>
        <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">Facebook</a>
        <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">Twitter</a>
        <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">LinkedIn</a>
      </nav>
    </footer>
  );
}

export default App;
