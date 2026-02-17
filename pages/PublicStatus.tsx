import React, { useState } from 'react';
import Layout from '../components/Layout';
import { getRequestById } from '../services/dataService';
import { PaymentRequest } from '../types';
import { Search, Calendar, User, FileText, CreditCard, AlertCircle, Loader2, WifiOff } from 'lucide-react';
import { CURRENCY_SYMBOL } from '../constants';

const PublicStatus = () => {
  const [searchId, setSearchId] = useState('');
  const [result, setResult] = useState<PaymentRequest | null>(null);
  const [status, setStatus] = useState<'IDLE' | 'LOADING' | 'NOT_FOUND' | 'ERROR'>('IDLE');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchId.trim()) return;
    
    setStatus('LOADING');
    setResult(null);
    setErrorMessage('');

    try {
        const req = await getRequestById(searchId.trim());
        if (req) {
            setResult(req);
            setStatus('IDLE');
        } else {
            setStatus('NOT_FOUND');
        }
    } catch (e: any) {
        console.error(e);
        setStatus('ERROR');
        setErrorMessage(e.message || "Unable to connect to the finance system.");
    }
  };

  const getStatusColor = (status: string) => {
    switch(status) {
        case 'PAID': return 'bg-green-900/50 text-green-300 border-green-800';
        case 'APPROVED': return 'bg-blue-900/50 text-blue-300 border-blue-800';
        case 'REJECTED': return 'bg-red-900/50 text-red-300 border-red-800';
        default: return 'bg-yellow-900/50 text-yellow-300 border-yellow-800';
    }
  };

  // Helper to safely display status even if backend sends null
  const safeStatus = result?.status || 'PENDING';

  return (
    <Layout>
      <div className="max-w-2xl mx-auto mt-10 px-4 sm:px-0">
        <div className="text-center mb-10">
            <h1 className="text-3xl font-bold text-white">Track Request</h1>
            <p className="text-gray-400 mt-2">Enter your Request ID to check the current status.</p>
        </div>

        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3 mb-8">
            <input
                type="text"
                className="flex-1 rounded-lg border-slate-600 bg-slate-800 text-white border p-3 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 placeholder-gray-500 w-full"
                placeholder="Enter Request ID (e.g., REQ-123...)"
                value={searchId}
                onChange={(e) => setSearchId(e.target.value)}
            />
            <button 
                type="submit" 
                disabled={status === 'LOADING'}
                className="w-full sm:w-auto bg-indigo-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-indigo-700 flex items-center justify-center disabled:opacity-50"
            >
                {status === 'LOADING' ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Search className="w-5 h-5 mr-2" /> Track</>}
            </button>
        </form>

        {status === 'NOT_FOUND' && (
            <div className="bg-amber-900/20 border border-amber-800 rounded-lg p-6 text-center animate-fade-in-up">
                <AlertCircle className="w-10 h-10 text-amber-500 mx-auto mb-2" />
                <h3 className="text-lg font-semibold text-amber-400">Request Not Found</h3>
                <p className="text-amber-200/70 text-sm mt-1">We couldn't find a record with ID <span className="font-mono bg-amber-900/50 px-1 rounded">{searchId}</span>.</p>
            </div>
        )}

        {status === 'ERROR' && (
            <div className="bg-red-900/20 border border-red-800 rounded-lg p-6 text-center animate-fade-in-up">
                <WifiOff className="w-10 h-10 text-red-500 mx-auto mb-2" />
                <h3 className="text-lg font-semibold text-red-400">System Error</h3>
                <p className="text-red-200/70 text-sm mt-1">{errorMessage}</p>
                <p className="text-xs text-red-200/50 mt-4">Please ensure the Google Script URL is configured correctly.</p>
            </div>
        )}

        {result && (
            <div className="bg-slate-800 shadow rounded-lg overflow-hidden border border-slate-700 animate-fade-in-up">
                <div className="px-6 py-4 border-b border-slate-700 flex flex-col sm:flex-row justify-between items-start sm:items-center bg-slate-800/50 gap-2">
                    <div>
                        <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Status</span>
                        <div className={`mt-1 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(safeStatus)}`}>
                            {safeStatus}
                        </div>
                    </div>
                    <div className="text-left sm:text-right w-full sm:w-auto">
                        <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Amount</span>
                        <div className="text-xl font-bold text-white">{CURRENCY_SYMBOL}{result.amount.toFixed(2)}</div>
                    </div>
                </div>
                <div className="px-6 py-6 space-y-4">
                    <div className="flex items-start">
                        <User className="w-5 h-5 text-gray-500 mt-1 mr-3 flex-shrink-0" />
                        <div className="min-w-0">
                            <p className="text-sm font-medium text-gray-200">Requester</p>
                            <p className="text-sm text-gray-400 break-words">{result.requesterName} ({result.department})</p>
                        </div>
                    </div>
                    <div className="flex items-start">
                        <FileText className="w-5 h-5 text-gray-500 mt-1 mr-3 flex-shrink-0" />
                        <div className="min-w-0">
                            <p className="text-sm font-medium text-gray-200">Purpose</p>
                            <p className="text-sm text-gray-400 break-words">{result.purpose}</p>
                        </div>
                    </div>
                    <div className="flex items-start">
                        <Calendar className="w-5 h-5 text-gray-500 mt-1 mr-3 flex-shrink-0" />
                        <div>
                            <p className="text-sm font-medium text-gray-200">Date Submitted</p>
                            <p className="text-sm text-gray-400">{new Date(result.createdAt).toLocaleDateString()}</p>
                        </div>
                    </div>
                    <div className="flex items-start">
                        <CreditCard className="w-5 h-5 text-gray-500 mt-1 mr-3 flex-shrink-0" />
                        <div>
                            <p className="text-sm font-medium text-gray-200">Method</p>
                            <p className="text-sm text-gray-400">{result.method.replace('_', ' ')}</p>
                        </div>
                    </div>
                    
                    {result.status === 'REJECTED' && result.rejectionReason && (
                         <div className="bg-red-900/20 px-4 py-3 border border-red-900/50 rounded flex items-start">
                            <AlertCircle className="w-5 h-5 text-red-500 mr-2 flex-shrink-0 mt-0.5" />
                            <div>
                                <h4 className="text-sm font-bold text-red-400">Rejection Reason</h4>
                                <p className="text-sm text-red-300 mt-1 break-words">{result.rejectionReason}</p>
                            </div>
                        </div>
                    )}
                </div>
                {result.status === 'PAID' && (
                     <div className="bg-green-900/20 px-6 py-3 border-t border-green-900/50">
                        <p className="text-sm text-green-400 text-center">Funds have been disbursed.</p>
                    </div>
                )}
            </div>
        )}
      </div>
    </Layout>
  );
};

export default PublicStatus;