import { useTranslation } from 'react-i18next';

const LanguageSwitcher = () => {
    const { i18n } = useTranslation();

    const changeLanguage = (lng: string) => {
        i18n.changeLanguage(lng);
        localStorage.setItem('language', lng);
    };

    const currentLang = i18n.language;

    return (
        <div className="relative group">
            <button className="flex items-center gap-2 px-3 py-2 rounded-xl border border-gray-50 bg-white hover:bg-gray-50 transition-all shadow-sm">
                <span className="text-lg">
                    {currentLang === 'uk' ? '🇺🇦' : '🇬🇧'}
                </span>
            </button>

            {/* Dropdown */}
            <div className="absolute right-0 top-full mt-2 w-32 bg-white border border-gray-100 rounded-xl shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 overflow-hidden">
                <button
                    onClick={() => changeLanguage('uk')}
                    className={`w-full px-4 py-3 text-left text-sm font-semibold hover:bg-gray-50 transition-colors flex items-center gap-2 ${currentLang === 'uk' ? 'bg-gray-50 text-black' : 'text-gray-600'
                        }`}
                >
                    🇺🇦 Українська
                </button>
                <button
                    onClick={() => changeLanguage('en')}
                    className={`w-full px-4 py-3 text-left text-sm font-semibold hover:bg-gray-50 transition-colors flex items-center gap-2 ${currentLang === 'en' ? 'bg-gray-50 text-black' : 'text-gray-600'
                        }`}
                >
                    🇬🇧 English
                </button>
            </div>
        </div>
    );
};

export default LanguageSwitcher;
