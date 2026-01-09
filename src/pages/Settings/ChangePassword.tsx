import { Lock, ShieldCheck, ArrowRight } from "lucide-react";

const ChangePasswordPage = () => {
  return (
    <div className="max-w-md animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* Скляна картка у стилі Dropdown */}
      <div className="bg-white/90 backdrop-blur-2xl border border-gray-100 rounded-[32px] shadow-[0_20px_50px_rgba(0,0,0,0.05)] p-8 space-y-8">
        
        {/* Заголовок */}
        <section className="space-y-1">
          <p className="text-[10px] font-black uppercase tracking-[0.25em] text-zinc-500">Безпека</p>
          <h2 className="text-xl font-bold text-black">Зміна пароля</h2>
        </section>

        {/* Форма */}
        <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
          
          <div className="space-y-5">
            <PasswordInput 
              label="Поточний пароль" 
              placeholder="••••••••" 
            />
            
            <div className="pt-2 space-y-5 border-t border-gray-100">
              <PasswordInput 
                label="Новий пароль" 
                placeholder="Мінімум 8 символів" 
              />
              <PasswordInput 
                label="Підтвердження" 
                placeholder="Повторіть пароль" 
              />
            </div>
          </div>

          {/* Кнопка */}
          <button className="group w-full py-4 bg-black text-white rounded-2xl flex items-center justify-center gap-3 hover:bg-neutral-800 transition-all duration-300">
            <span className="text-[11px] font-black uppercase tracking-[0.2em] ml-2">
              Оновити дані
            </span>
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </form>

        {/* Порада */}
        <div className="flex items-center gap-3 px-4 py-3 bg-blue-50/40 rounded-2xl border border-blue-100/50">
          <ShieldCheck className="text-blue-600" size={16} />
          <p className="text-[11px] text-blue-800 font-semibold leading-tight">
            Пароль має бути надійним та унікальним.
          </p>
        </div>
      </div>
    </div>
  );
};

/* Контрастний інпут */
const PasswordInput = ({ label, placeholder }: { label: string; placeholder: string }) => (
  <div className="space-y-2 group">
    <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 group-focus-within:text-black transition-colors">
      {label}
    </label>
    <div className="relative">
      <input 
        type="password"
        placeholder={placeholder}
        /* Збільшили контраст тексту та плейсхолдера */
        className="w-full text-sm font-bold text-black border-b border-gray-200 focus:border-black focus:outline-none bg-transparent pb-2 transition-all placeholder:text-gray-400"
      />
      <Lock size={14} className="absolute right-0 top-0 text-gray-300 group-focus-within:text-black transition-colors" />
    </div>
  </div>
);

export default ChangePasswordPage;