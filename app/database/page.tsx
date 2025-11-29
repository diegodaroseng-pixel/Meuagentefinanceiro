'use client';

import { useState, useEffect } from 'react';
import { Trash2, Save, Filter, Download, Search, Edit } from 'lucide-react';

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
    const [searchQuery, setSearchQuery] = useState('');

    // Edit Modal State
    const [isEditing, setIsEditing] = useState(false);
    const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);

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

    const handleEditClick = () => {
        if (selectedIds.size !== 1) return;
        const id = Array.from(selectedIds)[0];
        const transaction = transactions.find(t => t.id === id);
        if (transaction) {
            setEditingTransaction({ ...transaction });
            setIsEditing(true);
        }
    };

    const handleSaveEdit = async () => {
        if (!editingTransaction) return;

        try {
            const response = await fetch('/api/transactions', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    id: editingTransaction.id,
                    updates: {
                        description: editingTransaction.description,
                        amount: editingTransaction.amount,
                        date_incurred: editingTransaction.date_incurred,
                        category: editingTransaction.category,
                        behavior_class: editingTransaction.behavior_class,
                        bank_name: editingTransaction.bank_name,
                        card_holder: editingTransaction.card_holder
                    }
                }),
            });

            if (response.ok) {
                alert('Transação atualizada com sucesso!');
                setIsEditing(false);
                setEditingTransaction(null);
                setSelectedIds(new Set()); // Deselect after edit
                fetchTransactions();
            } else {
                alert('Erro ao atualizar transação');
            }
        } catch (error) {
            console.error('Error saving edit:', error);
            alert('Erro ao salvar alterações');
        }
    };

    const filteredTransactions = transactions.filter(t => {
        // Category filter
        if (filterCategory !== 'all' && t.category !== filterCategory) return false;

        // Type filter
        if (filterType !== 'all' && t.behavior_class !== filterType) return false;

        // Search query filter (searches across multiple fields)
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            const searchableText = [
                t.description,
                t.amount.toString(),
                new Date(t.date_incurred).toLocaleDateString('pt-BR'),
                t.category,
                t.behavior_class,
                t.bank_name,
                t.card_holder,
                `${t.installment_current}/${t.installment_total}`,
            ].join(' ').toLowerCase();

            if (!searchableText.includes(query)) return false;
        }

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

                {/* Search */}
                <div className="bg-green-50 border-2 border-green-500 rounded-lg shadow-md p-4 mb-6">
                    <div className="flex items-center gap-3">
                        <Search className="w-5 h-5 text-green-600" />
                        <input
                            type="text"
                            placeholder="Buscar por descrição, valor, data, categoria..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="flex-1 border-0 bg-transparent text-gray-900 font-medium placeholder-gray-500 focus:outline-none focus:ring-0 text-lg"
                        />
                        {searchQuery && (
                            <button
                                onClick={() => setSearchQuery('')}
                                className="text-gray-500 hover:text-gray-700 font-medium"
                            >
                                Limpar
                            </button>
                        )}
                    </div>
                </div>

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
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900 font-medium hover:bg-blue-50 hover:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-pointer transition-colors"
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
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900 font-medium hover:bg-blue-50 hover:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-pointer transition-colors"
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
                        {selectedIds.size === 1 && (
                            <button
                                onClick={handleEditClick}
                                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                            >
                                <Edit className="w-4 h-4" />
                                Editar
                            </button>
                        )}
                        {selectedIds.size > 0 && (
                            <button
                                onClick={handleDelete}
                                className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
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

                {filteredTransactions.length === 0 && transactions.length === 0 && (
                    <div className="text-center py-16 bg-white rounded-lg shadow-md">
                        <div className="text-6xl mb-4">🗄️</div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">Nenhuma transação cadastrada</h3>
                        <p className="text-gray-600 mb-6">Faça upload de um extrato para começar!</p>
                        <a
                            href="/upload"
                            className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
                        >
                            Ir para Upload
                        </a>
                    </div>
                )}

                {filteredTransactions.length === 0 && transactions.length > 0 && (
                    <div className="text-center py-12 text-gray-500">
                        Nenhuma transação encontrada com os filtros aplicados
                    </div>
                )}
            </div>

            {/* Edit Modal */}
            {isEditing && editingTransaction && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-full max-w-2xl shadow-xl">
                        <h2 className="text-2xl font-bold mb-6 text-gray-800">Editar Transação</h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
                                <input
                                    type="text"
                                    value={editingTransaction.description}
                                    onChange={(e) => setEditingTransaction({ ...editingTransaction, description: e.target.value })}
                                    className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Valor (R$)</label>
                                <input
                                    type="number"
                                    step="0.01"
                                    value={editingTransaction.amount}
                                    onChange={(e) => setEditingTransaction({ ...editingTransaction, amount: parseFloat(e.target.value) })}
                                    className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Data</label>
                                <input
                                    type="date"
                                    value={new Date(editingTransaction.date_incurred).toISOString().split('T')[0]}
                                    onChange={(e) => setEditingTransaction({ ...editingTransaction, date_incurred: e.target.value })}
                                    className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Categoria</label>
                                <select
                                    value={editingTransaction.category}
                                    onChange={(e) => setEditingTransaction({ ...editingTransaction, category: e.target.value })}
                                    className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                                >
                                    <option value="Alimentação">Alimentação</option>
                                    <option value="Transporte">Transporte</option>
                                    <option value="Moradia">Moradia</option>
                                    <option value="Saúde">Saúde</option>
                                    <option value="Educação">Educação</option>
                                    <option value="Lazer">Lazer</option>
                                    <option value="Serviços Online">Serviços Online</option>
                                    <option value="Outros">Outros</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Classificação</label>
                                <select
                                    value={editingTransaction.behavior_class}
                                    onChange={(e) => setEditingTransaction({ ...editingTransaction, behavior_class: e.target.value })}
                                    className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                                >
                                    <option value="Essencial">Essencial</option>
                                    <option value="Supérfluo">Supérfluo</option>
                                    <option value="Investimento">Investimento</option>
                                    <option value="Lazer">Lazer</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Banco</label>
                                <input
                                    type="text"
                                    value={editingTransaction.bank_name || ''}
                                    onChange={(e) => setEditingTransaction({ ...editingTransaction, bank_name: e.target.value })}
                                    className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                                />
                            </div>
                        </div>

                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => setIsEditing(false)}
                                className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={handleSaveEdit}
                                className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 font-medium flex items-center gap-2"
                            >
                                <Save className="w-4 h-4" />
                                Salvar Alterações
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
