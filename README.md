# Finance Disbursement & Expense Tracker

## Overview

Finance Disbursement & Expense Tracker is a lightweight web-based finance management application designed for small organizations, church departments, teams, and internal groups that need **transparent, traceable, and cash-controlled financial operations** without complex software.

The system replaces informal cash handling with a simple digital workflow while still allowing controlled cash payments when necessary. All financial records are stored in **Google Sheets**, making the system affordable, accessible, and easy to maintain without dedicated servers or databases.

---

## Purpose

The application exists to:

* Reduce or eliminate unnecessary cash transactions
* Improve financial accountability and transparency
* Simplify reporting and auditing
* Provide real-time visibility into income and expenses
* Maintain verifiable evidence for every disbursement

---

## Core Principles

* **Simplicity** – Designed for non-technical users
* **Transparency** – Every transaction is recorded and traceable
* **Accountability** – Approvals and audit logs are automatic
* **Accessibility** – Works on mobile and desktop
* **Evidence-Driven** – Digital proof is required for cash payments

---

## Key Features

### 1. Public Request Submission

Users can submit fund or expense requests without creating an account.
Each request generates a unique Request ID that can later be used to check status.

**Fields include:**

* Name
* Department
* Amount
* Purpose
* Preferred Payment Method (Electronic or Cash)
* Attachment / Receipt Link
* Date Needed

---

### 2. Admin Finance Dashboard

Accessible only through a secure passcode.
Provides a full overview of financial health and activity.

**Dashboard Displays:**

* Current Balance
* Total Income
* Total Expenses
* Pending Requests
* Recent Transactions
* Monthly Financial Charts
* Cash vs Electronic Payment Ratio

---

### 3. Electronic Disbursement Tracking

For bank transfers, POS, or wallet payments, the system records:

* Transaction Reference
* Bank Details
* Amount Sent
* Date & Time
* Linked Request ID

This ensures every electronic payment is verifiable and reportable.

---

### 4. Cash Payment with Digital Signature

Cash is allowed only when necessary and requires mandatory digital evidence.

**Before a cash payment is completed:**

* The receiver signs digitally using a signature pad.
* Signature is saved as an image or encoded string.
* Optional photo or receipt upload can be added.
* Record is linked to the request and stored permanently.

This prevents undocumented cash handling and strengthens audit trails.

---

### 5. Income & Expense Ledger

Admins can manually record income and expenses.
Balances update automatically in real time, with warnings for low or negative funds.

---

### 6. Reports & Export

Generate financial reports instantly.

**Supported Outputs:**

* Monthly Reports
* Quarterly Reports
* Custom Date Range Reports
* Cash vs Electronic Breakdown
* PDF, Excel, and CSV export formats

---

### 7. Audit Trail

Every administrative action is automatically logged, including approvals, edits, and disbursements.
Records cannot be permanently deleted—only archived or updated—ensuring historical integrity.

---

### 8. Request Status Lookup

Users can check their request status using only their Request ID.
No login or account creation is required.

---

## Technology Stack

* **Frontend:** Web-based responsive interface
* **Backend Database:** Google Sheets
* **Integration:** Google Sheets API using Sheet ID
* **Security Model:** Passcode-protected Admin Area
* **Data Handling:** Create, Read, Update (No Hard Deletes)

---

## Security & Access Model

### Admin / Finance Officer

* Passcode-only access
* Can approve, reject, record payments, view reports, and manage finances

### Users / Members

* No login required
* Can submit requests and check status only
* Cannot access financial data or reports

---

## Benefits

* Eliminates undocumented cash transactions
* Increases financial transparency
* Provides instant reporting
* Requires minimal technical knowledge
* Low cost and easy deployment
* Strengthens accountability with digital evidence

---

## Ideal Use Cases

* Church departments
* Small businesses
* Non-profit organizations
* Community groups
* Internal team finance management

---

## Summary

Finance Disbursement & Expense Tracker is a practical, evidence-driven finance control system built for simplicity and accountability. By combining passcode-protected administration, Google Sheets data storage, and mandatory digital signatures for cash payments, it ensures that every financial movement is recorded, traceable, and easy to audit—without the overhead of complex enterprise software.

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`
