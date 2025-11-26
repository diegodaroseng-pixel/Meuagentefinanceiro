'use client';

import { useState, useEffect } from 'react';
import { TrendingUp, CheckCircle, Calendar, DollarSign } from 'lucide-react';

interface Forecast {
    id: number;
    description: string;
    amount: number;
    date_incurred: string;
    category: string;
    behavior_class: string;
    forecast_paid: boolean;
    installment_current: number;
    installment_total: number;
}

export default function ForecastsPage() {
    const [forecasts, setForecasts] = useState<Forecast[]>([]);
    const [loading, setLoading] = useState(true);
    const [generating, setGenerating] = useState(false);

    useEffect(() => {
        fetchForecasts();
    }, []);

    const fetchForecasts = async () => {
        try {
            const response = await fetch('/api/forecasts');
            const data = await response.json();
            setForecasts(data.forecasts || []);
        } catch (error) {
            console.error('Error fetching forecasts:', error);
        } finally {
            setLoading(false);
        }
    };

    const generateForecasts = async () => {
        setGenerating(true);
        try {
            const response = await fetch('/api/forecasts/generate', {
                method: 'POST',
            });
            const data = await response.json();
            alert(`${data.generatedCount} previsões geradas!`);
            fetchForecasts();
        } catch (error) {
            console.error('Error generating forecasts:', error);
            alert('Erro ao gerar previsões');
        } finally {
            setGenerating(false);
        }
    };

    const markAsPaid = async (id: number, amount: number) => {
        try {
            const response = await fetch('/api/forecasts', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id, paid: true, amount }),
            });

            if (response.ok) {
                fetchForecasts();
            }
        } catch (error) {
            console.error('Error marking as paid:', error);
        }
    };

    const unpaidForecasts = forecasts.filter(f => !f.forecast_paid);
    const paidForecasts = forecasts.filter(f => f.forecast_paid);

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 p-8 flex items-center justify-center">
                <div className="text-xl text-gray-600">Carregando...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-6xl mx-auto">
                <h1 className="text-4xl font-bold text-gray-900 mb-2">📊 Previsões</h1>
                <p className="text-gray-600 mb-8">Gerencie transações recorrentes e parcelas futuras</p>

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600 mb-1">Previsões Pendentes</p>
                                <p className="text-3xl font-bold text-orange-600">{unpaidForecasts.length}</p>
                            </div>
                            <Calendar className="w-12 h-12 text-orange-500 opacity-20" />
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-md p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600 mb-1">Valor Previsto</p>
                                <p className="text-3xl font-bold text-blue-600">
                                    R$ {unpaidForecasts.reduce((sum, f) => sum + f.amount, 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                </p>
                            </div>
                            <DollarSign className="w-12 h-12 text-blue-500 opacity-20" />
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-md p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600 mb-1">Já Pagas</p>
                                <p className="text-3xl font-bold text-green-600">{paidForecasts.length}</p>
                            </div>
                            <CheckCircle className="w-12 h-12 text-green-500 opacity-20" />
                        </div>
                    </div>
                </div>

                {/* Generate Button */}
                <button
                    onClick={generateForecasts}
                    disabled={generating}
                    className="mb-6 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 font-semibold flex items-center gap-2 disabled:opacity-50"
                >
                    <TrendingUp className="w-5 h-5" />
                    {generating ? 'Gerando...' : 'Gerar Novas Previsões'}
                </button>

                {/* Unpaid Forecasts */}
                {unpaidForecasts.length > 0 && (
                    <div className="mb-8">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">⏳ Aguardando Pagamento</h2>
                        <div className="bg-white rounded-lg shadow-md overflow-hidden">
                            <table className="w-full">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Data Prevista</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Descrição</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Valor</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Categoria</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tipo</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Parcela</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ação</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {unpaidForecasts.map((forecast) => (
                                        <tr key={forecast.id}>
                                            <td className="px-4 py-3 text-sm text-gray-900">
                                                {new Date(forecast.date_incurred).toLocaleDateString('pt-BR')}
                                            </td>
                                            <td className="px-4 py-3 text-sm text-gray-900">{forecast.description}</td>
                                            <td className="px-4 py-3 text-sm font-semibold text-gray-900">
                                                R$ {forecast.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                            </td>
                                            <td className="px-4 py-3 text-sm text-gray-600">{forecast.category}</td>
                                            <td className="px-4 py-3 text-sm text-gray-600">{forecast.behavior_class}</td>
                                            <td className="px-4 py-3 text-sm text-gray-600">
                                                {forecast.installment_total > 1
                                                    ? `${forecast.installment_current}/${forecast.installment_total}`
                                                    : 'Recorrente'}
                                            </td>
                                            <td className="px-4 py-3">
                                                <button
                                                    onClick={() => markAsPaid(forecast.id, forecast.amount)}
                                                    className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 text-sm"
                                                >
                                                    ✅ Marcar Pago
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* Paid Forecasts */}
                {paidForecasts.length > 0 && (
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">✅ Já Pagas</h2>
                        <div className="bg-white rounded-lg shadow-md overflow-hidden">
                            <table className="w-full">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Data</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Descrição</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Valor</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Categoria</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {paidForecasts.map((forecast) => (
                                        <tr key={forecast.id} className="bg-green-50">
                                            <td className="px-4 py-3 text-sm text-gray-900">
                                                {new Date(forecast.date_incurred).toLocaleDateString('pt-BR')}
                                            </td>
                                            <td className="px-4 py-3 text-sm text-gray-900">{forecast.description}</td>
                                            <td className="px-4 py-3 text-sm font-semibold text-gray-900">
                                                R$ {forecast.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                            </td>
                                            <td className="px-4 py-3 text-sm text-gray-600">{forecast.category}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {forecasts.length === 0 && (
                    <div className="text-center py-12 bg-white rounded-lg shadow-md">
                        <TrendingUp className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-600 mb-4">Nenhuma previsão encontrada</p>
                        <button
                            onClick={generateForecasts}
                            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
                        >
                            Gerar Previsões
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
