import React, { useState } from 'react';
import { Printer, Bell, Search, Settings, User } from 'lucide-react';
import { LeadSidebar } from '../sidebar/LeadSidebar';
import ChatArea from '../chat/ChatArea';
import AiCopilotPanel from '../ai/AiCopilotPanel';
import { mockLeads } from '../../data/mockData';
import type { LeadStatus } from '../../types/index';

const AppLayout: React.FC = () => {
  const [leads, setLeads] = useState(mockLeads);
  const [activeLeadId, setActiveLeadId] = useState<string | null>(mockLeads[0].id);

  const activeLead = leads.find(l => l.id === activeLeadId) || null;

  const updateLeadStatus = (id: string, status: LeadStatus) => {
    setLeads(prevLeads => 
      prevLeads.map(lead => 
        lead.id === id ? { ...lead, status } : lead
      )
    );
  };

  return (
    <div className="h-screen w-full flex flex-col bg-slate-50 overflow-hidden font-sans">
      {/* Header Fixo */}
      <header className="bg-indigo-900 text-white p-4 shadow-md z-20 flex justify-between items-center shrink-0">
        <div className="flex items-center gap-3">
          <div className="bg-indigo-700 p-2 rounded-lg shadow-inner">
            <Printer size={24} className="text-white" />
          </div>
          <div>
            <h1 className="text-xl font-black tracking-tight flex items-center gap-1.5 uppercase">
              PrintIA <span className="bg-indigo-500 text-[10px] px-1.5 py-0.5 rounded font-bold tracking-normal normal-case">CRM</span>
            </h1>
            <p className="text-[10px] text-indigo-300 font-bold uppercase tracking-widest opacity-80">
              Gestão Gráfica Inteligente
            </p>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="hidden md:flex items-center bg-indigo-800/50 px-3 py-1.5 rounded-full border border-indigo-700/50">
            <Search size={16} className="text-indigo-400 mr-2" />
            <input 
              type="text" 
              placeholder="Buscar leads ou pedidos..." 
              className="bg-transparent text-sm border-none outline-none placeholder:text-indigo-400 w-64"
            />
          </div>
          
          <div className="flex items-center gap-4">
            <button className="relative p-2 hover:bg-indigo-800 rounded-full transition-colors">
              <Bell size={20} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full border border-indigo-900" />
            </button>
            <button className="p-2 hover:bg-indigo-800 rounded-full transition-colors">
              <Settings size={20} />
            </button>
            <div className="w-px h-6 bg-indigo-700 mx-2" />
            <div className="flex items-center gap-3 cursor-pointer group">
              <div className="text-right">
                <p className="text-xs font-bold leading-none">Marcelo Almeida</p>
                <p className="text-[10px] text-indigo-300 leading-none mt-1 uppercase font-bold tracking-tighter">Vendedor Sênior</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-indigo-500 flex items-center justify-center border-2 border-indigo-400 group-hover:border-white transition-all overflow-hidden shadow-lg shadow-indigo-900/50">
                <User size={24} strokeWidth={1.5} />
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 flex overflow-hidden">
        {/* Coluna 1: Sidebar de Leads */}
        <LeadSidebar 
          leads={leads} 
          activeLeadId={activeLeadId || ''} 
          onSelectLead={setActiveLeadId} 
        />

        {/* Coluna 2: Chat e Detalhes do Lead */}
        <ChatArea 
          lead={activeLead} 
          onStatusChange={updateLeadStatus} 
        />

        {/* Coluna 3: Painel da IA Copilot */}
        <AiCopilotPanel 
          activeLead={activeLead} 
        />
      </main>
    </div>
  );
};

export default AppLayout;
