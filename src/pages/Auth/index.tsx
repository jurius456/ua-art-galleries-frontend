import React, { useState, type FormEvent, type ChangeEvent } from 'react';
import { Mail, Lock, User, AlertTriangle, Loader2 } from 'lucide-react'; 
import { useNavigate } from 'react-router-dom';

// адресу сервера
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL; 
console.log('API_BASE_URL:', API_BASE_URL);
interface FormErrors {
    name?: string;
    email?: string;
    password?: string;
    passwordConfirm?: string;
}

const AuthPage = () => {
    const navigate = useNavigate(); 
    
    const [isLogin, setIsLogin] = useState(true); 
    const [formData, setFormData] = useState({ 
        name: '', 
        email: '', 
        password: '', 
        passwordConfirm: '' 
    });
    const [errors, setErrors] = useState<FormErrors>({}); 
    const [loading, setLoading] = useState(false);
    const [apiError, setApiError] = useState<string | null>(null); 

    const toggleView = () => {
        setIsLogin(!isLogin);
        setFormData({ name: '', email: '', password: '', passwordConfirm: '' });
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
        
        if (!formData.email) {
            newErrors.email = "Будь ласка, введіть електронну пошту.";
        } else if (!emailRegex.test(formData.email)) {
            newErrors.email = "Невірний формат електронної пошти.";
        }

        if (!formData.password) {
            newErrors.password = "Будь ласка, введіть пароль.";
        } else if (formData.password.length < 6) {
            newErrors.password = "Пароль має містити мінімум 6 символів.";
        }

        if (!isLogin) {
            if (!formData.name) {
                newErrors.name = "Будь ласка, введіть ім'я користувача.";
            }
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
        
        // шлях до логіну та реєстрації
        const endpoint = isLogin ? '/auth/login/' : '/auth/register/';
        
        // ключі очікує Django 
        const payload = isLogin 
            ? { email: formData.email, password: formData.password }
            : { username: formData.name, email: formData.email, password: formData.password };

        try {
            const response = await fetch(`${API_BASE_URL}${endpoint}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            const data = await response.json();

            if (response.ok) {
                // назву поля з токеном (token, access або key)
                const token = data.token || data.access || data.key;
                
                if (token) {
                    localStorage.setItem('authToken', token); // Зберігаємо токен для входу
                    console.log('Успішно авторизовано!');
                    navigate('/profile'); 
                }
            } else {
                // Виводимо помилку від Django (наприклад, "Невірний пароль")
                setApiError(data.detail || data.message || "Помилка авторизації. Перевірте дані.");
            }

        } catch (error) {
            console.error('Network Error:', error);
            setApiError('Сервер недоступний. Перевірте з\'єднання або BASE_URL.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex justify-center items-center min-h-[calc(100vh-80px)] bg-gray-50">
            <div className="w-full max-w-md p-8 space-y-6 bg-white shadow-xl rounded-xl border border-gray-200">
                <h2 className="text-3xl font-extrabold text-gray-900 text-center">
                    {isLogin ? 'Вхід до системи' : 'Створення облікового запису'}
                </h2>

                <p className="text-center text-sm text-gray-500">
                    {isLogin ? "Немає облікового запису?" : "Вже є обліковий запис?"}
                    <button 
                        onClick={toggleView}
                        className="font-medium text-neutral-700 hover:text-neutral-500 ml-1 transition"
                    >
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

                    {!isLogin && (
                         <div className="relative">
                            <User size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                id="name"
                                name="name"
                                type="text"
                                placeholder="Ім'я користувача" 
                                value={formData.name}
                                onChange={handleChange}
                                className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-neutral-500 focus:border-neutral-500 
                                    ${errors.name ? 'border-red-500' : 'border-gray-300'}`}
                            />
                            {errors.name && (
                                <p className="flex items-center gap-1 mt-1 text-sm text-red-600">
                                    <AlertTriangle size={14} />
                                    {errors.name}
                                </p>
                            )}
                        </div>
                    )}

                    <div className="relative">
                        <Mail size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            id="email"
                            name="email"
                            type="email"
                            autoComplete="email"
                            placeholder="Електронна пошта" 
                            value={formData.email}
                            onChange={handleChange}
                            className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-neutral-500 focus:border-neutral-500 
                                ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
                        />
                         {errors.email && (
                            <p className="flex items-center gap-1 mt-1 text-sm text-red-600">
                                <AlertTriangle size={14} />
                                {errors.email}
                            </p>
                        )}
                    </div>

                    <div className="relative">
                        <Lock size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            id="password"
                            name="password"
                            type="password"
                            autoComplete={isLogin ? "current-password" : "new-password"}
                            placeholder="Пароль" 
                            value={formData.password}
                            onChange={handleChange}
                            className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-neutral-500 focus:border-neutral-500 
                                ${errors.password ? 'border-red-500' : 'border-gray-300'}`}
                        />
                        {errors.password && (
                            <p className="flex items-center gap-1 mt-1 text-sm text-red-600">
                                <AlertTriangle size={14} />
                                {errors.password}
                            </p>
                        )}
                    </div>

                    {!isLogin && (
                        <div className="relative">
                            <Lock size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                id="passwordConfirm"
                                name="passwordConfirm"
                                type="password"
                                placeholder="Підтвердіть пароль" 
                                value={formData.passwordConfirm}
                                onChange={handleChange}
                                className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-neutral-500 focus:border-neutral-500 
                                    ${errors.passwordConfirm ? 'border-red-500' : 'border-gray-300'}`}
                            />
                            {errors.passwordConfirm && (
                                <p className="flex items-center gap-1 mt-1 text-sm text-red-600">
                                    <AlertTriangle size={14} />
                                    {errors.passwordConfirm}
                                </p>
                            )}
                        </div>
                    )}
                    
                    <div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-lg font-medium text-white bg-neutral-800 hover:bg-neutral-600 transition disabled:bg-gray-500 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <Loader2 size={24} className="animate-spin" />
                            ) : (
                                isLogin ? 'Увійти' : 'Створити обліковий запис'
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AuthPage;