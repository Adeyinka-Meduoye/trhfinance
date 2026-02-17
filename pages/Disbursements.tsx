import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import { getRequests, createDisbursement, getDisbursements } from '../services/dataService';
import { PaymentRequest, Disbursement } from '../types';
import SignaturePad from '../components/SignaturePad';
import Modal from '../components/Modal';
import { Wallet, Banknote, CreditCard, ArrowRight, Clock, CheckCircle, Loader2 } from 'lucide-react';
import { CURRENCY_SYMBOL, STORAGE_KEYS } from '../constants';

const Disbursements = () => {
  const [pendingPayments, setPendingPayments] = useState<PaymentRequest[]>([]);
  const [history, setHistory] = useState<(Disbursement & { requesterName: string })[]>([]);
  const [selectedReq, setSelectedReq] = useState<PaymentRequest | null>(null);
  const [step, setStep] = useState<1 | 2>(1);
  const [loading, setLoading] = useState(true);
  const currentUser = localStorage.getItem(STORAGE_KEYS.USER) || 'Admin';
  
  // Form State
  const [bankDetails, setBankDetails] = useState({ bankName: '', accountNo: '', ref: '' });
  const [cashDetails, setCashDetails] = useState({ receiverName: '', signature: '' as string | null });

  useEffect(() => {
    refreshData();
  }, []);

  const refreshData = async () => {
    setLoading(true);
    try {
        const [allRequests, pastDisbursements] = await Promise.all([
            getRequests(),
            getDisbursements()
        ]);

        setPendingPayments(allRequests.filter(r => r.status === 'APPROVED'));

        const enrichedHistory = pastDisbursements.map(d => ({
            ...d,
            requesterName: allRequests.find(r => r.id === d.requestId)?.requesterName || 'Unknown'
        })).sort((a,b) => new Date(b.processedAt).getTime() - new Date(a.processedAt).getTime());
        
        setHistory(enrichedHistory);
    } catch (e) {
        console.error(e);
    } finally {
        setLoading(false);
    }
  };

  const handleProcessClick = (req: PaymentRequest) => {
    setSelectedReq(req);
    setStep(1);
    // Pre-fill if available
    setBankDetails({ 
        bankName: req.bankName || '', 
        accountNo: req.accountNumber || '', 
        ref: '' 
    });
    setCashDetails({ receiverName: req.requesterName, signature: null });
  };

  const handleFinalize = async () => {
    if (!selectedReq) return;

    // Validation
    if (selectedReq.method === 'CASH') {
        if (!cashDetails.signature) {
            alert("Digital signature is MANDATORY for cash payments.");
            return;
        }
    }

    try {
        await createDisbursement({
            requestId: selectedReq.id,
            method: selectedReq.method,
            amount: selectedReq.amount,
            processedBy: currentUser, // Use logged in user
            
            // Conditional fields
            ...(selectedReq.method === 'CASH' ? {
                cashReceiverName: cashDetails.receiverName,
                signatureBase64: cashDetails.signature || undefined
            } : {
                bankName: bankDetails.bankName,
                accountNumber: bankDetails.accountNo,
                transactionRef: bankDetails.ref
            })
        });

        // Reset and Refresh
        setSelectedReq(null);
        refreshData();
    } catch (e) {
        alert("Failed to process payment. Please check network connection.");
    }
  };

  return (
    <Layout isAdmin>
      <div className="mb-6 flex justify-between">
        <div>
            <h1 className="text-2xl font-bold text-white">Disbursement Hub</h1>
            <p className="text-gray-400">Process approvals and view payment history.</p>
        </div>
        <button onClick={refreshData} className="p-2 text-gray-400 hover:text-white bg-slate-800 rounded h-10 w-10 flex items-center justify-center">
            <Loader2 className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Pending Queue Section */}
      <div className="mb-10">
          <h2 className="text-lg font-semibold text-white mb-4 flex items-center">
            <Clock className="w-5 h-5 mr-2 text-amber-500" />
            Pending Queue
            {!loading && <span className="ml-2 bg-amber-900/50 text-amber-400 text-xs px-2 py-0.5 rounded-full">{pendingPayments.length}</span>}
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {loading && <div className="col-span-full py-8 text-center text-gray-500">Loading pending items...</div>}
            
            {!loading && pendingPayments.length === 0 && (
                <div className="col-span-full py-8 text-center bg-slate-800 rounded-xl border border-slate-700 border-dashed text-gray-500">
                    <CheckCircle className="mx-auto h-10 w-10 text-slate-600 mb-2" />
                    <p>All approved requests have been processed.</p>
                </div>
            )}
            
            {!loading && pendingPayments.map(req => (
            <div key={req.id} className="bg-slate-800 rounded-xl shadow-sm border border-slate-700 p-6 flex flex-col hover:border-indigo-500 transition-colors">
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-bold uppercase tracking-wide
                            ${req.method === 'CASH' ? 'bg-amber-900/30 text-amber-300' : 'bg-indigo-900/30 text-indigo-300'}`}>
                            {req.method === 'CASH' ? <Banknote className="w-3 h-3 mr-1"/> : <CreditCard className="w-3 h-3 mr-1"/>}
                            {req.method.replace('_', ' ')}
                        </span>
                        <h3 className="font-bold text-white mt-2 text-lg">{req.requesterName}</h3>
                    </div>
                </div>
                <div className="mb-4">
                    <p className="text-3xl font-bold text-white tracking-tight">{CURRENCY_SYMBOL}{req.amount.toFixed(2)}</p>
                </div>
                <p className="text-sm text-gray-400 mb-6 bg-slate-900/50 p-3 rounded border border-slate-800 flex-grow">
                    {req.purpose}
                </p>
                <button 
                    onClick={() => handleProcessClick(req)}
                    className="mt-auto w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 px-4 rounded-lg flex items-center justify-center transition-all shadow-lg shadow-indigo-900/20"
                >
                    Process Payment <ArrowRight className="ml-2 w-4 h-4" />
                </button>
            </div>
            ))}
        </div>
      </div>

      {/* History Section */}
      <div>
         <h2 className="text-lg font-semibold text-white mb-4 flex items-center">
            <CheckCircle className="w-5 h-5 mr-2 text-green-500" />
            Payment History
         </h2>

         {/* Desktop History Table */}
         <div className="hidden md:block bg-slate-800 shadow rounded-lg overflow-hidden border border-slate-700">
            <table className="min-w-full divide-y divide-slate-700">
                <thead className="bg-slate-900">
                    <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Date Processed</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Recipient</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Method</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Amount</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Processed By</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">Reference</th>
                    </tr>
                </thead>
                <tbody className="bg-slate-800 divide-y divide-slate-700">
                    {loading ? (
                         <tr><td colSpan={6} className="text-center py-6 text-gray-500">Loading history...</td></tr>
                    ) : history.map((disb) => (
                    <tr key={disb.id} className="hover:bg-slate-700 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                        {new Date(disb.processedAt).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">
                        {disb.requesterName}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                            {disb.method.replace('_', ' ')}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-white font-bold">
                        {CURRENCY_SYMBOL}{disb.amount.toFixed(2)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                        {disb.processedBy}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-500 font-mono">
                        {disb.transactionRef || 'CASH-SIG'}
                        </td>
                    </tr>
                    ))}
                    {!loading && history.length === 0 && (
                        <tr><td colSpan={6} className="text-center py-6 text-gray-500">No payment history available.</td></tr>
                    )}
                </tbody>
            </table>
         </div>

         {/* Mobile History Cards */}
         <div className="md:hidden space-y-4">
            {!loading && history.map((disb) => (
                <div key={disb.id} className="bg-slate-800 p-4 rounded-lg border border-slate-700 shadow-sm">
                    <div className="flex justify-between items-start mb-2">
                        <h4 className="text-white font-semibold text-sm">{disb.requesterName}</h4>
                        <span className="text-xs text-gray-500">{new Date(disb.processedAt).toLocaleDateString()}</span>
                    </div>
                    <div className="flex justify-between items-center mb-3">
                        <span className="text-xs text-gray-400 bg-slate-900 px-2 py-1 rounded">{disb.method.replace('_', ' ')}</span>
                        <span className="text-white font-bold">{CURRENCY_SYMBOL}{disb.amount.toFixed(2)}</span>
                    </div>
                    <div className="pt-2 border-t border-slate-700/50 flex justify-between items-center text-xs">
                        <span className="text-gray-500">By: <span className="text-indigo-400">{disb.processedBy}</span></span>
                        <span className="text-gray-600 font-mono">{disb.transactionRef || 'CASH'}</span>
                    </div>
                </div>
            ))}
            {!loading && history.length === 0 && (
                <div className="text-center py-6 text-gray-500 bg-slate-800 rounded-lg border border-slate-700">
                    No payment history available.
                </div>
            )}
         </div>
      </div>

      {/* Processing Modal */}
      <Modal
        isOpen={!!selectedReq}
        onClose={() => setSelectedReq(null)}
        title={`Process ${selectedReq?.method.replace('_', ' ')} Payment`}
      >
        {selectedReq && (
            <div className="space-y-4">
                <div className="bg-indigo-900/30 border border-indigo-800 p-4 rounded-lg mb-4">
                     <p className="text-sm text-indigo-300">Processing payment of <strong>{CURRENCY_SYMBOL}{selectedReq.amount.toFixed(2)}</strong> for {selectedReq.purpose}.</p>
                </div>

                {selectedReq.method === 'CASH' ? (
                    <>
                        <div className="space-y-3">
                            <div>
                                <label className="block text-sm font-medium text-gray-300">Cash Receiver Name</label>
                                <input 
                                    type="text" 
                                    className="mt-1 block w-full rounded-md border-slate-600 bg-slate-700 text-white border p-2 shadow-sm focus:border-indigo-500"
                                    value={cashDetails.receiverName}
                                    onChange={(e) => setCashDetails({...cashDetails, receiverName: e.target.value})}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1">Receiver Signature (Required)</label>
                                <div className="bg-white rounded p-1">
                                    <SignaturePad onEnd={(sig) => setCashDetails({...cashDetails, signature: sig})} />
                                </div>
                            </div>
                        </div>
                    </>
                ) : (
                    <>
                         {selectedReq.accountNumber && (
                             <div className="bg-slate-700 p-3 rounded mb-2 border border-slate-600">
                                <h4 className="text-xs font-bold text-gray-400 uppercase mb-2">Requester's Bank Details</h4>
                                <div className="grid grid-cols-2 gap-2 text-sm">
                                    <div className="col-span-2"><span className="text-gray-500">Bank:</span> <span className="text-white">{selectedReq.bankName}</span></div>
                                    <div><span className="text-gray-500">Acct No:</span> <span className="text-white font-mono">{selectedReq.accountNumber}</span></div>
                                    <div><span className="text-gray-500">Name:</span> <span className="text-white">{selectedReq.accountName}</span></div>
                                </div>
                             </div>
                         )}

                         <div className="space-y-3">
                            <div>
                                <label className="block text-sm font-medium text-gray-300">Bank Name / Provider</label>
                                <input 
                                    type="text" 
                                    className="mt-1 block w-full rounded-md border-slate-600 bg-slate-700 text-white border p-2 shadow-sm focus:border-indigo-500"
                                    placeholder="e.g. Chase, PayPal"
                                    value={bankDetails.bankName}
                                    onChange={(e) => setBankDetails({...bankDetails, bankName: e.target.value})}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-300">Account Number / ID</label>
                                <input 
                                    type="text" 
                                    className="mt-1 block w-full rounded-md border-slate-600 bg-slate-700 text-white border p-2 shadow-sm focus:border-indigo-500"
                                    value={bankDetails.accountNo}
                                    onChange={(e) => setBankDetails({...bankDetails, accountNo: e.target.value})}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-300">Transaction Reference</label>
                                <input 
                                    type="text" 
                                    className="mt-1 block w-full rounded-md border-slate-600 bg-slate-700 text-white border p-2 shadow-sm focus:border-indigo-500"
                                    placeholder="Ref #123456"
                                    value={bankDetails.ref}
                                    onChange={(e) => setBankDetails({...bankDetails, ref: e.target.value})}
                                />
                            </div>
                        </div>
                    </>
                )}

                <div className="mt-6">
                    <button
                        onClick={handleFinalize}
                        className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none"
                    >
                        Confirm & Mark Paid
                    </button>
                </div>
            </div>
        )}
      </Modal>
    </Layout>
  );
};

export default Disbursements;