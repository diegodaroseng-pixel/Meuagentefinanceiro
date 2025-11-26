'use client';

import { useState } from 'react';
import { Upload, FileText, CheckCircle, XCircle, Loader2 } from 'lucide-react';

interface Transaction {
    description: string;
    amount: number;
    date_incurred: string;
    date_payment: string;
    category: string;
    behavior_class: string;
    installment_current: number;
    installment_total: number;
    status: 'new' | 'similar' | 'exact';
}

export default function UploadPage() {
    const [file, setFile] = useState<File | null>(null);
    const [processing, setProcessing] = useState(false);
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [selectedBank, setSelectedBank] = useState('');
    const [selectedCard, setSelectedCard] = useState('');
    const [selectedHolder, setSelectedHolder] = useState('Diego de Bem Daros');

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        const droppedFile = e.dataTransfer.files[0];
        if (droppedFile) {
            setFile(droppedFile);
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
        }
    };

    const processFile = async () => {
        if (!file) return;

        setProcessing(true);
        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await fetch('/api/upload', {
                method: 'POST',
                body: formData,
            });

            const data = await response.json();

            if (data.transactions) {
                setTransactions(data.transactions);
                setSelectedBank(data.bank_name || '');
                setSelectedCard(data.card_number || '');
            }
        } catch (error) {
            console.error('Error processing file:', error);
            alert('Erro ao processar arquivo');
        } finally {
            setProcessing(false);
        }
    };

    const saveTransactions = async () => {
        const selected = transactions.filter((_, i) =>
            (document.getElementById(`tx-${i}`) as HTMLInputElement)?.checked
        );

        try {
            const response = await fetch('/api/transactions', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    transactions: selected,
                    bank_name: selectedBank,
                    card_name: selectedCard,
                    card_holder: selectedHolder,
                }),
            });

            if (response.ok) {
                alert(`${selected.length} transações salvas com sucesso!`);
                setTransactions([]);
                setFile(null);
            }
        } catch (error) {
            console.error('Error saving transactions:', error);
            alert('Erro ao salvar transações');
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-6xl mx-auto">
                <h1 className="text-4xl font-bold text-gray-900 mb-2">📂 Carregar Documentos</h1>
                <p className="text-gray-600 mb-8">Faça upload de faturas, extratos ou comprovantes</p>

                {/* Upload Area */}
                <div
                    onDrop={handleDrop}
                    onDragOver={(e) => e.preventDefault()}
                    className={`border-2 border-dashed rounded-lg p-12 text-center transition-colors ${file ? 'border-green-500 bg-green-50' : 'border-gray-300 bg-white hover:border-blue-500'
                        }`}
                >
                    {file ? (
                        <div className="flex flex-col items-center">
                            <FileText className="w-16 h-16 text-green-500 mb-4" />
                            <p className="text-lg font-semibold text-gray-900">{file.name}</p>
                            <p className="text-sm text-gray-500">{(file.size / 1024).toFixed(2)} KB</p>
                            <button
                                onClick={() => setFile(null)}
                                className="mt-4 text-red-600 hover:text-red-700"
                            >
                                Remover arquivo
                            </button>
                        </div>
                    ) : (
                        <div>
                            <Upload className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                            <p className="text-lg text-gray-700 mb-2">Arraste e solte o arquivo aqui</p>
                            <p className="text-sm text-gray-500 mb-4">ou</p>
                            <label className="cursor-pointer bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 inline-block">
                                Procurar Arquivo
                                <input
                                    type="file"
                                    onChange={handleFileChange}
                                    accept=".pdf,.jpg,.jpeg,.png,.csv"
                                    className="hidden"
                                />
                            </label>
                            <p className="text-xs text-gray-400 mt-4">PDF, JPG, PNG ou CSV (máx. 10MB)</p>
                        </div>
                    )}
                </div>

                {/* Process Button */}
                {file && !processing && transactions.length === 0 && (
                    <button
                        onClick={processFile}
                        className="mt-6 w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 font-semibold flex items-center justify-center"
                    >
                        <Loader2 className="w-5 h-5 mr-2" />
                        Processar com IA
                    </button>
                )}

                {/* Processing */}
                {processing && (
                    <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
                        <Loader2 className="w-12 h-12 text-blue-600 mx-auto mb-4 animate-spin" />
                        <p className="text-blue-900 font-semibold">Processando arquivo...</p>
                        <p className="text-blue-700 text-sm">Extraindo transações com IA</p>
                    </div>
                )}

                {/* Transactions Table */}
                {transactions.length > 0 && (
                    <div className="mt-8">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">✅ Revisar Transações</h2>

                        {/* Bank/Card/Holder Selection */}
                        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                            <h3 className="text-lg font-semibold mb-4">🏦 Informações do Cartão</h3>
                            <div className="grid grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Banco</label>
                                    <select
                                        value={selectedBank}
                                        onChange={(e) => setSelectedBank(e.target.value)}
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2"
                                    >
                                        <option value="">Selecione...</option>
                                        <option value="Nubank">Nubank</option>
                                        <option value="Itaú">Itaú</option>
                                        <option value="Bradesco">Bradesco</option>
                                        <option value="Santander">Santander</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Cartão</label>
                                    <input
                                        type="text"
                                        value={selectedCard}
                                        onChange={(e) => setSelectedCard(e.target.value)}
                                        placeholder="Ex: 1234 ou Black"
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Titular</label>
                                    <select
                                        value={selectedHolder}
                                        onChange={(e) => setSelectedHolder(e.target.value)}
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2"
                                    >
                                        <option value="Diego de Bem Daros">Diego de Bem Daros</option>
                                        <option value="Celiane">Celiane</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Transactions List */}
                        <div className="bg-white rounded-lg shadow-md overflow-hidden">
                            <table className="w-full">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Salvar</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Descrição</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Valor</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Data</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Parcela</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {transactions.map((tx, i) => (
                                        <tr key={i} className={tx.status === 'exact' ? 'bg-red-50' : ''}>
                                            <td className="px-4 py-3">
                                                <input
                                                    id={`tx-${i}`}
                                                    type="checkbox"
                                                    defaultChecked={tx.status === 'new'}
                                                    className="w-4 h-4"
                                                />
                                            </td>
                                            <td className="px-4 py-3">
                                                {tx.status === 'new' && <CheckCircle className="w-5 h-5 text-green-500" />}
                                                {tx.status === 'similar' && <span className="text-yellow-600">⚠️</span>}
                                                {tx.status === 'exact' && <XCircle className="w-5 h-5 text-red-500" />}
                                            </td>
                                            <td className="px-4 py-3 text-sm text-gray-900">{tx.description}</td>
                                            <td className="px-4 py-3 text-sm font-semibold text-gray-900">
                                                R$ {tx.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                            </td>
                                            <td className="px-4 py-3 text-sm text-gray-600">
                                                {new Date(tx.date_incurred).toLocaleDateString('pt-BR')}
                                            </td>
                                            <td className="px-4 py-3 text-sm text-gray-600">
                                                {tx.installment_total > 1 ? `${tx.installment_current}/${tx.installment_total}` : '-'}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Save Button */}
                        <button
                            onClick={saveTransactions}
                            className="mt-6 w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 font-semibold"
                        >
                            💾 Salvar Transações Selecionadas
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
