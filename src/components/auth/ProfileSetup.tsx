import React, { useState } from 'react';
import { User, Fingerprint, Printer, ArrowRight, ShieldCheck } from 'lucide-react';

interface ProfileSetupProps {
  onComplete: (name: string, cpf: string) => void;
}

const ProfileSetup: React.FC<ProfileSetupProps> = ({ onComplete }) => {
  const [name, setName] = useState('');
  const [cpf, setCpf] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim() && cpf.trim()) {
      onComplete(name, cpf);
    }
  };

  return (
    <div className="h-screen w-full flex items-center justify-center bg-indigo-900 font-sans relative overflow-hidden">
      {/* Background Decorativo */}
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-500 rounded-full blur-[120px] opacity-20"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-400 rounded-full blur-[120px] opacity-20"></div>

      <div className="w-full max-w-md p-8 bg-white rounded-[40px] shadow-2xl relative z-10 animate-in fade-in zoom-in duration-500">
        <div className="flex flex-col items-center mb-10">
          <div className="w-20 h-20 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-xl mb-4 transform -rotate-3">
            <Printer size={40} />
          </div>
          <h1 className="text-3xl font-black text-indigo-900 tracking-tighter uppercase">PrintIA CRM</h1>
          <div className="flex items-center gap-2 mt-2">
            <ShieldCheck size={14} className="text-emerald-500" />
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Acesso do Atendente</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Seu Nome Completo</label>
            <div className="relative group">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-500 transition-colors">
                <User size={18} />
              </div>
              <input
                required
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ex: Marcelo Almeida"
                className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 pl-12 pr-6 text-sm font-bold focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all placeholder:text-slate-300"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Seu CPF (Somente números)</label>
            <div className="relative group">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-500 transition-colors">
                <Fingerprint size={18} />
              </div>
              <input
                required
                type="text"
                value={cpf}
                onChange={(e) => setCpf(e.target.value)}
                placeholder="000.000.000-00"
                className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 pl-12 pr-6 text-sm font-bold focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all placeholder:text-slate-300"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-black py-5 rounded-2xl shadow-xl shadow-indigo-200 transition-all hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-3 uppercase tracking-widest text-xs border-b-4 border-indigo-800 mt-4"
          >
            Acessar Dashboard
            <ArrowRight size={18} />
          </button>
        </form>

        <p className="mt-8 text-[9px] text-center text-slate-400 font-bold uppercase tracking-widest px-8 leading-relaxed">
          Suas informações serão salvas localmente para agilizar os próximos acessos.
        </p>
      </div>
    </div>
  );
};

export default ProfileSetup;
