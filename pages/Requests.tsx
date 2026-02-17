import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import { getRequests, updateRequestStatus } from '../services/dataService';
import { PaymentRequest } from '../types';
import { Check, X, Eye, Calendar, Building, Loader2 } from 'lucide-react';
import Modal from '../components/Modal';
import { CURRENCY_SYMBOL, STORAGE_KEYS } from '../constants';

const Requests = () => {
  const [requests, setRequests] = useState<PaymentRequest[]>([]);
  const [selectedRequest, setSelectedRequest] = useState<PaymentRequest | null>(null);
  const [rejectMode, setRejectMode] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [loading, setLoading] = useState(true);
  
  const currentUser = localStorage.getItem(STORAGE_KEYS.USER) || 'Admin';

  useEffect(() => {
    refreshData();
  }, []);

  const refreshData = async () => {
    setLoading(true);
    try {
        const reqs = await getRequests();
        
        // Helper to normalize status for sorting
        const getStatus = (r: PaymentRequest) => r.status || 'PENDING';

        const sorted = reqs.sort((a, b) => {
            const statusA = getStatus(a);
            const statusB = getStatus(b);

            if (statusA === 'PENDING' && statusB !== 'PENDING') return -1;
            if (statusA !== 'PENDING' && statusB === 'PENDING') return 1;
            return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        });
        setRequests(sorted);
    } catch (error) {
        console.error("Failed to fetch requests", error);
    } finally {
        setLoading(false);
    }
  };

  const closeModal = () => {
    setSelectedRequest(null);
    setRejectMode(false);
    setRejectionReason('');
  }

  const handleStatusChange = async (status: 'APPROVED' | 'REJECTED') => {
    if (selectedRequest) {
      if (status === 'REJECTED' && !rejectMode) {
          setRejectMode(true);
          return;
      }
      if (status === 'REJECTED' && rejectMode && !rejectionReason.trim()) {
          alert("Please provide a reason for rejection.");
          return;
      }

      await updateRequestStatus(
          selectedRequest.id, 
          status, 
          status === 'REJECTED' ? rejectionReason : undefined,
          currentUser
      );
      closeModal();
      refreshData();
    }
  };

  // Helper to safely get status
  const currentStatus = selectedRequest ? (selectedRequest.status || 'PENDING') : '';

  return (
    <Layout isAdmin>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-white">Payment Requests</h1>
        <button onClick={refreshData} className="p-2 text-gray-400 hover:text-white bg-slate-800 rounded">
            <Loader2 className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Desktop Table View */}
      <div className="hidden md:block bg-slate-800 shadow rounded-lg overflow-hidden border border-slate-700">
        <table className="min-w-full divide-y divide-slate-700">
          <thead className="bg-slate-900">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Requester</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Org/Dept</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Amount</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">Action</th>
            </tr>
          </thead>
          <tbody className="bg-slate-800 divide-y divide-slate-700">
            {loading ? (
                 <tr><td colSpan={6} className="text-center py-8 text-gray-500">Loading requests...</td></tr>
            ) : requests.map((req) => {
              const safeStatus = req.status || 'PENDING';
              return (
              <tr key={req.id} className="hover:bg-slate-700 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                  {new Date(req.createdAt).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">
                  {req.requesterName}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                  {req.department}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-white font-semibold">
                  {CURRENCY_SYMBOL}{req.amount.toFixed(2)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                    ${safeStatus === 'PENDING' ? 'bg-yellow-900/50 text-yellow-300' : 
                      safeStatus === 'APPROVED' ? 'bg-blue-900/50 text-blue-300' :
                      safeStatus === 'PAID' ? 'bg-green-900/50 text-green-300' : 
                      'bg-red-900/50 text-red-300'}`}>
                    {safeStatus}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button 
                    onClick={() => setSelectedRequest(req)}
                    className="text-indigo-400 hover:text-indigo-300"
                  >
                    View
                  </button>
                </td>
              </tr>
            )})}
            {!loading && requests.length === 0 && (
                <tr><td colSpan={6} className="text-center py-4 text-gray-500">No requests found.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden space-y-4">
        {!loading && requests.map((req) => {
          const safeStatus = req.status || 'PENDING';
          return (
          <div 
            key={req.id} 
            className="bg-slate-800 p-4 rounded-lg border border-slate-700 shadow-sm active:bg-slate-700/80 transition-colors cursor-pointer" 
            onClick={() => setSelectedRequest(req)}
          >
            <div className="flex justify-between items-start mb-3">
                <div>
                    <h3 className="text-white font-semibold text-base">{req.requesterName}</h3>
                    <div className="flex items-center text-xs text-gray-400 mt-1">
                        <Building className="w-3 h-3 mr-1" />
                        {req.department}
                    </div>
                </div>
                <div className="text-right">
                    <p className="text-white font-bold text-lg">{CURRENCY_SYMBOL}{req.amount.toFixed(2)}</p>
                    <div className="flex items-center justify-end text-xs text-gray-500 mt-1">
                        <Calendar className="w-3 h-3 mr-1" />
                        {new Date(req.createdAt).toLocaleDateString()}
                    </div>
                </div>
            </div>
            <div className="flex justify-between items-center pt-3 border-t border-slate-700/50">
                <span className={`px-2 py-1 inline-flex text-xs leading-4 font-semibold rounded-full 
                    ${safeStatus === 'PENDING' ? 'bg-yellow-900/50 text-yellow-300' : 
                      safeStatus === 'APPROVED' ? 'bg-blue-900/50 text-blue-300' :
                      safeStatus === 'PAID' ? 'bg-green-900/50 text-green-300' : 
                      'bg-red-900/50 text-red-300'}`}>
                    {safeStatus}
                </span>
                <span className="text-sm text-indigo-400 font-medium">View Details &rarr;</span>
            </div>
          </div>
        )})}
        {loading && <div className="text-center py-8 text-gray-500">Loading...</div>}
        {!loading && requests.length === 0 && (
             <div className="text-center py-8 text-gray-500 bg-slate-800 rounded-lg border border-slate-700">
                No requests found.
             </div>
        )}
      </div>

      <Modal
        isOpen={!!selectedRequest}
        onClose={closeModal}
        title="Review Request"
      >
        {selectedRequest && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                    <p className="text-gray-400">Request ID</p>
                    <p className="font-mono font-bold text-white break-all">{selectedRequest.id}</p>
                </div>
                <div>
                    <p className="text-gray-400">Amount</p>
                    <p className="font-bold text-white text-lg">{CURRENCY_SYMBOL}{selectedRequest.amount.toFixed(2)}</p>
                </div>
                <div>
                    <p className="text-gray-400">Requester</p>
                    <p className="text-white">{selectedRequest.requesterName}</p>
                </div>
                <div>
                    <p className="text-gray-400">Org/Dept</p>
                    <p className="text-white">{selectedRequest.department}</p>
                </div>
                <div className="col-span-2">
                    <p className="text-gray-400">Purpose</p>
                    <p className="text-gray-200 bg-slate-700 p-2 rounded">{selectedRequest.purpose}</p>
                </div>
                 <div className="col-span-2">
                    <p className="text-gray-400">Method</p>
                    <p className="text-white font-medium">{selectedRequest.method.replace('_', ' ')}</p>
                </div>

                {(selectedRequest.bankName || selectedRequest.accountNumber) && (
                  <div className="col-span-2 bg-slate-700 p-3 rounded mt-1 border border-slate-600">
                      <p className="text-indigo-300 text-xs uppercase tracking-wide mb-2 font-semibold">Payment Destination</p>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div className="col-span-2">
                          <span className="text-gray-400 block text-xs">Bank Name</span>
                          <span className="text-white">{selectedRequest.bankName}</span>
                        </div>
                        <div>
                          <span className="text-gray-400 block text-xs">Account Number</span>
                          <span className="text-white font-mono break-all">{selectedRequest.accountNumber}</span>
                        </div>
                        <div>
                          <span className="text-gray-400 block text-xs">Account Name</span>
                          <span className="text-white">{selectedRequest.accountName}</span>
                        </div>
                      </div>
                  </div>
                )}

                {selectedRequest.attachmentUrl && (
                    <div className="col-span-2">
                        <a href={selectedRequest.attachmentUrl} target="_blank" rel="noreferrer" className="text-indigo-400 underline flex items-center hover:text-indigo-300 break-all">
                            <Eye className="w-4 h-4 mr-1 flex-shrink-0" /> View Attachment
                        </a>
                    </div>
                )}
            </div>

            {selectedRequest.rejectionReason && (
                 <div className="mt-4 p-3 bg-red-900/30 text-red-300 text-sm rounded border border-red-800">
                    <strong className="block mb-1">Rejection Reason:</strong>
                    {selectedRequest.rejectionReason}
                </div>
            )}

            {/* CRITICAL FIX: Allow approval if status is PENDING OR missing (undefined) */}
            {(currentStatus === 'PENDING') && !rejectMode && (
                <div className="flex space-x-3 mt-6 pt-4 border-t border-slate-700 animate-fade-in-up">
                <button
                    onClick={() => handleStatusChange('REJECTED')}
                    className="flex-1 flex justify-center items-center px-4 py-2 border border-red-800 shadow-sm text-sm font-medium rounded-md text-red-300 bg-red-900/20 hover:bg-red-900/40"
                >
                    <X className="w-4 h-4 mr-2" /> Reject
                </button>
                <button
                    onClick={() => handleStatusChange('APPROVED')}
                    className="flex-1 flex justify-center items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                >
                    <Check className="w-4 h-4 mr-2" /> Approve
                </button>
                </div>
            )}

            {rejectMode && (
                <div className="mt-6 pt-4 border-t border-slate-700 animate-fade-in-up">
                    <label className="block text-sm font-medium text-red-300 mb-2">Reason for Rejection <span className="text-red-500">*</span></label>
                    <textarea 
                        className="w-full bg-slate-900 border border-slate-600 rounded p-2 text-white text-sm focus:border-red-500 focus:ring-red-500"
                        rows={3}
                        placeholder="Please explain why this request is being rejected..."
                        value={rejectionReason}
                        onChange={(e) => setRejectionReason(e.target.value)}
                        autoFocus
                    ></textarea>
                     <div className="flex space-x-3 mt-4">
                        <button
                            onClick={() => setRejectMode(false)}
                            className="flex-1 px-4 py-2 border border-slate-600 text-sm font-medium rounded-md text-gray-300 hover:bg-slate-700"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={() => handleStatusChange('REJECTED')}
                            className="flex-1 px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700"
                        >
                            Confirm Rejection
                        </button>
                    </div>
                </div>
            )}
            
            {currentStatus === 'APPROVED' && (
                <div className="mt-4 p-3 bg-blue-900/30 text-blue-300 text-sm rounded border border-blue-800">
                    This request is approved and waiting for disbursement processing.
                </div>
            )}
          </div>
        )}
      </Modal>
    </Layout>
  );
};

export default Requests;