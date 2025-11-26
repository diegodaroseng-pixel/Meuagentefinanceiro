'use client';

import { useState, useEffect } from 'react';
import { Trash2, Save, Filter, Download } from 'lucide-react';

interface Transaction {
    id: number;
    date_incurred: string;
    date_payment: string;
    description: string;
    amount: number;
    category: string;
    behavior_class: string;
    installment_current: number;
    installment_total: number;
    bank_name: string;
    card_name: string;
    card_holder: string;
    is_auto_generated: boolean;
}

export default function DatabasePage() {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
    const [filterCategory, setFilterCategory] = useState('all');
    const [filterType, setFilterType] = useState('all');

    useEffect(() => {
        fetchTransactions();
    }, []);

    const fetchTransactions = async () => {
        try {
            const response = await fetch('/api/transactions');
            const data = await response.json();
            setTransactions(data.transactions || []);
        } catch (error) {
            console.error('Error fetching transactions:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSelectAll = (checked: boolean) => {
        if (checked) {
            setSelectedIds(new Set(filteredTransactions.map(t => t.id)));
        } else {
            setSelectedIds(new Set());
        }
    };

    const handleSelectOne = (id: number, checked: boolean) => {
        const newSelected = new Set(selectedIds);
        if (checked) {
            newSelected.add(id);
        } else {
            newSelected.delete(id);
        }
        setSelectedIds(newSelected);
    };

    const handleDelete = async () => {
        if (selectedIds.size === 0) return;

        if (!confirm(`Excluir ${selectedIds.size} transações?`)) return;

        try {
            const response = await fetch('/api/transactions', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ids: Array.from(selectedIds) }),
            });

            if (response.ok) {
                alert(`${selectedIds.size} transações excluídas!`);
                setSelectedIds(new Set());
                fetchTransactions();
            }
        } catch (error) {
            console.error('Error deleting:', error);
            alert('Erro ao excluir transações');
        }
    };

    const handleUpdate = async (id: number, field: string, value: any) => {
        try {
            const response = await fetch('/api/transactions', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id, field, value }),
            });

            if (response.ok) {
                fetchTransactions();
            }
        } catch (error) {
            console.error('Error updating:', error);
        }
    };

    const filteredTransactions = transactions.filter(t => {
        if (filterCategory !== 'all' && t.category !== filterCategory) return false;
        if (filterType !== 'all' && t.behavior_class !== filterType) return false;
        return true;
    });

    const categories = Array.from(new Set(transactions.map(t => t.category).filter(Boolean)));
    const types = Array.from(new Set(transactions.map(t => t.behavior_class).filter(Boolean)));

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 p-8 flex items-center justify-center">
                <div className="text-xl text-gray-600">Carregando...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-4xl font-bold text-gray-900 mb-2">🗄️ Banco de Dados</h1>
                <p className="text-gray-600 mb-8">Gerencie suas transações</p>

                {/* Filters */}
                <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                    <div className="flex items-center gap-4">
                        <Filter className="w-5 h-5 text-gray-500" />
                        <div className="flex-1 grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Categoria</label>
                                <select
                                    value={filterCategory}
                                    onChange={(e) => setFilterCategory(e.target.value)}
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                                >
                                    <option value="all">Todas</option>
                                    {categories.map(cat => (
                                        <option key={cat} value={cat}>{cat}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Tipo</label>
                                <select
                                    value={filterType}
                                    onChange={(e) => setFilterType(e.target.value)}
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                                >
                                    <option value="all">Todos</option>
                                    {types.map(type => (
                                        <option key={type} value={type}>{type}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex justify-between items-center mb-4">
                    <div className="text-sm text-gray-600">
                        {selectedIds.size > 0 ? (
                            <span className="font-semibold text-blue-600">
                                {selectedIds.size} selecionadas
                            </span>
                        ) : (
                            <span>
                                Exibindo {filteredTransactions.length} de {transactions.length} transações
                            </span>
                        )}
                    </div>
                    <div className="flex gap-2">
                        {selectedIds.size > 0 && (
                            <button
                                onClick={handleDelete}
                                className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
                            >
                                <Trash2 className="w-4 h-4" />
                                Excluir Selecionadas
                            </button>
                        )}
                    </div>
                </div>

                {/* Table */}
                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-4 py-3 text-left">
                                        <input
                                            type="checkbox"
                                            checked={selectedIds.size === filteredTransactions.length && filteredTransactions.length > 0}
                                            onChange={(e) => handleSelectAll(e.target.checked)}
                                            className="w-4 h-4"
                                        />
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Data Compra</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Descrição</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Valor</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Categoria</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tipo</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Parcela</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Banco</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Titular</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {filteredTransactions.map((tx) => (
                                    <tr key={tx.id} className={tx.is_auto_generated ? 'bg-blue-50' : ''}>
                                        <td className="px-4 py-3">
                                            <input
                                                type="checkbox"
                                                checked={selectedIds.has(tx.id)}
                                                onChange={(e) => handleSelectOne(tx.id, e.target.checked)}
                                                className="w-4 h-4"
                                            />
                                        </td>
                                        <td className="px-4 py-3 text-sm text-gray-500">{tx.id}</td>
                                        <td className="px-4 py-3 text-sm text-gray-900">
                                            {new Date(tx.date_incurred).toLocaleDateString('pt-BR')}
                                        </td>
                                        <td className="px-4 py-3 text-sm text-gray-900 max-w-xs truncate">
                                            {tx.description}
                                        </td>
                                        <td className="px-4 py-3 text-sm font-semibold text-gray-900">
                                            R$ {tx.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                        </td>
                                        <td className="px-4 py-3 text-sm text-gray-600">{tx.category}</td>
                                        <td className="px-4 py-3 text-sm text-gray-600">{tx.behavior_class}</td>
                                        <td className="px-4 py-3 text-sm text-gray-600">
                                            {tx.installment_total > 1 ? `${tx.installment_current}/${tx.installment_total}` : '-'}
                                        </td>
                                        <td className="px-4 py-3 text-sm text-gray-600">{tx.bank_name || '-'}</td>
                                        <td className="px-4 py-3 text-sm text-gray-600">{tx.card_holder || '-'}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {filteredTransactions.length === 0 && (
                    <div className="text-center py-12 text-gray-500">
                        Nenhuma transação encontrada
                    </div>
                )}
            </div>
        </div>
    );
}
