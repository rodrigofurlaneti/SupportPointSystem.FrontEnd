import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';
import { Fragment, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { toast } from 'sonner';
import {
    LoginRequestSchema,
    RegisterCompanySchema,
    type LoginRequest,
    type RegisterCompanyRequest
} from '../../schemas/auth.schema';
import { useLogin } from '../../hooks/useAuth';
import { authApi } from '../../api/auth.api';
import { Input } from '../../components/Input';
import { Button } from '../../components/Button';
import logoImg from '../../assets/logotipo.png';

function formatCpf(value: string): string {
    const digits = value.replace(/\D/g, '').slice(0, 11);
    return digits
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
}

function formatCnpj(value: string): string {
    const digits = value.replace(/\D/g, '').slice(0, 14);
    return digits
        .replace(/^(\d{2})(\d)/, '$1.$2')
        .replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3')
        .replace(/\.(\d{3})(\d)/, '.$1/$2')
        .replace(/(\d{4})(\d)/, '$1-$2');
}

export default function LoginPage() {
    const { t, i18n } = useTranslation();
    const login = useLogin();
    const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);

    // Form de Login
    const {
        register,
        handleSubmit,
        setValue,
        watch,
        formState: { errors },
    } = useForm<LoginRequest>({
        resolver: zodResolver(LoginRequestSchema),
    });

    // Form de Registro de Empresa
    const {
        register: regForm,
        handleSubmit: handleRegSubmit,
        setValue: setRegValue,
        watch: watchReg,
        formState: { errors: regErrors, isSubmitting: regLoading },
        reset: resetRegForm
    } = useForm<RegisterCompanyRequest>({
        resolver: zodResolver(RegisterCompanySchema),
    });

    const cpfValue = watch('cpf', '');
    const regCpfValue = watchReg('cpf', '');
    const regCnpjValue = watchReg('cnpj', '');

    // Handlers de Máscara
    const handleCpfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setValue('cpf', formatCpf(e.target.value));
    };

    const handleRegCpfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setRegValue('cpf', formatCpf(e.target.value));
    };

    const handleRegCnpjChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setRegValue('cnpj', formatCnpj(e.target.value));
    };

    // Submissão de Login
    const onSubmitLogin = (data: LoginRequest) => {
        login.mutate(data);
    };

    // Submissão de Registro
    const onRegisterSubmit = async (data: RegisterCompanyRequest) => {
        try {
            await authApi.register(data);
            toast.success(t('register_success_msg') || "Empresa registrada com sucesso!");
            setIsRegisterModalOpen(false);
            resetRegForm();
        } catch (error: any) {
            const errorMessage = error.response?.data?.description || "Erro ao registrar empresa.";
            toast.error(errorMessage);
        }
    };

    return (
        <div className="min-h-screen bg-check-blue flex items-center justify-center p-4 text-white relative">

            {/* Seletor de Idioma */}
            <div className="absolute top-6 right-6 flex items-center gap-2">
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">
                    {t('language')}:
                </span>
                <select
                    onChange={(e) => i18n.changeLanguage(e.target.value)}
                    value={i18n.language}
                    className="bg-check-card border border-white/10 text-[10px] font-bold rounded-lg p-2 outline-none cursor-pointer uppercase transition-all hover:bg-white/10"
                >
                    <option value="pt">Português 🇧🇷</option>
                    <option value="en">English 🇺🇸</option>
                    <option value="es">Español 🇪🇸</option>
                    <option value="fr">Français 🇫🇷</option>
                    <option value="zh">中文 🇨🇳</option>
                </select>
            </div>

            {/* Card de Login */}
            <div className="w-full max-w-md bg-check-card p-8 rounded-[2.5rem] shadow-2xl border border-white/5 flex flex-col items-center transition-all">
                <img src={logoImg} alt="Logo" className="w-44 mb-8" />
                <p className="text-slate-400 mb-8 text-sm text-center">{t('login_subtitle')}</p>

                <form onSubmit={handleSubmit(onSubmitLogin)} className="w-full space-y-4">
                    <Input
                        label={t('cpf')}
                        placeholder="000.000.000-00"
                        value={cpfValue}
                        onChange={handleCpfChange}
                        error={errors.cpf?.message}
                    />
                    <Input
                        label={t('password')}
                        isPassword
                        placeholder="••••••••"
                        error={errors.password?.message}
                        {...register('password')}
                    />
                    <Button type="submit" loading={login.isPending}>
                        {t('enter_system')}
                    </Button>
                </form>

                {/* Chamada para Registro (SaaS Conversion) */}
                <div className="mt-8 pt-6 border-t border-white/5 w-full text-center">
                    <p className="text-xs text-slate-400">
                        {t('not_a_client')}{' '}
                        <button
                            type="button"
                            onClick={() => setIsRegisterModalOpen(true)}
                            className="text-white hover:text-blue-400 font-bold underline underline-offset-4 transition-all"
                        >
                            {t('register_your_company') || "Registre sua empresa"}
                        </button>
                    </p>
                </div>

                <p className="mt-8 text-[10px] text-slate-500 font-bold uppercase tracking-[0.2em]">
                    FSI Point System • 2026
                </p>
            </div>

            {/* Modal de Registro de Nova Empresa */}
            <Transition appear show={isRegisterModalOpen} as={Fragment}>
                <Dialog as="div" className="relative z-50" onClose={() => setIsRegisterModalOpen(false)}>
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm" />
                    </Transition.Child>

                    <div className="fixed inset-0 overflow-y-auto">
                        <div className="flex min-h-full items-center justify-center p-4 text-center">
                            <Transition.Child
                                as={Fragment}
                                enter="ease-out duration-300"
                                enterFrom="opacity-0 scale-95"
                                enterTo="opacity-100 scale-100"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100 scale-100"
                                leaveTo="opacity-0 scale-95"
                            >
                                <Dialog.Panel className="w-full max-w-2xl transform overflow-hidden rounded-[2rem] bg-check-card border border-white/10 p-10 text-left align-middle shadow-2xl transition-all text-white">
                                    <Dialog.Title as="h3" className="text-2xl font-bold leading-6 mb-2">
                                        {t('register_title') || "Criar nova conta administrativa"}
                                    </Dialog.Title>
                                    <p className="text-slate-400 text-sm mb-8">
                                        {t('register_description') || "Registre sua empresa e comece a gerenciar seus pontos de suporte hoje mesmo."}
                                    </p>

                                    <form onSubmit={handleRegSubmit(onRegisterSubmit)} className="space-y-6">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                            {/* Seção Gestor */}
                                            <div className="md:col-span-2">
                                                <h4 className="text-blue-400 text-[10px] font-bold uppercase tracking-[0.15em] border-b border-white/5 pb-2">
                                                    {t('manager_data') || "Dados do Administrador"}
                                                </h4>
                                            </div>
                                            <Input label={t('name')} placeholder="Nome completo" error={regErrors.name?.message} {...regForm('name')} />
                                            <Input label={t('cpf')} placeholder="000.000.000-00" value={regCpfValue} onChange={handleRegCpfChange} error={regErrors.cpf?.message} />
                                            <div className="md:col-span-2">
                                                <Input label={t('password')} isPassword placeholder="Mínimo 8 caracteres" error={regErrors.password?.message} {...regForm('password')} />
                                            </div>

                                            {/* Seção Empresa */}
                                            <div className="md:col-span-2 mt-4">
                                                <h4 className="text-blue-400 text-[10px] font-bold uppercase tracking-[0.15em] border-b border-white/5 pb-2">
                                                    {t('company_data') || "Dados da Empresa"}
                                                </h4>
                                            </div>
                                            <Input label={t('trade_name') || "Nome Fantasia"} placeholder="Ex: FSI Suporte" error={regErrors.tradeName?.message} {...regForm('tradeName')} />
                                            <Input label={t('cnpj') || "CNPJ"} placeholder="00.000.000/0000-00" value={regCnpjValue} onChange={handleRegCnpjChange} error={regErrors.cnpj?.message} />
                                            <div className="md:col-span-2">
                                                <Input label={t('legal_name') || "Razão Social"} placeholder="Nome empresarial completo" error={regErrors.legalName?.message} {...regForm('legalName')} />
                                            </div>
                                        </div>

                                        <div className="mt-8 flex flex-col md:flex-row gap-3">
                                            <Button type="submit" loading={regLoading}>
                                                {t('create_account') || "Finalizar Cadastro"}
                                            </Button>
                                            <button
                                                type="button"
                                                className="px-8 py-3 text-xs font-bold text-slate-500 hover:text-white transition-all uppercase tracking-widest"
                                                onClick={() => setIsRegisterModalOpen(false)}
                                            >
                                                {t('cancel_button')}
                                            </button>
                                        </div>
                                    </form>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition>
        </div>
    );
}