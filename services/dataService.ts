import { PaymentRequest, Disbursement, Transaction, AuditLog, RequestStatus } from '../types';
import { GOOGLE_SCRIPT_URL, STORAGE_KEYS } from '../constants';

/**
 * PRODUCTION MODE:
 * This service now communicates with a Google Apps Script Web App acting as the backend.
 * Data is stored in Google Sheets.
 */

// Helper to handle API calls
const apiCall = async (action: string, method: 'GET' | 'POST' = 'GET', payload?: any) => {
  if (!GOOGLE_SCRIPT_URL) {
    throw new Error("Backend Configuration Missing: GOOGLE_SCRIPT_URL is empty.");
  }

  try {
    const options: RequestInit = {
      method,
    };

    if (method === 'POST' && payload) {
      options.body = JSON.stringify(payload);
    }

    // Add cache busting for GET requests to ensure fresh data
    const cacheBuster = method === 'GET' ? `&_t=${Date.now()}` : '';
    const url = `${GOOGLE_SCRIPT_URL}?action=${action}${cacheBuster}`;
    
    const response = await fetch(url, options);
    
    if (!response.ok) {
        throw new Error(`API Error: ${response.statusText}`);
    }
    
    const data = await response.json();
    
    if (data && data.error) {
        throw new Error(data.error);
    }

    return data;
  } catch (error) {
    console.error(`Error in ${action}:`, error);
    throw error;
  }
};

const getCurrentUser = () => localStorage.getItem(STORAGE_KEYS.USER) || "Admin";

// --- Requests ---

export const submitRequest = async (data: Omit<PaymentRequest, 'id' | 'status' | 'createdAt' | 'updatedAt'>): Promise<PaymentRequest> => {
  // CRITICAL FIX: Explicitly set status to PENDING before sending to backend
  // This ensures the record has a valid status even if the backend script doesn't default it.
  const payload = {
      ...data,
      status: 'PENDING'
  };
  return await apiCall('submitRequest', 'POST', payload);
};

export const getRequests = async (): Promise<PaymentRequest[]> => {
  const res = await apiCall('getRequests', 'GET');
  return Array.isArray(res) ? res : [];
};

export const getRequestById = async (id: string): Promise<PaymentRequest | undefined> => {
  const requests = await getRequests();
  // CRITICAL FIX: Case-insensitive and trimmed comparison
  return requests.find(r => r.id && r.id.trim().toLowerCase() === id.trim().toLowerCase());
};

export const updateRequestStatus = async (id: string, status: RequestStatus, reason?: string, user?: string): Promise<void> => {
  await apiCall('updateRequestStatus', 'POST', {
    id,
    status,
    reason,
    user: user || getCurrentUser()
  });
};

// --- Disbursements ---

export const createDisbursement = async (data: Omit<Disbursement, 'id' | 'processedAt'>): Promise<Disbursement> => {
  return await apiCall('createDisbursement', 'POST', {
    ...data,
    processedBy: data.processedBy || getCurrentUser()
  });
};

export const getDisbursements = async (): Promise<Disbursement[]> => {
  const res = await apiCall('getDisbursements', 'GET');
  return Array.isArray(res) ? res : [];
};

// --- Transactions (Income/Expense) ---

export const recordTransaction = async (data: Omit<Transaction, 'id'>): Promise<Transaction> => {
  return await apiCall('recordTransaction', 'POST', data);
};

export const getTransactions = async (): Promise<Transaction[]> => {
  const res = await apiCall('getTransactions', 'GET');
  return Array.isArray(res) ? res : [];
};

export const getAuditLogs = async (): Promise<AuditLog[]> => {
  const res = await apiCall('getAuditLogs', 'GET');
  return Array.isArray(res) ? res : [];
};