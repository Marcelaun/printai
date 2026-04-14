import React from 'react';
import type { Lead, LeadStatus } from '../../types/index';
import { Clock, Send, CheckCircle2 } from 'lucide-react';

interface LeadSidebarProps {
  leads: Lead[];
  activeLeadId: string;
  onSelectLead: (id: string) => void;
}

const statusConfig: Record<LeadStatus, { color: string, label: string, icon: any, dot: string }> = {
  aguardando: { 
    color: 'bg-amber-50 text-amber-700 border-amber-200', 
    label: 'Aguardando Orçamento', 
    icon: Clock,
    dot: 'bg-amber-500'
  },
  enviado: { 
    color: 'bg-blue-50 text-blue-700 border-blue-200', 
    label: 'Orçamento Enviado', 
    icon: Send,
    dot: 'bg-blue-500'
  },
  aprovado: { 
    color: 'bg-green-50 text-green-700 border-green-200', 
    label: 'Aprovado e Pago', 
    icon: CheckCircle2,
    dot: 'bg-green-500'
  },
};

export const LeadSidebar: React.FC<LeadSidebarProps> = ({ leads, activeLeadId, onSelectLead }) => {
  return (
    <div className="w-1/4 h-full border-r border-slate-200 flex flex-col bg-white">
      <div className="p-4 border-b border-slate-200 flex justify-between items-center bg-slate-50/50">
        <h2 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Leads</h2>
        <span className="px-2 py-0.5 bg-slate-200 text-slate-700 rounded text-xs font-bold">
          {leads.filter(l => l.status === 'aguardando').length} PENDENTES
        </span>
      </div>
      <div className="flex-1 overflow-y-auto">
        {leads.map((lead) => {
          const status = statusConfig[lead.status];
          const isActive = lead.id === activeLeadId;
          const lastMessage = lead.history[lead.history.length - 1];

          return (
            <div
              key={lead.id}
              onClick={() => onSelectLead(lead.id)}
              className={`p-4 border-b border-slate-100 cursor-pointer transition-all hover:bg-slate-50 ${
                isActive ? 'bg-blue-50/50 border-l-4 border-l-blue-600' : 'border-l-4 border-l-transparent'
              }`}
            >
              <div className="flex gap-3">
                <div className="w-12 h-12 bg-slate-200 rounded-lg flex items-center justify-center font-bold text-slate-600 shrink-0 shadow-sm">
                  {lead.initials}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start mb-1">
                    <h3 className="font-bold text-slate-900 truncate">{lead.name}</h3>
                    <span className="text-[10px] text-slate-400 whitespace-nowrap">
                      {lastMessage?.timestamp || 'Novo'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 font-medium truncate mb-2">{lead.empresa}</p>
                  
                  <div className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full border text-[10px] font-bold ${status.color}`}>
                    <div className={`w-1.5 h-1.5 rounded-full ${status.dot}`} />
                    {status.label}
                  </div>
                </div>
              </div>
              {lastMessage && (
                <p className="mt-3 text-xs text-slate-400 truncate italic">
                  "{lastMessage.text}"
                </p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
