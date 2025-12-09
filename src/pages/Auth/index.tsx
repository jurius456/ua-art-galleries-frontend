import React, { useState, type FormEvent, type ChangeEvent } from 'react'; 
import { Mail, Lock, User, AlertTriangle } from 'lucide-react';

// Інтерфейс для зберігання помилок
interface FormErrors {
    name?: string;
    email?: string;
    password?: string;
    passwordConfirm?: string;
}

const AuthPage = () => {
    // 🚨 ВИПРАВЛЕНО СИНТАКСИС: Було setIsLogin = useState(true);
    const [isLogin, setIsLogin] = useState(true); 
    
    const [formData, setFormData] = useState({ 
        name: '', 
        email: '', 
        password: '', 
        passwordConfirm: '' 
    });
    // Стан для зберігання повідомлень про помилки
    const [errors, setErrors] = useState<FormErrors>({}); 

    const toggleView = () => {
        setIsLogin(!isLogin);
        // Очищаємо дані та помилки при перемиканні режиму
        setFormData({ name: '', email: '', password: '', passwordConfirm: '' });
        setErrors({}); 
    };

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
        // Очищаємо помилку, коли користувач починає вводити дані
        setErrors((prevErrors) => ({ ...prevErrors, [e.target.name]: undefined }));
    };

    // 🚨 ФУНКЦІЯ ВАЛІДАЦІЇ
    const validateForm = () => {
        const newErrors: FormErrors = {};
        // Regex для перевірки пошти
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        
        // 1. ПЕРЕВІРКИ ДЛЯ ОБОХ РЕЖИМІВ (LOGIN & REGISTER)

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

        // 2. ПЕРЕВІРКИ ТІЛЬКИ ДЛЯ РЕЄСТРАЦІЇ (REGISTER)
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


    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault(); // Запобігаємо стандартній відправці форми
        
        if (validateForm()) {
            console.log(`Форма валідна. Відправка даних: ${isLogin ? 'Вхід' : 'Реєстрація'}`);
        } else {
            // Валідація не пройдена, помилки відображаються
        }
    };

    return (
        <div className="flex justify-center items-center min-h-[calc(100vh-80px)] bg-gray-50">
            <div className="w-full max-w-md p-8 space-y-6 bg-white shadow-xl rounded-xl border border-gray-200">
                
                {/* Заголовок та Перемикач */}
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

                {/* --- Секція Форми --- */}
                <form className="space-y-6" onSubmit={handleSubmit} noValidate> {/* <-- noValidate ВИТОРКАЄ валідацію браузера */}
                    
                    {/* Ім'я користувача (Тільки для Реєстрації) */}
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
                            {/* Відображення помилки */}
                            {errors.name && (
                                <p className="flex items-center gap-1 mt-1 text-sm text-red-600">
                                    <AlertTriangle size={14} />
                                    {errors.name}
                                </p>
                            )}
                        </div>
                    )}

                    {/* Пошта */}
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

                    {/* Пароль */}
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

                    {/* Підтвердження паролю (Тільки для Реєстрації) */}
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
                    
                    {/* Кнопка відправки */}
                    <div>
                        <button
                            type="submit"
                            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-lg font-medium text-white bg-neutral-800 hover:bg-neutral-600 transition"
                        >
                            {isLogin ? 'Увійти' : 'Створити обліковий запис'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AuthPage;