import React from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout';
import { APP_NAME } from '../constants';
import { Heart, HandCoins, ShieldCheck, ArrowRight, CheckCircle2 } from 'lucide-react';

const Home = () => {
  return (
    <Layout>
      <div className="relative isolate min-h-[calc(100vh-64px)] flex flex-col justify-center overflow-hidden bg-slate-950">
        {/* Hero Background Image with Overlay */}
        <div className="absolute inset-0 -z-10">
          <img
            src="https://images.unsplash.com/photo-1454165833767-027ffea9e778?auto=format&fit=crop&q=80&w=2000"
            alt="Finance Background"
            className="h-full w-full object-cover opacity-20"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-slate-950/80 via-slate-950/60 to-slate-950"></div>
        </div>

        {/* Decorative Blur */}
        <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80" aria-hidden="true">
          <div className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-indigo-500 to-purple-600 opacity-20 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]" style={{ clipPath: 'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)' }}></div>
        </div>

        <div className="mx-auto max-w-7xl px-6 lg:px-8 py-24 lg:py-32 flex flex-col items-center text-center">
          <div className="max-w-3xl">
            <div className="mb-8 flex justify-center">
              <div className="relative rounded-full px-3 py-1 text-sm leading-6 text-indigo-400 ring-1 ring-indigo-500/30 hover:ring-indigo-500/50 transition-all bg-indigo-500/5 flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
                </span>
                Finance Team Active
              </div>
            </div>
            <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-6xl lg:text-7xl">
              <span className="animate-gradient-white-grey">Empowering</span> <span className="animate-gradient-logo">Transparency</span> <span className="animate-gradient-white-grey">in Finance.</span>
            </h1>
            <p className="mt-8 text-lg leading-8 text-slate-300 max-w-xl mx-auto">
              Welcome to the {APP_NAME} Portal
              A simple and transparent way to give and request support, and stay informed on how funds are managed.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/give"
                className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl animate-gradient-logo-bg px-8 py-4 text-lg font-bold text-white shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/40 transition-all transform hover:-translate-y-1 active:scale-95"
              >
                <Heart className="h-5 w-5" />
                Give Now
              </Link>
              <Link
                to="/request"
                className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl bg-slate-800 px-8 py-4 text-lg font-bold text-white shadow-lg ring-1 ring-slate-700 hover:bg-slate-700 transition-all transform hover:-translate-y-1 active:scale-95"
              >
                <HandCoins className="h-5 w-5" />
                Request Fund
              </Link>
            </div>
          </div>

          {/* Pushed Down Features Section */}
          <div className="mt-24 lg:mt-32 w-full max-w-5xl">
            <div className="relative">
              <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-600 opacity-20 blur-xl"></div>
              <div className="relative bg-slate-900/80 backdrop-blur-xl border border-slate-700 rounded-2xl p-8 shadow-2xl">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="flex flex-col items-center text-center gap-4 p-4 rounded-xl bg-slate-800/50 border border-slate-700/50">
                    <div className="p-3 rounded-lg bg-indigo-500/10">
                      <ShieldCheck className="h-6 w-6 text-indigo-400" />
                    </div>
                    <div>
                      <h3 className="text-white font-semibold">Clear Records</h3>
                      <p className="text-sm text-slate-400 mt-1">Every transaction is recorded and safely stored.</p>
                    </div>
                  </div>
                  <div className="flex flex-col items-center text-center gap-4 p-4 rounded-xl bg-slate-800/50 border border-slate-700/50">
                    <div className="p-3 rounded-lg bg-green-500/10">
                      <CheckCircle2 className="h-6 w-6 text-green-400" />
                    </div>
                    <div>
                      <h3 className="text-white font-semibold">Stay Updated</h3>
                      <p className="text-sm text-slate-400 mt-1">Check your request status anytime with your unique ID.</p>
                    </div>
                  </div>
                  <div className="flex flex-col items-center text-center gap-4 p-4 rounded-xl bg-slate-800/50 border border-slate-700/50">
                    <div className="p-3 rounded-lg bg-purple-500/10">
                      <FileText className="h-6 w-6 text-purple-400" />
                    </div>
                    <div>
                      <h3 className="text-white font-semibold">Transaction Proof</h3>
                      <p className="text-sm text-slate-400 mt-1">Every payment is backed by receipts or digital confirmation.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Trust Section */}
      <div className="bg-slate-950 py-24 border-t border-slate-900">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-indigo-400 font-semibold tracking-wide uppercase text-sm">Integrity & Excellence</h2>
            <p className="mt-4 text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Professional Financial Standards
            </p>
            <p className="mt-6 text-lg leading-8 text-slate-400">
              Our system adheres to modern financial auditing standards, ensuring that every cent is accounted for and used for its intended purpose.
            </p>
          </div>
          
          <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { title: 'Secure Login', desc: 'Multi-factor authentication for all administrative access.', icon: ShieldCheck },
              { title: 'Instant Notifications', desc: 'Stay updated on your request status via real-time alerts.', icon: ArrowRight },
              { title: 'Global Standards', desc: 'Built with the latest technology for speed and reliability.', icon: CheckCircle2 }
            ].map((feature, i) => (
              <div key={i} className="bg-slate-900/50 border border-slate-800 p-8 rounded-2xl hover:border-slate-700 transition-colors">
                <feature.icon className="h-8 w-8 text-indigo-500 mb-4" />
                <h3 className="text-lg font-bold text-white">{feature.title}</h3>
                <p className="mt-2 text-slate-400 text-sm leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
};

// Helper icon
const FileText = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="M10 9H8"/><path d="M16 13H8"/><path d="M16 17H8"/></svg>
);

export default Home;
