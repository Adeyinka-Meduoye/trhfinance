import React, { useState } from 'react';
import Layout from '../components/Layout';
import { DEPARTMENTS, APP_NAME, CURRENCY_SYMBOL } from '../constants';
import { submitRequest } from '../services/dataService';
import { PaymentMethod } from '../types';
import { CheckCircle, AlertCircle, Loader2 } from 'lucide-react';

const PublicRequest = () => {
  const [formData, setFormData] = useState({
    requesterName: '',
    department: DEPARTMENTS[0],
    amount: '',
    purpose: '',
    method: 'BANK_TRANSFER' as PaymentMethod,
    dateNeeded: '',
    attachmentUrl: '',
    bankName: '',
    accountName: '',
    accountNumber: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedId, setSubmittedId] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
        const result = await submitRequest({
            ...formData,
            amount: parseFloat(formData.amount)
        });
        if (result && result.id) {
            setSubmittedId(result.id);
        } else {
            throw new Error("No ID returned from server");
        }
    } catch (error) {
        console.error(error);
        alert("Failed to submit request. Please try again or contact support.");
    } finally {
        setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  if (submittedId) {
    return (
      <Layout>
        <div className="max-w-xl mx-auto mt-10 p-8 bg-slate-800 shadow-lg rounded-xl text-center border-t-4 border-green-500">
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-900/50 mb-4">
            <CheckCircle className="h-8 w-8 text-green-500" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Request Submitted!</h2>
          <p className="text-gray-400 mb-6">Your payment request has been securely recorded in the finance system.</p>
          
          <div className="bg-slate-900 p-4 rounded-lg border border-slate-700 mb-6">
            <p className="text-sm text-gray-500 mb-1 uppercase tracking-wide font-semibold">Tracking ID</p>
            <p className="text-3xl font-mono font-bold text-indigo-400 select-all cursor-pointer hover:text-indigo-300" onClick={() => navigator.clipboard.writeText(submittedId)}>{submittedId}</p>
            <p className="text-xs text-gray-500 mt-2">Save this ID to check your status later.</p>
          </div>
          
          <button 
            onClick={() => { setSubmittedId(null); setFormData({ ...formData, amount: '', purpose: '', bankName: '', accountName: '', accountNumber: '' }); }}
            className="text-indigo-400 hover:text-indigo-300 font-medium"
          >
            Submit Another Request
          </button>
        </div>
      </Layout>
    );
  }

  const showBankDetails = formData.method === 'BANK_TRANSFER' || formData.method === 'POS';

  return (
    <Layout>
      <div className="max-w-2xl mx-auto mt-6 bg-slate-800 shadow-md rounded-lg overflow-hidden border border-slate-700">
        <div className="px-6 py-4 bg-indigo-700">
            <h1 className="text-xl font-bold text-white">New Fund Request</h1>
            <p className="text-indigo-200 text-sm">Submit fund requests to {APP_NAME}.</p>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-300">Full Name</label>
              <input
                type="text"
                name="requesterName"
                required
                className="mt-1 block w-full rounded-md border-slate-600 bg-slate-700 text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2 placeholder-gray-400"
                value={formData.requesterName}
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300">Organisation / Department</label>
              <select
                name="department"
                required
                className="mt-1 block w-full rounded-md border-slate-600 bg-slate-700 text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2"
                value={formData.department}
                onChange={handleChange}
              >
                {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-300">Amount</label>
              <div className="relative mt-1 rounded-md shadow-sm">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <span className="text-gray-400 sm:text-sm">{CURRENCY_SYMBOL}</span>
                </div>
                <input
                  type="number"
                  name="amount"
                  required
                  min="0.01"
                  step="0.01"
                  className="block w-full rounded-md border-slate-600 bg-slate-700 text-white pl-8 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2 placeholder-gray-400"
                  placeholder="0.00"
                  value={formData.amount}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300">Date Needed</label>
              <input
                type="date"
                name="dateNeeded"
                required
                className="mt-1 block w-full rounded-md border-slate-600 bg-slate-700 text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2"
                value={formData.dateNeeded}
                onChange={handleChange}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300">Preferred Payment Method</label>
            <div className="mt-2 grid grid-cols-2 gap-3 sm:grid-cols-3">
               {(['BANK_TRANSFER', 'POS', 'CASH'] as const).map((method) => (
                  <label key={method} className={`cursor-pointer rounded-md border p-3 text-center text-xs font-semibold uppercase hover:bg-slate-600 ${formData.method === method ? 'ring-2 ring-indigo-500 border-transparent bg-indigo-900/50 text-indigo-300' : 'border-slate-600 bg-slate-700 text-gray-400'}`}>
                    <input type="radio" name="method" value={method} className="sr-only" checked={formData.method === method} onChange={handleChange} />
                    {method.replace('_', ' ')}
                  </label>
               ))}
            </div>
            {formData.method === 'CASH' && (
                <p className="mt-2 text-xs text-amber-500 flex items-center">
                    <AlertCircle className="w-3 h-3 mr-1" />
                    Note: Cash payments require a digital signature upon receipt.
                </p>
            )}
          </div>

          {showBankDetails && (
            <div className="bg-slate-700/50 p-4 rounded-lg border border-slate-600 space-y-4 animate-fade-in-up">
                <h3 className="text-sm font-semibold text-indigo-300 uppercase tracking-wide">Account Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-300">Bank Name</label>
                        <input
                            type="text"
                            name="bankName"
                            required
                            placeholder="e.g. GTBank, Zenith Bank"
                            className="mt-1 block w-full rounded-md border-slate-600 bg-slate-700 text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2 placeholder-gray-400"
                            value={formData.bankName}
                            onChange={handleChange}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-300">Account Number</label>
                        <input
                            type="text"
                            name="accountNumber"
                            required
                            placeholder="0123456789"
                            className="mt-1 block w-full rounded-md border-slate-600 bg-slate-700 text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2 placeholder-gray-400"
                            value={formData.accountNumber}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-300">Account Name</label>
                        <input
                            type="text"
                            name="accountName"
                            required
                            placeholder="Matches full name"
                            className="mt-1 block w-full rounded-md border-slate-600 bg-slate-700 text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2 placeholder-gray-400"
                            value={formData.accountName}
                            onChange={handleChange}
                        />
                    </div>
                </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-300">Purpose / Description</label>
            <textarea
              name="purpose"
              required
              rows={3}
              className="mt-1 block w-full rounded-md border-slate-600 bg-slate-700 text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2 placeholder-gray-400"
              value={formData.purpose}
              onChange={handleChange}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300">Attachment / Receipt Link (Optional)</label>
            <input
              type="url"
              name="attachmentUrl"
              placeholder="https://drive.google.com/..."
              className="mt-1 block w-full rounded-md border-slate-600 bg-slate-700 text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2 placeholder-gray-400"
              value={formData.attachmentUrl}
              onChange={handleChange}
            />
            <p className="text-xs text-gray-500 mt-1">Paste a link to your Google Drive invoice or receipt.</p>
          </div>

          <div className="pt-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
            >
              {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Submitting...
                  </>
              ) : "Submit Request"}
            </button>
          </div>

        </form>
      </div>
    </Layout>
  );
};

export default PublicRequest;