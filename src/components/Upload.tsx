import React, { useState, useRef, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Toast from "./Toast";

interface UploadProps {
    token: string;
    onResults: (results: any) => void;
}

const Upload: React.FC<UploadProps> = ({ token, onResults }) => {
    const [file, setFile] = useState<File | null>(null);
    const [dragOver, setDragOver] = useState(false);
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const [loading, setLoading] = useState(false);
    const [toast, setToast] = useState<{ message: string; type: "error" } | null>(null);
    const [redirecting, setRedirecting] = useState(false);
    const [fadeIn, setFadeIn] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        setFadeIn(true);
    }, []);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setFile(e.target.files[0]);
        }
    };

    const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setDragOver(false);
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            setFile(e.dataTransfer.files[0]);
            e.dataTransfer.clearData();
        }
    }, []);

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setDragOver(true);
    };

    const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setDragOver(false);
    };

    const clearFile = () => setFile(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!file) {
            setToast({ message: "Caralho, escolhe o arquivo primeiro kkkkk", type: "error" });
            return;
        }

        setLoading(true);

        try {
            const formData = new FormData();
            formData.append("file", file);

            const res = await fetch("https://seven-genius-api.onrender.com/process/upload/", {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: formData,
            });

            if (!res.ok) {
                const errorData = await res.json();
                setToast({ message: `Erro no upload: ${errorData.detail || res.statusText}`, type: "error" });
                setLoading(false);
                return;
            }

            const data = await res.json();
            onResults(data);

            // Começa a animação de redirecionamento
            setRedirecting(true);

            // Delay pra mostrar a animação de loading, tipo 1.5s
            setTimeout(() => {
                navigate("/results", { state: { results: data.result || data } });
            }, 1500);
        } catch (error) {
            setToast({ message: `Erro no upload, desgraça: ${error}`, type: "error" });
            setLoading(false);
        }
    };

    const triggerFileInput = () => {
        fileInputRef.current?.click();
    };

    return (
        <>
            <style>
                {`
          @keyframes pan {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }

          @keyframes spin {
            to { transform: rotate(360deg); }
          }

          .spinner {
            width: 40px;
            height: 40px;
            border: 4px solid rgba(0, 0, 0, 0.1);
            border-left-color: #22c55e; /* cor verde */
            border-radius: 50%;
            animation: spin 1s linear infinite;
            margin: 0 auto;
          }

          .fade-in {
            animation: fadeIn 0.5s ease forwards;
          }

          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
        `}
            </style>

            <div
                className="w-screen h-screen flex items-center justify-center"
                style={{
                    backgroundImage: "linear-gradient(270deg, #2b7a00,rgb(48, 213, 59))",
                    backgroundSize: "300% 300%",
                    animation: "pan 15s ease infinite",
                    position: "relative",
                }}
            >
                <div className="bg-seven-white shadow-2xl rounded-2xl p-10 w-full max-w-lg mx-auto relative z-10">
                    <h1 className="text-3xl font-bold text-seven-green text-center mb-8">📂 Upload de Arquivo</h1>
                    <form onSubmit={handleSubmit}>
                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Selecione ou arraste o arquivo:</label>
                            <label className="block text-sm font-medium text-green-700 mb-2">* tipos aceitos: .txt, .pdf e .mp3</label>
                            <div
                                className={`relative cursor-pointer border-2 border-dashed rounded-xl p-6 text-center hover:bg-seven-green/10 transition duration-300 ${dragOver ? "border-green-600 bg-green-50" : "border-seven-green"
                                    }`}
                                onClick={triggerFileInput}
                                onDrop={handleDrop}
                                onDragOver={handleDragOver}
                                onDragLeave={handleDragLeave}
                                style={{
                                    opacity: fadeIn ? 1 : 0,
                                    transition: "opacity 1s ease-in",
                                }}
                            >
                                <p className="text-gray-600 select-none">{file ? `📄 ${file.name}` : "Clique aqui ou arraste o arquivo"}</p>
                                {file && (
                                    <button
                                        type="button"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            clearFile();
                                        }}
                                        className="absolute top-2 right-2 text-red-600 font-bold rounded-full hover:bg-red-100 p-1 transition"
                                        aria-label="Remover arquivo"
                                    >
                                        ×
                                    </button>
                                )}
                            </div>
                            <input
                                ref={fileInputRef}
                                type="file"
                                className="hidden"
                                onChange={handleFileChange}
                                accept=".txt,.pdf,.mp3"
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={loading || !file}
                            className={`w-full ${loading || !file ? "bg-gray-400 cursor-not-allowed" : "bg-seven-green hover:bg-green-700"} text-white font-semibold py-3 px-4 rounded-xl transition duration-300 flex items-center justify-center`}
                        >
                            {loading ? (
                                <div className="flex items-center justify-center gap-2">
                                    <div className="spinner"></div>
                                    <span>Processando...</span>
                                </div>
                            ) : (
                                "Enviar"
                            )}
                        </button>
                    </form>
                </div>

                {redirecting && (
                    <div
                        className="absolute inset-0 flex flex-col items-center justify-center bg-white bg-opacity-90"
                        style={{ zIndex: 50 }}
                    >
                        <div className="spinner"></div>
                        <p className="mt-4 text-green-700 font-semibold text-lg animate-fade-in">Preparando o resultado...</p>
                    </div>
                )}
            </div>

            {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
        </>
    );
};

export default Upload;
