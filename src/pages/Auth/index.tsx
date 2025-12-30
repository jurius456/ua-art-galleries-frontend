import React, { useState, type FormEvent, type ChangeEvent } from 'react';
import { Mail, Lock, User, AlertTriangle, Loader2 } from 'lucide-react'; 
import { useNavigate } from 'react-router-dom';


// const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const API_BASE_URL = 'http://localhost:8000';
interface FormErrors {
    username?: string;
    email?: string;
    password?: string;
    passwordConfirm?: string;
}

const AuthPage = () => {
    const navigate = useNavigate(); 
    
    const [isLogin, setIsLogin] = useState(true); 
    
    // Повернули поле email
    const [formData, setFormData] = useState({ 
        username: '', 
        email: '', 
        password: '', 
        passwordConfirm: '' 
    });
    
    const [errors, setErrors] = useState<FormErrors>({}); 
    const [loading, setLoading] = useState(false);
    const [apiError, setApiError] = useState<string | null>(null); 

    const toggleView = () => {
        setIsLogin(!isLogin);
        setFormData({ username: '', email: '', password: '', passwordConfirm: '' });
        setErrors({}); 
        setApiError(null);
    };

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
        setErrors((prevErrors) => ({ ...prevErrors, [e.target.name]: undefined }));
    };

    const validateForm = () => {
        const newErrors: FormErrors = {};
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        
        if (!formData.username.trim()) {
            newErrors.username = "Введіть ім'я користувача.";
        }

        // Валідація пошти тільки для реєстрації (або якщо логін через пошту)
        if (!isLogin) {
            if (!formData.email) {
                newErrors.email = "Введіть електронну пошту.";
            } else if (!emailRegex.test(formData.email)) {
                newErrors.email = "Невірний формат пошти.";
            }
        }

        if (!formData.password) {
            newErrors.password = "Введіть пароль.";
        }

        if (!isLogin) {
            if (formData.password !== formData.passwordConfirm) {
                newErrors.passwordConfirm = "Паролі не співпадають.";
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0; 
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault(); 
        setApiError(null); 

        if (!validateForm()) return;
        setLoading(true);
        
        const endpoint = isLogin ? '/api/auth/login/' : '/api/auth/register/';
        
        let payload;

        if (isLogin) {
            // Для входу відправляємо username і пароль
            payload = { 
                username: formData.username, 
                password: formData.password 
            };
        } else {
            // Для реєстрації додаємо EMAIL
            payload = { 
                username: formData.username, 
                email: formData.email, // <--- ВІДПРАВЛЯЄМО ПОШТУ
                password: formData.password,
                password2: formData.passwordConfirm 
            };
        }

        try {
            const response = await fetch(`${API_BASE_URL}${endpoint}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            const data = await response.json();

            if (response.ok) {
                const token = data.access || data.token;
                if (token) {
                    localStorage.setItem('authToken', token);
                    navigate('/profile'); 
                }
            } else {
                setApiError(data.detail || "Помилка авторизації. Перевірте дані.");
            }

        } catch (error) {
            console.error('Network Error:', error);
            setApiError('Сервер недоступний.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex justify-center items-center min-h-[calc(100vh-80px)] bg-gray-50">
            <div className="w-full max-w-md p-8 space-y-6 bg-white shadow-xl rounded-xl border border-gray-200">
                <h2 className="text-3xl font-extrabold text-gray-900 text-center">
                    {isLogin ? 'Вхід до системи' : 'Реєстрація'}
                </h2>

                <p className="text-center text-sm text-gray-500">
                    {isLogin ? "Немає облікового запису?" : "Вже є обліковий запис?"}
                    <button onClick={toggleView} className="font-medium text-neutral-700 hover:text-neutral-500 ml-1 transition">
                        {isLogin ? 'Зареєструватися' : 'Увійти'}
                    </button>
                </p>

                <form className="space-y-6" onSubmit={handleSubmit} noValidate>
                    {apiError && (
                        <div className="p-3 text-sm text-red-700 bg-red-100 rounded-lg flex items-center gap-2">
                            <AlertTriangle size={16} />
                            {apiError}
                        </div>
                    )}

                    {/* Username */}
                    <div className="relative">
                        <User size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            id="username" name="username" type="text"
                            placeholder="Ім'я користувача (Логін)" 
                            value={formData.username} onChange={handleChange}
                            className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-neutral-500 focus:border-neutral-500 ${errors.username ? 'border-red-500' : 'border-gray-300'}`}
                        />
                        {errors.username && <p className="text-sm text-red-600 mt-1">{errors.username}</p>}
                    </div>

                    {/* Email - Показуємо ТІЛЬКИ при реєстрації */}
                    {!isLogin && (
                        <div className="relative">
                            <Mail size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                id="email" name="email" type="email"
                                placeholder="Електронна пошта" 
                                value={formData.email} onChange={handleChange}
                                className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-neutral-500 focus:border-neutral-500 ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
                            />
                            {errors.email && <p className="text-sm text-red-600 mt-1">{errors.email}</p>}
                        </div>
                    )}

                    {/* Password */}
                    <div className="relative">
                        <Lock size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            id="password" name="password" type="password"
                            autoComplete={isLogin ? "current-password" : "new-password"}
                            placeholder="Пароль" 
                            value={formData.password} onChange={handleChange}
                            className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-neutral-500 focus:border-neutral-500 ${errors.password ? 'border-red-500' : 'border-gray-300'}`}
                        />
                        {errors.password && <p className="text-sm text-red-600 mt-1">{errors.password}</p>}
                    </div>

                    {/* Confirm Password */}
                    {!isLogin && (
                        <div className="relative">
                            <Lock size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                id="passwordConfirm" name="passwordConfirm" type="password"
                                placeholder="Підтвердіть пароль" 
                                value={formData.passwordConfirm} onChange={handleChange}
                                className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-neutral-500 focus:border-neutral-500 ${errors.passwordConfirm ? 'border-red-500' : 'border-gray-300'}`}
                            />
                            {errors.passwordConfirm && <p className="text-sm text-red-600 mt-1">{errors.passwordConfirm}</p>}
                        </div>
                    )}
                    
                    <button type="submit" disabled={loading} className="w-full py-3 px-4 rounded-lg text-white bg-neutral-800 hover:bg-neutral-600 transition disabled:bg-gray-500">
                        {loading ? <Loader2 size={24} className="animate-spin mx-auto" /> : (isLogin ? 'Увійти' : 'Створити акаунт')}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AuthPage;