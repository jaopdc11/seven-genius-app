import React, { useState } from 'react';
import { login } from '../services/authService';
import { useNavigate } from 'react-router-dom';
import Toast from './Toast';

interface LoginProps {
    onLogin: (token: string) => void;
}

const WavesBackground = () => (
    <div className="absolute inset-0 -z-10 overflow-hidden">
        <svg
            className="w-full h-full"
            viewBox="0 0 1440 320"
            xmlns="http://www.w3.org/2000/svg"
            preserveAspectRatio="none"
        >
            <path
                fill="#2b7a00"
                fillOpacity="1"
                d="M0,64L60,90.7C120,117,240,171,360,176C480,181,600,139,720,144C840,149,960,203,1080,202.7C1200,203,1320,149,1380,122.7L1440,96L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z"
            >
                <animate
                    attributeName="d"
                    dur="10s"
                    repeatCount="indefinite"
                    values="
          M0,64L60,90.7C120,117,240,171,360,176C480,181,600,139,720,144C840,149,960,203,1080,202.7C1200,203,1320,149,1380,122.7L1440,96L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z;
          M0,96L60,128C120,160,240,224,360,240C480,256,600,224,720,208C840,192,960,192,1080,181.3C1200,171,1320,149,1380,138.7L1440,128L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z;
          M0,64L60,90.7C120,117,240,171,360,176C480,181,600,139,720,144C840,149,960,203,1080,202.7C1200,203,1320,149,1380,122.7L1440,96L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z
          "
                />
            </path>
            <path
                fill="#3a9b00"
                fillOpacity="0.6"
                d="M0,224L60,197.3C120,171,240,117,360,96C480,75,600,85,720,112C840,139,960,181,1080,202.7C1200,224,1320,224,1380,224L1440,224L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z"
            >
                <animate
                    attributeName="d"
                    dur="8s"
                    repeatCount="indefinite"
                    values="
          M0,224L60,197.3C120,171,240,117,360,96C480,75,600,85,720,112C840,139,960,181,1080,202.7C1200,224,1320,224,1380,224L1440,224L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z;
          M0,192L60,213.3C120,235,240,277,360,266.7C480,256,600,192,720,176C840,160,960,192,1080,213.3C1200,235,1320,245,1380,250.7L1440,256L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z;
          M0,224L60,197.3C120,171,240,117,360,96C480,75,600,85,720,112C840,139,960,181,1080,202.7C1200,224,1320,224,1380,224L1440,224L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z
          "
                />
            </path>
        </svg>
    </div>
);

const Login: React.FC<LoginProps> = ({ onLogin }) => {
    const navigate = useNavigate();

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (loading) return;

        setLoading(true);
        setToast(null);

        await new Promise(resolve => setTimeout(resolve, 1500));

        try {
            const token = await login(username, password);

            if (!token) {
                setToast({ message: "Login falhou, token vazio", type: "error" });
                setLoading(false);
                return;
            }

            setToast({ message: "Login aprovado! Bem-vindo", type: "success" });

            onLogin(token);

            // Delayzinho antes de navegar pra parecer mais suave
            setTimeout(() => {
                navigate('/upload');
                setLoading(false);
            }, 500);
        } catch (error) {
            console.error('Erro no login:', error);
            setToast({ message: "Erro no login, tenta de novo", type: "error" });
            setLoading(false);
        }
    };

    return (
        <>
            <WavesBackground />

            <div className="flex items-center justify-center h-screen w-screen">
                <div
                    className="w-full max-w-md p-12 rounded-3xl shadow-2xl
                        bg-white bg-opacity-30
                        backdrop-filter backdrop-blur-xl
                        border border-white border-opacity-40
                        text-white
                        flex flex-col items-center
                        animate-fade-in"
                    style={{ minHeight: '480px' }}
                >
                    {/* Logo */}
                    <div className="mb-6 w-24 h-24 bg-white bg-opacity-30 rounded-full flex items-center justify-center shadow-lg">
                        <img
                            src="/logo.png"
                            alt="SevenGenius Logo"
                            className="rounded-full"
                            draggable="false"
                        />
                    </div>

                    <h2 className="text-3xl font-bold mb-8 text-center drop-shadow-md">
                        SevenGenius - Login
                    </h2>

                    <form onSubmit={handleSubmit} className="space-y-6 w-full">
                        <div>
                            <label className="block text-sm font-medium mb-1" htmlFor="username">
                                Usuário
                            </label>
                            <input
                                className="w-full px-4 py-3 rounded-xl border border-white border-opacity-60 bg-white bg-opacity-20 placeholder-white placeholder-opacity-90 text-white focus:outline-none focus:ring-2 focus:ring-[#47ff01]"
                                autoComplete="off"
                                id="username"
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                disabled={loading}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1" htmlFor="password">
                                Senha
                            </label>
                            <input
                                className="w-full px-4 py-3 rounded-xl border border-white border-opacity-60 bg-white bg-opacity-20 placeholder-white placeholder-opacity-90 text-white focus:outline-none focus:ring-2 focus:ring-[#47ff01]"
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                disabled={loading}
                            />
                        </div>
                        <button
                            className={`w-full py-3 font-semibold rounded-xl shadow-lg transition duration-300 flex justify-center items-center ${loading
                                ? 'bg-[#47ff01] cursor-wait animate-pulse text-gray-800'
                                : 'bg-[#31b200] hover:bg-[#47ff01] text-white'
                                }`}
                            type="submit"
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <svg
                                        className="animate-spin h-5 w-5 mr-3 text-gray-700"
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                    >
                                        <circle
                                            className="opacity-25"
                                            cx="12"
                                            cy="12"
                                            r="10"
                                            stroke="currentColor"
                                            strokeWidth="4"
                                        ></circle>
                                        <path
                                            className="opacity-75"
                                            fill="currentColor"
                                            d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                                        ></path>
                                    </svg>
                                    Processando...
                                </>
                            ) : (
                                'Entrar na nave'
                            )}
                        </button>
                    </form>
                </div>
            </div>

            {toast && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    onClose={() => setToast(null)}
                />
            )}
        </>
    );
};

export default Login;