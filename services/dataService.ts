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
    // We throw an error here so the UI components can catch it and display a "Configuration Needed" message
    throw new Error("Backend Configuration Missing: GOOGLE_SCRIPT_URL is empty.");
  }

  try {
    const options: RequestInit = {
      method,
    };

    // Google Apps Script Web App POST requests require special handling (text/plain) to avoid CORS preflight issues
    if (method === 'POST' && payload) {
      options.body = JSON.stringify(payload);
    }

    const url = `${GOOGLE_SCRIPT_URL}?action=${action}`;
    const response = await fetch(url, options);
    
    if (!response.ok) {
        throw new Error(`API Error: ${response.statusText}`);
    }
    
    const data = await response.json();
    
    // Check if the script returned an application-level error
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
  return await apiCall('submitRequest', 'POST', data);
};

export const getRequests = async (): Promise<PaymentRequest[]> => {
  const res = await apiCall('getRequests', 'GET');
  return Array.isArray(res) ? res : [];
};

export const getRequestById = async (id: string): Promise<PaymentRequest | undefined> => {
  const requests = await getRequests();
  return requests.find(r => r.id === id);
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