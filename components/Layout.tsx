import React, { ReactNode, useState } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  FileText, 
  CreditCard, 
  TrendingUp, 
  ClipboardList, 
  LogOut,
  Menu,
  X,
  ShieldCheck,
  UserCircle
} from 'lucide-react';
import { APP_NAME, STORAGE_KEYS, LOGO_URL } from '../constants';

interface LayoutProps {
  children: ReactNode;
  isAdmin?: boolean;
}

const Layout: React.FC<LayoutProps> = ({ children, isAdmin = false }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [publicMenuOpen, setPublicMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const currentUser = localStorage.getItem(STORAGE_KEYS.USER) || 'Admin';

  const handleLogout = () => {
    localStorage.removeItem('trh_admin_auth');
    localStorage.removeItem(STORAGE_KEYS.USER);
    navigate('/');
  };

  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/admin/dashboard' },
    { icon: FileText, label: 'Requests', path: '/admin/requests' },
    { icon: CreditCard, label: 'Disbursements', path: '/admin/disbursements' },
    { icon: TrendingUp, label: 'Ledger', path: '/admin/ledger' },
    { icon: ClipboardList, label: 'Audit Logs', path: '/admin/audit' },
  ];

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-900 text-gray-100">
        <header className="bg-slate-800 shadow-sm border-b border-slate-700 sticky top-0 z-30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center">
                 {/* Logo Image */}
                 <img src={LOGO_URL} alt="Logo" className="h-10 w-auto mr-3 object-contain" onError={(e) => {
                    // Fallback if image not found
                    e.currentTarget.style.display = 'none';
                    e.currentTarget.parentElement?.querySelector('.fallback-logo')?.classList.remove('hidden');
                 }}/>
                 <div className="bg-indigo-600 p-2 rounded-lg mr-3 fallback-logo hidden">
                    <ShieldCheck className="h-6 w-6 text-white" />
                 </div>
                 <Link to="/" className="font-bold text-xl text-white tracking-tight hover:text-gray-200 transition-colors">{APP_NAME}</Link>
              </div>
              
              {/* Desktop Navigation */}
              <div className="hidden md:flex space-x-4">
                <Link to="/" className="text-gray-300 hover:text-white hover:bg-slate-700 px-3 py-2 rounded-md text-sm font-medium transition-colors">Submit Request</Link>
                <Link to="/status" className="text-gray-300 hover:text-white hover:bg-slate-700 px-3 py-2 rounded-md text-sm font-medium transition-colors">Check Status</Link>
                <Link to="/admin/login" className="text-indigo-400 hover:text-indigo-300 px-3 py-2 rounded-md text-sm font-medium transition-colors">Admin</Link>
              </div>

              {/* Mobile Menu Button */}
              <div className="flex md:hidden">
                <button
                  onClick={() => setPublicMenuOpen(!publicMenuOpen)}
                  className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
                  aria-expanded="false"
                >
                  <span className="sr-only">Open main menu</span>
                  {publicMenuOpen ? (
                    <X className="block h-6 w-6" aria-hidden="true" />
                  ) : (
                    <Menu className="block h-6 w-6" aria-hidden="true" />
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Mobile Navigation Menu */}
          {publicMenuOpen && (
            <div className="md:hidden bg-slate-800 border-t border-slate-700">
              <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                <Link 
                  to="/" 
                  onClick={() => setPublicMenuOpen(false)}
                  className="text-gray-300 hover:text-white hover:bg-slate-700 block px-3 py-2 rounded-md text-base font-medium"
                >
                  Submit Request
                </Link>
                <Link 
                  to="/status" 
                  onClick={() => setPublicMenuOpen(false)}
                  className="text-gray-300 hover:text-white hover:bg-slate-700 block px-3 py-2 rounded-md text-base font-medium"
                >
                  Check Status
                </Link>
                <Link 
                  to="/admin/login" 
                  onClick={() => setPublicMenuOpen(false)}
                  className="text-indigo-400 hover:text-indigo-300 hover:bg-slate-900 block px-3 py-2 rounded-md text-base font-medium"
                >
                  Admin Portal
                </Link>
              </div>
            </div>
          )}
        </header>
        <main className="flex-grow">
          {children}
        </main>
        <footer className="bg-slate-800 border-t border-slate-700 mt-auto">
          <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex flex-col items-center">
            <p className="text-center text-sm text-gray-500">© {new Date().getFullYear()} {APP_NAME}. Secure Finance System.</p>
            <p className="text-center text-xs text-indigo-400 mt-2 font-medium opacity-80 hover:opacity-100 transition-opacity">Developed by MEDUS TECHNOLOGIES</p>
          </div>
        </footer>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 flex text-gray-100">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 bg-slate-900 bg-opacity-75 md:hidden" onClick={() => setSidebarOpen(false)}></div>
      )}

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-slate-950 text-white transform transition-transform duration-300 ease-in-out ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:relative md:translate-x-0 border-r border-slate-800`}>
        <div className="flex items-center justify-between h-16 px-4 bg-slate-950 border-b border-slate-800">
          <div className="flex items-center">
             <img src={LOGO_URL} alt="Logo" className="h-8 w-auto mr-2 object-contain" onError={(e) => {
                    e.currentTarget.style.display = 'none';
                    e.currentTarget.parentElement?.querySelector('.fallback-logo-sm')?.classList.remove('hidden');
             }}/>
             <div className="bg-indigo-600 p-1 rounded mr-2 fallback-logo-sm hidden">
                <ShieldCheck className="h-5 w-5 text-white" />
             </div>
             <span className="font-bold text-lg tracking-tight">TRH Finance</span>
          </div>
          <button className="md:hidden" onClick={() => setSidebarOpen(false)}>
            <X className="h-6 w-6 text-gray-400" />
          </button>
        </div>

        {/* User Info */}
        <div className="px-4 py-4 bg-slate-900 border-b border-slate-800 flex items-center">
            <UserCircle className="w-8 h-8 text-indigo-500 mr-3" />
            <div className="overflow-hidden">
                <p className="text-xs text-gray-400 uppercase tracking-wider font-semibold">Logged in as</p>
                <p className="text-sm font-bold text-white truncate">{currentUser}</p>
            </div>
        </div>

        <nav className="mt-5 px-2 space-y-1">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={`group flex items-center px-2 py-3 text-base font-medium rounded-md transition-colors ${isActive ? 'bg-indigo-600 text-white' : 'text-slate-300 hover:bg-slate-800 hover:text-white'}`}
              >
                <item.icon className="mr-3 h-5 w-5 flex-shrink-0" />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="absolute bottom-0 w-full p-4 bg-slate-950 border-t border-slate-800">
            <button 
                onClick={handleLogout}
                className="flex items-center w-full px-2 py-2 text-sm font-medium text-red-400 hover:text-red-300 transition-colors hover:bg-slate-900 rounded"
            >
                <LogOut className="mr-3 h-5 w-5" />
                Sign Out
            </button>
            <div className="mt-4 pt-4 border-t border-slate-800 text-center">
               <p className="text-[10px] text-gray-600 uppercase tracking-wider">Developed By</p>
               <p className="text-xs text-indigo-500 font-bold mt-1">MEDUS TECHNOLOGIES</p>
            </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-slate-800 shadow z-10 md:hidden border-b border-slate-700">
          <div className="px-4 h-16 flex items-center justify-between">
            <button
              onClick={() => setSidebarOpen(true)}
              className="text-gray-400 hover:text-white focus:outline-none"
            >
              <Menu className="h-6 w-6" />
            </button>
            <span className="font-semibold text-white">{APP_NAME}</span>
            <div className="w-6"></div> {/* Spacer */}
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 md:p-8 bg-slate-900">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;