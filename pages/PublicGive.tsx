import React, { useState } from 'react';
import Layout from '../components/Layout';
import { APP_NAME, INCOME_CATEGORIES } from '../constants';
import { Heart, Landmark, Smartphone, QrCode, Copy, CheckCircle2, CreditCard, AlertCircle, Lock, MessageCircle, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';
import FinanceContactModal from '../components/FinanceContactModal';


const PublicGive = () => {
  const [copied, setCopied] = useState<string | null>(null);
  const [activeQR, setActiveQR] = useState(0);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopied(label);
    setTimeout(() => setCopied(null), 2000);
  };

  const bankAccounts = [
    {
      bank: "Zenith Bank",
      accountName: "THE REINVENTION HOUSE MINISTRIES GLOBAL",
      accountNumber: "1015697113",
      purpose: "Offering / Tithes",
      color: "bg-red-500/10 border-red-500/20 text-red-400"
    },
    {
      bank: "Ecobank",
      accountName: "Simon Priestley Adeola",
      accountNumber: "4891054598",
      purpose: "Prophetic Seed",
      color: "bg-purple-500/10 border-purple-500/20 text-purple-400"
    },
    {
      bank: "Stanbic IBTC Bank",
      accountName: "Simon Priestley Adeola",
      accountNumber: "9201290590",
      purpose: "Projects",
      color: "bg-orange-500/10 border-orange-500/20 text-orange-400"
    }
  ];

  const qrData = `Bank: ${bankAccounts[activeQR].bank}\nAccount: ${bankAccounts[activeQR].accountNumber}\nName: ${bankAccounts[activeQR].accountName}`;

  return (
    <Layout>
      <div className="relative isolate min-h-screen bg-slate-950 py-24 px-6">
        {/* Background Image Layer */}
        <div className="absolute inset-0 -z-20 overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?auto=format&fit=crop&q=80&w=2000"
            alt="Giving Background"
            className="h-full w-full object-cover opacity-30 scale-105 animate-pulse-slow"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-slate-950/60"></div>
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-slate-950/40 to-slate-950"></div>
        </div>

        {/* Decorative Background Blur */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-indigo-600/10 blur-[120px] rounded-full"></div>
        </div>

        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center justify-center p-4 rounded-2xl bg-indigo-500/10 mb-6 ring-1 ring-indigo-500/20">
              <Heart className="h-10 w-10 text-indigo-500 fill-indigo-500/20" />
            </div>
            <h1 className="text-4xl font-extrabold sm:text-5xl mb-6 tracking-tight">
              <span className="animate-gradient-white-grey">Give Freely. Give Joyfully. Give with Purpose.</span>
            </h1>
            <div className="max-w-2xl mx-auto">
              <p className="text-lg font-bold text-indigo-400 mb-2 italic">2 Corinthians 9:7</p>
              <p className="text-lg text-slate-400 leading-relaxed italic">
                “Each of you should give what you have decided in your heart to give, not reluctantly or under compulsion, for God loves a cheerful giver.”
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Online Giving Section - Coming Soon */}
            <div className="lg:col-span-3">
              <div className="bg-slate-900/50 backdrop-blur-xl rounded-3xl p-10 border border-indigo-500/30 shadow-2xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 -m-4 h-32 w-32 bg-indigo-500/10 rounded-full blur-3xl group-hover:bg-indigo-500/20 transition-all duration-700"></div>
                <div className="absolute bottom-0 left-0 -m-4 h-24 w-24 bg-purple-500/10 rounded-full blur-2xl"></div>
                
                <div className="flex flex-col md:flex-row items-center justify-between gap-10 relative z-10">
                  <div className="max-w-xl text-center md:text-left">
                    <div className="flex items-center justify-center md:justify-start gap-3 mb-6">
                      <div className="p-3 rounded-2xl bg-indigo-500/10 ring-1 ring-indigo-500/20">
                        <CreditCard className="h-8 w-8 text-indigo-400" />
                      </div>
                      <div className="inline-flex items-center px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-[10px] font-black text-indigo-400 uppercase tracking-widest animate-pulse">
                        Coming Soon
                      </div>
                    </div>
                    <h2 className="text-3xl font-black text-white mb-4 tracking-tight">Direct Online Giving</h2>
                    <p className="text-lg text-slate-400 leading-relaxed">
                      We are currently setting up our secure online payment gateway to make your giving experience even smoother. 
                      Soon, you'll be able to give directly using your card or bank app with just a few clicks.
                    </p>
                  </div>

                  <div className="w-full max-w-sm">
                    <div className="bg-slate-950/50 p-8 rounded-3xl border border-slate-800/50 backdrop-blur-md flex flex-col items-center text-center space-y-6 relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-transparent opacity-50"></div>
                      <div className="p-4 rounded-full bg-indigo-500/10 relative">
                        <Sparkles className="h-10 w-10 text-indigo-400 animate-pulse" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-white mb-2">Almost Ready!</h3>
                        <p className="text-sm text-slate-500">
                          Our team is finalizing the integration. In the meantime, please use the 
                          <span className="text-indigo-400 font-bold"> Bank Transfer</span> or 
                          <span className="text-indigo-400 font-bold"> USSD</span> options below.
                        </p>
                      </div>
                      <div className="w-full h-px bg-gradient-to-r from-transparent via-slate-800 to-transparent"></div>
                      <p className="text-[10px] text-slate-600 uppercase font-black tracking-[0.2em]">
                        Securely Powered by Paystack
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Bank Transfer Section */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-slate-900/50 backdrop-blur-xl rounded-3xl p-8 border border-slate-800 shadow-2xl">
                <div className="flex items-center gap-3 mb-8">
                  <div className="p-2 rounded-lg bg-indigo-500/10">
                    <Landmark className="h-6 w-6 text-indigo-400" />
                  </div>
                  <h2 className="text-2xl font-bold text-white">Bank Transfer</h2>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {bankAccounts.map((acc, index) => (
                    <div 
                      key={index} 
                      onClick={() => setActiveQR(index)}
                      className={`bg-slate-950 rounded-2xl p-6 border transition-all group relative overflow-hidden cursor-pointer ${activeQR === index ? 'border-indigo-500 ring-1 ring-indigo-500/50' : 'border-slate-800 hover:border-indigo-500/50'}`}
                    >
                      <div className={`absolute top-0 right-0 px-3 py-1 text-[10px] font-bold uppercase tracking-widest rounded-bl-lg ${acc.color}`}>
                        {acc.purpose.split(' ')[0]}
                      </div>
                      <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">{acc.purpose}</p>
                      <h3 className="text-xl font-black text-white mb-6">{acc.bank}</h3>
                      
                      <div className="space-y-4">
                        <div className="flex flex-col">
                          <span className="text-[10px] text-slate-500 uppercase font-bold tracking-widest mb-1">Account Number</span>
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              copyToClipboard(acc.accountNumber, acc.bank);
                            }}
                            className="flex items-center justify-between group/btn bg-slate-900 p-3 rounded-xl border border-slate-800 hover:bg-slate-800 transition-all"
                          >
                            <span className="font-mono font-bold text-xl text-indigo-400">{acc.accountNumber}</span>
                            {copied === acc.bank ? <CheckCircle2 className="h-5 w-5 text-green-500" /> : <Copy className="h-5 w-5 text-slate-600 group-hover/btn:text-indigo-400" />}
                          </button>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[10px] text-slate-500 uppercase font-bold tracking-widest mb-1">Account Name</span>
                          <span className="text-sm font-bold text-slate-200 bg-slate-900/50 p-3 rounded-xl border border-slate-800/50">{acc.accountName}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="mt-8 p-4 rounded-xl bg-indigo-500/5 border border-indigo-500/10 flex items-start gap-3">
                    <div className="mt-1 p-1 rounded-full bg-indigo-500/20">
                        <CheckCircle2 className="h-3 w-3 text-indigo-400" />
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed italic">
                        Please include your name or the specific purpose (e.g., "Tithes", "Project") in the transfer narration to help our finance team with accurate record-keeping.
                    </p>
                </div>
              </div>
            </div>

            {/* Other Methods */}
            <div className="space-y-6">
              <div className="bg-slate-900/50 backdrop-blur-xl rounded-3xl p-8 border border-slate-800 shadow-2xl">
                <div className="flex items-center gap-3 mb-8">
                  <div className="p-2 rounded-lg bg-indigo-500/10">
                    <Smartphone className="h-6 w-6 text-indigo-400" />
                  </div>
                  <h2 className="text-2xl font-bold text-white">USSD Quick Pay</h2>
                </div>
                <div className="space-y-4">
                  <div className="group flex flex-col p-4 bg-slate-950 rounded-2xl border border-slate-800 hover:border-indigo-500/30 transition-all">
                    <span className="text-xs font-bold text-slate-500 uppercase mb-2">Zenith Bank</span>
                    <code className="text-indigo-400 font-black text-lg tracking-wider">*966*000*1015697113#</code>
                  </div>
                  <div className="group flex flex-col p-4 bg-slate-950 rounded-2xl border border-slate-800 hover:border-indigo-500/30 transition-all">
                    <span className="text-xs font-bold text-slate-500 uppercase mb-2">Ecobank</span>
                    <code className="text-indigo-400 font-black text-lg tracking-wider">*326*4891054598#</code>
                  </div>
                  <div className="group flex flex-col p-4 bg-slate-950 rounded-2xl border border-slate-800 hover:border-indigo-500/30 transition-all">
                    <span className="text-xs font-bold text-slate-500 uppercase mb-2">Stanbic IBTC</span>
                    <code className="text-indigo-400 font-black text-lg tracking-wider">*909*11*9201290590#</code>
                  </div>
                </div>
              </div>

              <div className="relative group overflow-hidden bg-gradient-to-br from-indigo-600 to-purple-700 rounded-3xl p-8 shadow-2xl shadow-indigo-500/20">
                <div className="absolute top-0 right-0 -m-8 h-32 w-32 bg-white/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700"></div>
                <QrCode className="h-12 w-12 text-white/50 mb-6" />
                <h2 className="text-2xl font-bold text-white mb-2">Scan & Give</h2>
                <p className="text-sm text-indigo-100/80 mb-6 leading-relaxed">
                  Fast and secure giving directly from your banking app. Select an account to update the QR code.
                </p>
                <div className="aspect-square w-full bg-white rounded-2xl border-2 border-dashed border-white/20 flex items-center justify-center backdrop-blur-sm p-4">
                  <div className="text-center w-full h-full flex flex-col items-center justify-center">
                    <QRCodeSVG 
                      value={qrData} 
                      size={200}
                      level="H"
                      includeMargin={true}
                      className="w-full h-full max-w-[180px] max-h-[180px]"
                    />
                    <span className="text-[10px] text-slate-900 uppercase font-black tracking-widest mt-2">{bankAccounts[activeQR].bank}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-16 bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-3xl p-10 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-indigo-600/5 pointer-events-none"></div>
            <h2 className="text-3xl font-black text-white mb-4">Need Help with Giving or Requests?</h2>
            <p className="text-slate-400 mb-8 max-w-xl mx-auto">Our finance team is here to guide you through contributions and support requests with clarity and ease.</p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <button 
                  onClick={() => setIsContactModalOpen(true)}
                  className="w-full sm:w-auto px-8 py-4 animate-gradient-logo-bg text-white font-bold rounded-xl hover:shadow-lg hover:shadow-indigo-500/20 transition-all transform hover:-translate-y-1 flex items-center justify-center gap-2"
                >
                    <MessageCircle className="h-5 w-5" />
                    Contact Finance Team
                </button>
                <Link to="/request" className="w-full sm:w-auto px-8 py-4 bg-slate-800 text-white font-bold rounded-xl hover:bg-slate-700 transition-all border border-slate-700">
                    Submit Fund Request
                </Link>
            </div>
          </div>
        </div>
      </div>
      
      <FinanceContactModal 
        isOpen={isContactModalOpen} 
        onClose={() => setIsContactModalOpen(false)} 
      />
    </Layout>
  );
};

export default PublicGive;
