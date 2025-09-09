import * as React from "react";
import { useState } from "react";
import { useLocation, useNavigate } from 'react-router-dom';
import type { JSX } from "react";

const Results: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const result = location.state?.results;

    const [activeTab, setActiveTab] = useState(0);

    React.useEffect(() => {
        if (!result || !result.data) {
            setTimeout(() => {
                navigate('/');
            }, 2000);
        }
    }, [result, navigate]);

    const scrollStyles = `
    ::-webkit-scrollbar {
        width: 8px;
        height: 8px;
    }
    ::-webkit-scrollbar-track {
        background: #d1fae5;
    }
    ::-webkit-scrollbar-thumb {
        background-color: #34d399;
        border-radius: 10px;
        border: 2px solid #d1fae5;
    }
    * {
        scrollbar-width: thin;
        scrollbar-color: #34d399 #d1fae5;
    }
    `;

    const handleBackToUpload = () => {
        navigate('/', { state: {} });
    };

    const renderData = (data: any): JSX.Element => {
        if (typeof data === 'object' && data !== null) {
            if (Array.isArray(data)) {
                return (
                    <ul style={{ paddingLeft: 20 }}>
                        {data.map((item, idx) => (
                            <li key={idx} style={{ marginBottom: 6 }}>{renderData(item)}</li>
                        ))}
                    </ul>
                );
            } else {
                return (
                    <ul style={{ paddingLeft: 20 }}>
                        {Object.entries(data).map(([key, value]) => (
                            <li key={key} style={{ marginBottom: 6 }}>
                                <strong style={{ color: '#047857' }}>{key}:</strong> {renderData(value)}
                            </li>
                        ))}
                    </ul>
                );
            }
        } else {
            return <span style={{ color: '#374151' }}>{String(data)}</span>;
        }
    };

    const tabs = Object.keys(result.data);

    return (
        <>
            <style>{scrollStyles}</style>
            <div
                style={{
                    height: '100vh',
                    width: '100vw',
                    background: 'linear-gradient(to bottom right, #ecfdf5, #bbf7d0)',
                    display: 'flex',
                    flexDirection: 'column',
                    padding: 20,
                    boxSizing: 'border-box',
                    overflow: 'hidden',
                    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
                }}
            >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                    <h1
                        style={{
                            color: '#065f46',
                            fontWeight: '900',
                            fontSize: '2.5rem',
                            textShadow: '1px 1px 3px rgba(0,0,0,0.1)',
                            margin: 0,
                        }}
                    >
                        Conteúdo Extraído
                    </h1>
                    <button
                        onClick={handleBackToUpload}
                        style={{
                            backgroundColor: '#34d399',
                            color: '#064e3b',
                            fontWeight: '700',
                            border: 'none',
                            borderRadius: 8,
                            padding: '10px 20px',
                            cursor: 'pointer',
                            boxShadow: '0 0 10px #34d399',
                            transition: 'background-color 0.3s',
                        }}
                        onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#22c55e')}
                        onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#34d399')}
                    >
                        Voltar pro Upload
                    </button>
                </div>

                <nav
                    style={{
                        display: 'flex',
                        justifyContent: 'center',
                        gap: 10,
                        marginBottom: 20,
                        flexWrap: 'wrap',
                    }}
                >
                    {tabs.map((tab, idx) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(idx)}
                            style={{
                                cursor: 'pointer',
                                padding: '10px 20px',
                                borderRadius: 8,
                                border: 'none',
                                fontWeight: '700',
                                backgroundColor: activeTab === idx ? '#34d399' : '#bbf7d0',
                                color: activeTab === idx ? '#064e3b' : '#065f46',
                                boxShadow: activeTab === idx ? '0 0 10px #34d399' : 'none',
                                transition: 'background-color 0.3s, color 0.3s',
                            }}
                            aria-selected={activeTab === idx}
                            role="tab"
                        >
                            {tab}
                        </button>
                    ))}
                </nav>

                <main
                    style={{
                        flexGrow: 1,
                        overflowY: 'auto',
                        backgroundColor: 'white',
                        borderRadius: 16,
                        padding: 20,
                        boxShadow: '0 10px 20px rgba(0,0,0,0.05)',
                    }}
                    role="tabpanel"
                    aria-labelledby={tabs[activeTab]}
                >
                    {renderData(result.data[tabs[activeTab]])}
                </main>
            </div>
        </>
    );
};

export default Results;