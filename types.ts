export type PaymentMethod = 'BANK_TRANSFER' | 'POS' | 'CASH';
export type RequestStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'PAID';
export type TransactionType = 'INCOME' | 'EXPENSE';

export interface PaymentRequest {
  id: string;
  requesterName: string;
  department: string;
  amount: number;
  purpose: string;
  method: PaymentMethod;
  dateNeeded: string;
  attachmentUrl?: string;
  status: RequestStatus;
  rejectionReason?: string;
  createdAt: string;
  updatedAt: string;
  // New fields for bank details
  bankName?: string;
  accountName?: string;
  accountNumber?: string;
}

export interface Disbursement {
  id: string;
  requestId: string;
  method: PaymentMethod;
  amount: number;
  processedBy: string;
  processedAt: string;
  // Bank details
  bankName?: string;
  accountName?: string;
  accountNumber?: string;
  transactionRef?: string;
  // Cash details
  cashReceiverName?: string;
  signatureBase64?: string; // Digital signature
  evidenceUrl?: string;
}

export interface Transaction {
  id: string;
  type: TransactionType;
  category: string;
  amount: number;
  description: string;
  date: string;
  recordedBy: string;
}

export interface AuditLog {
  id: string;
  action: string;
  module: string;
  recordId: string;
  timestamp: string;
  user: string; // "Admin" or "System"
}

export interface DashboardStats {
  totalIncome: number;
  totalExpenses: number;
  balance: number;
  pendingRequests: number;
}