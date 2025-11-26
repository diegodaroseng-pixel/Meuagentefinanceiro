'use client';

import { useEffect, useState } from 'react';
import { BarChart, Bar, PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp, DollarSign, Receipt, PieChart as PieChartIcon } from 'lucide-react';

interface DashboardData {
    metrics: {
        totalSpent: number;
        transactionCount: number;
        avgTransaction: number;
        essentials: number;
    };
    byCategory: Array<{ name: string; value: number }>;
    byType: Array<{ name: string; value: number }>;
    byMonth: Array<{ month: string; value: number }>;
}

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'];

const formatBRL = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    }).format(value);
};

export default function Dashboard() {
    const [data, setData] = useState<DashboardData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/api/dashboard')
            .then(res => res.json())
            .then(data => {
                setData(data);
                setLoading(false);
            })
            .catch(err => {
                console.error('Error fetching dashboard data:', err);
                setLoading(false);
            });
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-xl text-gray-600">Carregando...</div>
            </div>
        );
    }

    if (!data || data.metrics.transactionCount === 0) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-8">
                <div className="bg-white rounded-lg shadow-lg p-12 max-w-2xl text-center">
                    <div className="text-6xl mb-6">📊</div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-4">Bem-vindo ao seu Dashboard Financeiro!</h1>
                    <p className="text-lg text-gray-600 mb-8">
                        Você ainda não tem transações cadastradas. Comece fazendo o upload de um extrato bancário!
                    </p>
                    <div className="space-y-4">
                        <a
                            href="/upload"
                            className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                        >
                            📤 Fazer Upload de Extrato
                        </a>
                        <p className="text-sm text-gray-500">
                            Ou adicione transações manualmente na página de Banco de Dados
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="p-8">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-4xl font-bold text-gray-900 mb-2">📊 Dashboard Financeiro</h1>
                <p className="text-gray-600">Visão geral dos seus gastos</p>
            </div>

            {/* Metrics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600 mb-1">Total Gasto</p>
                            <p className="text-2xl font-bold text-gray-900">{formatBRL(data.metrics.totalSpent)}</p>
                        </div>
                        <DollarSign className="w-12 h-12 text-blue-500 opacity-20" />
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-500">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600 mb-1">Transações</p>
                            <p className="text-2xl font-bold text-gray-900">{data.metrics.transactionCount}</p>
                        </div>
                        <Receipt className="w-12 h-12 text-green-500 opacity-20" />
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-yellow-500">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600 mb-1">Ticket Médio</p>
                            <p className="text-2xl font-bold text-gray-900">{formatBRL(data.metrics.avgTransaction)}</p>
                        </div>
                        <TrendingUp className="w-12 h-12 text-yellow-500 opacity-20" />
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-red-500">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600 mb-1">Essenciais</p>
                            <p className="text-2xl font-bold text-gray-900">{formatBRL(data.metrics.essentials)}</p>
                        </div>
                        <PieChartIcon className="w-12 h-12 text-red-500 opacity-20" />
                    </div>
                </div>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                {/* Category Pie Chart */}
                <div className="bg-white rounded-lg shadow-md p-6">
                    <h2 className="text-xl font-bold text-gray-900 mb-4">Gastos por Categoria</h2>
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie
                                data={data.byCategory}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                                outerRadius={80}
                                fill="#8884d8"
                                dataKey="value"
                            >
                                {data.byCategory.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip formatter={(value: number) => formatBRL(value)} />
                        </PieChart>
                    </ResponsiveContainer>
                </div>

                {/* Type Bar Chart */}
                <div className="bg-white rounded-lg shadow-md p-6">
                    <h2 className="text-xl font-bold text-gray-900 mb-4">Classificação Comportamental</h2>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={data.byType}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip formatter={(value: number) => formatBRL(value)} />
                            <Bar dataKey="value" fill="#3B82F6" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Monthly Trend */}
            <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Evolução Mensal</h2>
                <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={data.byMonth}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip formatter={(value: number) => formatBRL(value)} />
                        <Legend />
                        <Line type="monotone" dataKey="value" stroke="#3B82F6" strokeWidth={2} name="Gastos" />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
