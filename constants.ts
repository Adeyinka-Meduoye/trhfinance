export const APP_NAME = "TRH Finance";
export const CURRENCY_SYMBOL = "₦";
export const LOGO_URL = "/logo.png"; // Place your image file in the public/root folder and name it logo.png

// TODO: Deploy the Google Apps Script and paste the Web App URL here
export const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzBhwPx2ms8ut0bQnXPb0tjK2mqywcm3t42kthqXtJU6RMeS_bycKgnZjdqpzbcq1Qt/exec"; 

// In a real deployment, these would come from env vars
export const ADMIN_PASSCODE = "trhfin"; // Default demo passcode

export const ALLOWED_USERS = [
  "Admin",
  "Finance",
  "Simon Priestley",
  "Medus"
];

// Categories for Dropdowns
export const DEPARTMENTS = [
  "Operations",
  "Admin",
  "Technical",
  "Sanctuary",
  "Music",
  "Media",
  "Protocol",
  "Medical",
  "Hospitality",
  "Drama",
  "Innovation & Technology",
  "Finance",
  "Information Desk",
  "Office of the Senior Pastor",
  "Church Secretary",
  "Children's Department",
  "Others"
];

export const EXPENSE_CATEGORIES = [
  "Honorarium",
  "Welfare",
  "Fuel & Diesel",
  "Equipment Maintenance",
  "Evangelism & Missions",
  "Office Supplies",
  "Salaries & Stipends",
  "Capital Projects",
  "Utility Bills",
  "Miscellaneous",
];

export const INCOME_CATEGORIES = [
  "Tithes",
  "Offering",
  "Thanksgiving",
  "Seed Faith",
  "First Fruit",
  "Project Offering",
  "Donations",
  "Other",
];

// Mock Data Keys (Legacy/Fallback)
export const STORAGE_KEYS = {
  SESSION: 'trh_admin_session',
  USER: 'trh_admin_username'
};