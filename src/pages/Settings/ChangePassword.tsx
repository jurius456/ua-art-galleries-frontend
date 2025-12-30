import { useNavigate } from "react-router-dom";

const ChangePasswordPage = () => {
  const navigate = useNavigate();

  return (
    <div className="pt-6 border-t space-y-4">
      <h2 className="text-lg font-semibold">Зміна пароля</h2>

      <div className="space-y-3">
        <input
          type="password"
          placeholder="Поточний пароль"
          className="w-full px-4 py-2 border rounded-lg"
        />
        <input
          type="password"
          placeholder="Новий пароль"
          className="w-full px-4 py-2 border rounded-lg"
        />
        <input
          type="password"
          placeholder="Підтвердіть новий пароль"
          className="w-full px-4 py-2 border rounded-lg"
        />
      </div>

      <div className="flex gap-3 pt-2">
        <button className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800">
          Зберегти
        </button>
        <button
          onClick={() => navigate("/settings")}
          className="px-4 py-2 border rounded-lg hover:bg-gray-50"
        >
          Скасувати
        </button>
      </div>
    </div>
  );
};

export default ChangePasswordPage;
