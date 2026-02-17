import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import { getAuditLogs } from '../services/dataService';
import { AuditLog } from '../types';
import { Filter, Calendar, User, Layers, FileDigit } from 'lucide-react';

const AuditLogs = () => {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  // Default to current month (YYYY-MM)
  const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7));

  useEffect(() => {
    const fetchLogs = async () => {
        setLoading(true);
        try {
            const allLogs = await getAuditLogs();
            setLogs(allLogs.sort((a, b) => 
                new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
            ));
        } catch(e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };
    fetchLogs();
  }, []);

  const filteredLogs = logs.filter(log => log.timestamp.startsWith(selectedMonth));

  return (
    <Layout isAdmin>
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <div>
            <h1 className="text-2xl font-bold text-white">System Audit Logs</h1>
            <p className="text-gray-400">Track all administrative actions and system events.</p>
        </div>
        
        <div className="flex items-center bg-slate-800 p-2 rounded-lg border border-slate-700 w-full md:w-auto">
            <Filter className="w-5 h-5 text-gray-400 mr-2" />
            <span className="text-sm text-gray-300 mr-2 whitespace-nowrap">Filter by Month:</span>
            <input 
                type="month" 
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="bg-slate-700 text-white border border-slate-600 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full"
            />
        </div>
      </div>

      {/* Desktop Table View */}
      <div className="hidden md:block bg-slate-800 shadow rounded-lg overflow-hidden border border-slate-700">
        <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-700">
            <thead className="bg-slate-900">
                <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Timestamp</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">User</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Module</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Action</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Record ID</th>
                </tr>
            </thead>
            <tbody className="bg-slate-800 divide-y divide-slate-700">
                {loading ? (
                    <tr><td colSpan={5} className="px-6 py-8 text-center text-gray-500">Loading audit logs...</td></tr>
                ) : filteredLogs.length > 0 ? (
                    filteredLogs.map((log) => (
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
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-mono">
                        {log.recordId}
                        </td>
                    </tr>
                    ))
                ) : (
                    <tr>
                        <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                            <Calendar className="mx-auto h-12 w-12 text-slate-600 mb-3" />
                            <p>No audit logs found for {selectedMonth}.</p>
                        </td>
                    </tr>
                )}
            </tbody>
            </table>
        </div>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden space-y-4">
        {loading && <div className="text-center py-8 text-gray-500">Loading...</div>}
        
        {!loading && filteredLogs.map(log => (
            <div key={log.id} className="bg-slate-800 p-4 rounded-lg border border-slate-700 shadow-sm">
                <div className="flex justify-between items-start mb-3">
                    <span className="text-white font-semibold text-sm leading-tight">{log.action}</span>
                    <span className="text-[10px] text-gray-500 whitespace-nowrap ml-2 mt-0.5">{new Date(log.timestamp).toLocaleDateString()}</span>
                </div>
                
                <div className="flex flex-wrap gap-2 mb-3">
                    <div className="flex items-center bg-slate-900/50 px-2 py-1 rounded border border-slate-600/50">
                        <User className="w-3 h-3 text-indigo-400 mr-1.5" />
                        <span className="text-xs text-gray-300">{log.user}</span>
                    </div>
                    <div className="flex items-center bg-slate-900/50 px-2 py-1 rounded border border-slate-600/50">
                        <Layers className="w-3 h-3 text-gray-400 mr-1.5" />
                        <span className="text-xs text-gray-300">{log.module}</span>
                    </div>
                </div>

                <div className="pt-2 border-t border-slate-700/50 flex justify-between items-center text-xs">
                    <div className="flex items-center text-gray-500 font-mono">
                        <FileDigit className="w-3 h-3 mr-1" />
                        {log.recordId.split('-')[0]}-...
                    </div>
                    <span className="text-gray-500">{new Date(log.timestamp).toLocaleTimeString()}</span>
                </div>
            </div>
        ))}
        {!loading && filteredLogs.length === 0 && (
             <div className="text-center py-8 text-gray-500 bg-slate-800 rounded-lg border border-slate-700">
                <Calendar className="mx-auto h-10 w-10 text-slate-600 mb-2" />
                No audit logs found for {selectedMonth}.
             </div>
        )}
      </div>

      <div className="mt-4 text-right">
          <p className="text-xs text-gray-500">Showing {filteredLogs.length} records for {selectedMonth}</p>
      </div>
    </Layout>
  );
};

export default AuditLogs;