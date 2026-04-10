import { Link } from "react-router-dom";
import { useTranslation } from 'react-i18next';
import { ArrowLeft } from "lucide-react";

const PartnersPage = () => {
    const { t } = useTranslation();
    return (
        <div className="container mx-auto px-6 py-32 max-w-4xl text-center">
            <Link to="/" className="inline-flex items-center gap-2 text-zinc-500 hover:text-black transition-colors mb-20 font-bold text-xs uppercase tracking-widest">
                <ArrowLeft size={14} /> {t('common.backToHome') || 'Back'}
            </Link>

            <div className="bg-zinc-50 rounded-[40px] p-20 text-center space-y-6">
                <div className="text-6xl mb-8">😉</div>
                <h1 className="text-3xl md:text-4xl font-black text-zinc-900 uppercase tracking-tight">
                    {t('partners.noStats') || "Немає партнерів"}
                </h1>
                <p className="text-zinc-500 font-medium text-lg max-w-lg mx-auto leading-relaxed">
                    {t('partners.description') || "Ми відкриті до співпраці! Якщо ви хочете стати нашим партнером, напишіть нам."}
                </p>
                <div className="pt-8">
                    <a href="mailto:uadbgallery@gmail.com" className="px-8 py-4 bg-black text-white rounded-full font-bold uppercase tracking-widest text-xs hover:scale-105 transition-transform inline-block">
                        uadbgallery@gmail.com
                    </a>
                </div>
            </div>
        </div>
    );
};

export default PartnersPage;
