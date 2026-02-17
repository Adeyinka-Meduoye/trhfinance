import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import { getTransactions, getRequests, getAuditLogs } from '../services/dataService';
import { Transaction, PaymentRequest, AuditLog } from '../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Banknote, AlertCircle, ArrowUpRight, ArrowDownRight, Calendar, RefreshCcw } from 'lucide-react';
import { CURRENCY_SYMBOL, GOOGLE_SCRIPT_URL } from '../constants';

const Dashboard = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [requests, setRequests] = useState<PaymentRequest[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [auditMonth, setAuditMonth] = useState(new Date().toISOString().slice(0, 7));

  const loadData = async () => {
    setLoading(true);
    try {
      const [txData, reqData, logData] = await Promise.all([
        getTransactions(),
        getRequests(),
        getAuditLogs()
      ]);
      setTransactions(txData || []);
      setRequests(reqData || []);
      setAuditLogs((logData || []).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()));
    } catch (error) {
      console.error("Failed to load dashboard data", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const totalIncome = transactions.filter(t => t.type === 'INCOME').reduce((acc, curr) => acc + curr.amount, 0);
  const totalExpense = transactions.filter(t => t.type === 'EXPENSE').reduce((acc, curr) => acc + curr.amount, 0);
  const balance = totalIncome - totalExpense;
  const pendingCount = requests.filter(r => r.status === 'PENDING').length;

  const filteredLogs = auditLogs.filter(log => log.timestamp.startsWith(auditMonth));

  // Chart Data Preparation
  const cashVsElectronic = [
    { name: 'Cash', value: requests.filter(r => r.method === 'CASH' && r.status === 'PAID').length },
    { name: 'Digital', value: requests.filter(r => r.method !== 'CASH' && r.status === 'PAID').length },
  ];
  const COLORS = ['#F59E0B', '#6366F1'];

  // Monthly Data (simplified for demo visualization based on totals)
  // In a real app, you would aggregate transactions by month here
  const monthlyData = [
    { name: 'Income', amount: totalIncome },
    { name: 'Expense', amount: totalExpense },
  ];

  const StatCard = ({ title, value, icon: Icon, colorClass, subText }: any) => (
    <div className="bg-slate-800 rounded-xl shadow-sm p-6 border border-slate-700">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-gray-400 text-sm font-medium uppercase">{title}</h3>
        <div className={`p-2 rounded-lg ${colorClass} bg-opacity-10`}>
           <Icon className={`w-5 h-5 ${colorClass.replace('bg-', 'text-')}`} />
        </div>
      </div>
      <p className="text-2xl font-bold text-white">{value}</p>
      {subText && <p className="text-xs text-gray-500 mt-1">{subText}</p>}
    </div>
  );

  if (!GOOGLE_SCRIPT_URL) {
      return (
          <Layout isAdmin>
              <div className="flex flex-col items-center justify-center h-full p-10 text-center">
                  <AlertCircle className="w-16 h-16 text-amber-500 mb-4" />
                  <h1 className="text-2xl font-bold text-white mb-2">Configuration Required</h1>
                  <p className="text-gray-400 max-w-md">
                      The application is in Production Mode but no Backend URL is configured. 
                      Please deploy the Google Apps Script and update <code>GOOGLE_SCRIPT_URL</code> in <code>constants.ts</code>.
                  </p>
              </div>
          </Layout>
      )
  }

  return (
    <Layout isAdmin>
      <div className="flex justify-between items-center mb-8">
        <div>
            <h1 className="text-2xl font-bold text-white">Financial Overview</h1>
            <p className="text-gray-400">Real-time insight into organization finances.</p>
        </div>
        <button 
            onClick={loadData}
            disabled={loading}
            className="p-2 bg-slate-800 border border-slate-700 rounded-lg hover:bg-slate-700 text-gray-400 hover:text-white transition-colors"
        >
            <RefreshCcw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard 
            title="Current Balance" 
            value={loading ? "..." : `${CURRENCY_SYMBOL}${balance.toLocaleString()}`} 
            icon={Banknote} 
            colorClass={balance >= 0 ? "text-green-500 bg-green-500" : "text-red-500 bg-red-500"} 
        />
        <StatCard 
            title="Total Income" 
            value={loading ? "..." : `${CURRENCY_SYMBOL}${totalIncome.toLocaleString()}`} 
            icon={ArrowUpRight} 
            colorClass="text-emerald-500 bg-emerald-500" 
        />
        <StatCard 
            title="Total Expenses" 
            value={loading ? "..." : `${CURRENCY_SYMBOL}${totalExpense.toLocaleString()}`} 
            icon={ArrowDownRight} 
            colorClass="text-rose-500 bg-rose-500" 
        />
        <StatCard 
            title="Pending Requests" 
            value={loading ? "..." : pendingCount} 
            icon={AlertCircle} 
            colorClass="text-amber-500 bg-amber-500"
            subText="Requires immediate action"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Income vs Expense Chart */}
        <div className="bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-700">
          <h3 className="text-lg font-semibold text-white mb-6">Financial Summary</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" />
                <XAxis dataKey="name" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip 
                    contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f3f4f6' }}
                    itemStyle={{ color: '#f3f4f6' }}
                />
                <Bar dataKey="amount" radius={[4, 4, 0, 0]} barSize={50}>
                  {monthlyData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.name === 'Income' ? '#10B981' : '#F43F5E'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Payment Methods Chart */}
        <div className="bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-700">
          <h3 className="text-lg font-semibold text-white mb-6">Cash vs Digital Disbursements</h3>
          <div className="h-64 flex items-center justify-center">
             {!loading && cashVsElectronic.every(x => x.value === 0) ? (
                 <p className="text-gray-500 text-sm">No payment data available.</p>
             ) : (
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                        data={cashVsElectronic}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        fill="#8884d8"
                        paddingAngle={5}
                        dataKey="value"
                        >
                        {cashVsElectronic.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                        </Pie>
                        <Tooltip contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f3f4f6' }} />
                    </PieChart>
                </ResponsiveContainer>
             )}
          </div>
          <div className="flex justify-center space-x-6 mt-4">
              <div className="flex items-center"><span className="w-3 h-3 rounded-full bg-amber-500 mr-2"></span><span className="text-sm text-gray-400">Cash</span></div>
              <div className="flex items-center"><span className="w-3 h-3 rounded-full bg-indigo-500 mr-2"></span><span className="text-sm text-gray-400">Digital</span></div>
          </div>
        </div>
      </div>

      {/* Monthly Audit Section */}
      <div className="bg-slate-800 shadow rounded-lg overflow-hidden border border-slate-700">
        <div className="px-6 py-4 border-b border-slate-700 flex flex-col sm:flex-row justify-between items-center gap-4">
            <h3 className="text-lg font-semibold text-white">Monthly Audit Log</h3>
            <div className="flex items-center bg-slate-900 p-1.5 rounded-lg border border-slate-600">
                <Calendar className="w-4 h-4 text-gray-400 mr-2" />
                <input 
                    type="month" 
                    value={auditMonth}
                    onChange={(e) => setAuditMonth(e.target.value)}
                    className="bg-transparent text-white text-sm focus:outline-none"
                />
            </div>
        </div>
        <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-700">
            <thead className="bg-slate-900">
                <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Timestamp</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">User</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Module</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Action</th>
                </tr>
            </thead>
            <tbody className="bg-slate-800 divide-y divide-slate-700">
                {loading ? (
                    <tr><td colSpan={4} className="px-6 py-8 text-center text-gray-500">Loading audit data...</td></tr>
                ) : filteredLogs.length > 0 ? (
                    filteredLogs.slice(0, 5).map((log) => (
                    <tr key={log.id} className="hover:bg-slate-700 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                        {new Date(log.timestamp).toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-indigo-400">
                        {log.user}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-700 text-gray-300 border border-slate-600">
                            {log.module}
                        </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-white">
                        {log.action}
                        </td>
                    </tr>
                    ))
                ) : (
                    <tr>
                        <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                            <p>No audit logs found for {auditMonth}.</p>
                        </td>
                    </tr>
                )}
            </tbody>
            </table>
            {!loading && filteredLogs.length > 5 && (
                <div className="px-6 py-3 bg-slate-900/50 text-center border-t border-slate-700">
                    <p className="text-xs text-gray-500">Showing 5 of {filteredLogs.length} records. View full Audit Logs for details.</p>
                </div>
            )}
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;