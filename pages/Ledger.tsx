import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { getTransactions, recordTransaction } from '../services/dataService';
import { Transaction, TransactionType } from '../types';
import { INCOME_CATEGORIES, EXPENSE_CATEGORIES, CURRENCY_SYMBOL, STORAGE_KEYS } from '../constants';
import Modal from '../components/Modal';
import { PlusCircle, MinusCircle, ArrowDown, ArrowUp, Filter, Calendar, TrendingUp, TrendingDown, Activity, Loader2 } from 'lucide-react';

const Ledger = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<TransactionType>('INCOME');
  const [loading, setLoading] = useState(true);
  const currentUser = localStorage.getItem(STORAGE_KEYS.USER) || 'Admin';
  
  // Default to current month (YYYY-MM)
  const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7));
  
  const [formData, setFormData] = useState({
    amount: '',
    category: '',
    description: '',
    date: new Date().toISOString().split('T')[0]
  });

  const loadData = async () => {
    setLoading(true);
    try {
        const data = await getTransactions();
        setTransactions(data.sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
    } catch(e) {
        console.error(e);
    } finally {
        setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const openModal = (type: TransactionType) => {
    setModalType(type);
    setFormData({
        amount: '',
        category: type === 'INCOME' ? INCOME_CATEGORIES[0] : EXPENSE_CATEGORIES[0],
        description: '',
        date: new Date().toISOString().split('T')[0]
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
        await recordTransaction({
            type: modalType,
            amount: parseFloat(formData.amount),
            category: formData.category,
            description: formData.description,
            date: formData.date,
            recordedBy: currentUser
        });
        await loadData();
        setIsModalOpen(false);
    } catch (e) {
        alert("Failed to save transaction.");
    }
  };

  const filteredTransactions = transactions.filter(t => t.date.startsWith(selectedMonth));

  const totalIncome = filteredTransactions
    .filter(t => t.type === 'INCOME')
    .reduce((acc, curr) => acc + curr.amount, 0);
    
  const totalExpense = filteredTransactions
    .filter(t => t.type === 'EXPENSE')
    .reduce((acc, curr) => acc + curr.amount, 0);
    
  const netDifference = totalIncome - totalExpense;

  return (
    <Layout isAdmin>
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <h1 className="text-2xl font-bold text-white">General Ledger</h1>
        
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
             <div className="flex items-center bg-slate-800 p-2 rounded-lg border border-slate-700">
                <Filter className="w-4 h-4 text-gray-400 mr-2" />
                <span className="text-sm text-gray-300 mr-2 hidden sm:inline">Month:</span>
                <input 
                    type="month" 
                    value={selectedMonth}
                    onChange={(e) => setSelectedMonth(e.target.value)}
                    className="bg-slate-700 text-white border border-slate-600 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full sm:w-auto"
                />
            </div>

            <div className="flex space-x-2">
                <button 
                    onClick={() => openModal('INCOME')}
                    className="flex-1 flex items-center justify-center px-3 py-2 bg-emerald-600 text-white text-sm font-medium rounded-lg hover:bg-emerald-700 whitespace-nowrap"
                >
                    <PlusCircle className="w-4 h-4 mr-1" /> Add Income
                </button>
                <button 
                    onClick={() => openModal('EXPENSE')}
                    className="flex-1 flex items-center justify-center px-3 py-2 bg-rose-600 text-white text-sm font-medium rounded-lg hover:bg-rose-700 whitespace-nowrap"
                >
                    <MinusCircle className="w-4 h-4 mr-1" /> Add Expense
                </button>
            </div>
        </div>
      </div>

      {/* Monthly Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-slate-800 p-4 rounded-lg border border-slate-700 flex items-center">
            <div className="p-3 rounded-full bg-emerald-900/30 text-emerald-400 mr-4">
                <TrendingUp className="w-6 h-6" />
            </div>
            <div>
                <p className="text-sm text-gray-400">Monthly Income</p>
                <p className="text-xl font-bold text-white">{CURRENCY_SYMBOL}{totalIncome.toFixed(2)}</p>
            </div>
        </div>
        <div className="bg-slate-800 p-4 rounded-lg border border-slate-700 flex items-center">
            <div className="p-3 rounded-full bg-rose-900/30 text-rose-400 mr-4">
                <TrendingDown className="w-6 h-6" />
            </div>
            <div>
                <p className="text-sm text-gray-400">Monthly Expenses</p>
                <p className="text-xl font-bold text-white">{CURRENCY_SYMBOL}{totalExpense.toFixed(2)}</p>
            </div>
        </div>
        <div className="bg-slate-800 p-4 rounded-lg border border-slate-700 flex items-center">
            <div className={`p-3 rounded-full mr-4 ${netDifference >= 0 ? 'bg-blue-900/30 text-blue-400' : 'bg-amber-900/30 text-amber-400'}`}>
                <Activity className="w-6 h-6" />
            </div>
            <div>
                <p className="text-sm text-gray-400">Net Difference</p>
                <p className={`text-xl font-bold ${netDifference >= 0 ? 'text-blue-400' : 'text-amber-400'}`}>
                    {netDifference > 0 ? '+' : ''}{CURRENCY_SYMBOL}{netDifference.toFixed(2)}
                </p>
            </div>
        </div>
      </div>

      <div className="bg-slate-800 shadow rounded-lg overflow-hidden border border-slate-700">
         <div className="overflow-x-auto">
             <table className="min-w-full divide-y divide-slate-700">
            <thead className="bg-slate-900">
                <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Description</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Category</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">Amount</th>
                </tr>
            </thead>
            <tbody className="bg-slate-800 divide-y divide-slate-700">
                {loading ? (
                    <tr><td colSpan={4} className="px-6 py-8 text-center text-gray-500">Loading ledger...</td></tr>
                ) : filteredTransactions.length > 0 ? (
                    filteredTransactions.map((t) => (
                    <tr key={t.id} className="hover:bg-slate-700 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                        {new Date(t.date).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-white font-medium">
                        {t.description}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-700 text-gray-300 border border-slate-600">
                            {t.category}
                        </span>
                        </td>
                        <td className={`px-6 py-4 whitespace-nowrap text-right text-sm font-bold ${t.type === 'INCOME' ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {t.type === 'INCOME' ? '+' : '-'}{CURRENCY_SYMBOL}{t.amount.toFixed(2)}
                        </td>
                    </tr>
                    ))
                ) : (
                    <tr>
                         <td colSpan={4} className="px-6 py-12 text-center text-gray-500">
                            <Calendar className="mx-auto h-12 w-12 text-slate-600 mb-3" />
                            <p>No transactions found for {selectedMonth}.</p>
                        </td>
                    </tr>
                )}
            </tbody>
            </table>
         </div>
      </div>
      <div className="mt-4 text-right">
          <p className="text-xs text-gray-500">Showing {filteredTransactions.length} records for {selectedMonth}</p>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={`Record ${modalType}`}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-gray-300">Amount</label>
                <input 
                    type="number" step="0.01" required 
                    className="mt-1 block w-full rounded-md border-slate-600 bg-slate-700 text-white border p-2 shadow-sm focus:border-indigo-500"
                    value={formData.amount}
                    onChange={(e) => setFormData({...formData, amount: e.target.value})}
                />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-300">Category</label>
                <select 
                    className="mt-1 block w-full rounded-md border-slate-600 bg-slate-700 text-white border p-2 shadow-sm focus:border-indigo-500"
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                >
                    {(modalType === 'INCOME' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES).map(c => (
                        <option key={c} value={c}>{c}</option>
                    ))}
                </select>
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-300">Description</label>
                <input 
                    type="text" required 
                    className="mt-1 block w-full rounded-md border-slate-600 bg-slate-700 text-white border p-2 shadow-sm focus:border-indigo-500"
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-300">Date</label>
                <input 
                    type="date" required 
                    className="mt-1 block w-full rounded-md border-slate-600 bg-slate-700 text-white border p-2 shadow-sm focus:border-indigo-500"
                    value={formData.date}
                    onChange={(e) => setFormData({...formData, date: e.target.value})}
                />
            </div>
            <button type="submit" className={`w-full py-2 text-white font-medium rounded-md ${modalType === 'INCOME' ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-rose-600 hover:bg-rose-700'}`}>
                Save Record
            </button>
        </form>
      </Modal>
    </Layout>
  );
};

export default Ledger;