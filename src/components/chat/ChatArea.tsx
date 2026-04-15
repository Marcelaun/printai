import React, { useEffect } from 'react';
import { 
  Building2, User, Mail, Phone, ShoppingCart, 
  ClipboardList, Siren, Rocket, Sparkles, UserPlus, UserCheck, AlertCircle 
} from 'lucide-react';
import type { Lead, LeadStatus } from '../../types/index';

interface ChatAreaProps {
  lead: Lead | null;
  onStatusChange: (id: string, status: LeadStatus) => void;
  onAssumeLead: () => void;
  currentUserName: string;
}

const ChatArea: React.FC<ChatAreaProps> = ({ lead, onStatusChange, onAssumeLead, currentUserName }) => {
  
  // ------------------------------------------------------------------
  // SISTEMA DE DEBUG: Toda vez que você clicar em um cliente diferente,
  // isso vai imprimir o objeto INTEIRO dele no Console do Navegador.
  // Aperte F12 no Chrome, vá na aba "Console" e veja o que aparece lá!
  useEffect(() => {
    if (lead) {
      console.log("🔥 DADOS DO LEAD ATUAL NO FRONTEND:", lead);
      console.log("💰 DADOS DA RECEITA (ENRICHED):", lead.enriched);
    }
  }, [lead]);
  // ------------------------------------------------------------------

  if (!lead) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-slate-50 text-slate-400">
        <Building2 size={64} strokeWidth={1} className="mb-4 opacity-20" />
        <p className="text-sm font-medium">Selecione um lead para visualizar os detalhes</p>
      </div>
    );
  }

  const isBeingAttendedBySomeoneElse = lead.atendido_por && lead.atendido_por !== currentUserName;
  const isBeingAttendedByMe = lead.atendido_por === currentUserName;

  return (
    <div className="flex-1 flex flex-col h-full bg-white relative overflow-hidden border-r border-slate-200">
      
      {/* 1. PAINEL DE CONTEXTO DO LEAD */}
      <div className="bg-indigo-50/80 p-4 border-b border-indigo-200 z-10 shadow-sm flex flex-col gap-2 shrink-0">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="font-bold text-lg text-indigo-900 flex items-center gap-2">
              {lead.empresa} 
              <span className="bg-white border border-indigo-200 text-indigo-700 text-[10px] px-2 py-0.5 rounded font-mono">
                CNPJ: {lead.cpf_cnpj}
              </span>
            </h2>
            <div className="text-slate-600 text-xs mt-1 space-y-0.5">
              <p className="flex items-center gap-1.5"><User size={12} className="text-indigo-500" /> <strong>Contato:</strong> {lead.name} | {lead.telefone}</p>
              <p className="flex items-center gap-1.5"><Mail size={12} className="text-indigo-500" /> <strong>Email:</strong> {lead.email}</p>
            </div>
          </div>
          
          <div className="text-right">
            <span className="bg-green-500 text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow-sm border border-green-600 inline-block mb-1">
              Score: {lead.probabilidade}/10
            </span>
            <p className="text-[10px] text-indigo-700 font-medium">Captado por: {lead.vendedor}</p>
          </div>
        </div>

        {/* Status de Atendimento */}
        <div className="flex items-center justify-between mt-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-500">Status:</span>
            <select
              value={lead.status}
              onChange={(e) => onStatusChange(lead.id, e.target.value as LeadStatus)}
              className="text-xs border border-slate-300 rounded px-2 py-1 bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500 text-slate-700"
            >
              <option value="aguardando">Aguardando Orçamento</option>
              <option value="enviado">Orçamento Enviado</option>
              <option value="aprovado">Aprovado e Pago</option>
            </select>
          </div>

          <div>
             {lead.atendido_por ? (
                <div className={`flex items-center gap-1.5 px-2 py-1 rounded text-[10px] font-bold border ${isBeingAttendedByMe ? 'bg-green-50 text-green-700 border-green-200' : 'bg-amber-50 text-amber-700 border-amber-200'}`}>
                  <UserCheck size={12} /> {isBeingAttendedByMe ? 'Seu Atendimento' : `Com: ${lead.atendido_por}`}
                </div>
              ) : (
                <button onClick={onAssumeLead} className="flex items-center gap-1.5 px-3 py-1 rounded bg-indigo-600 text-white text-[10px] font-bold hover:bg-indigo-700 transition-colors shadow-sm">
                  <UserPlus size={12} /> Assumir Lead
                </button>
              )}
          </div>
        </div>

        {isBeingAttendedBySomeoneElse && (
          <div className="bg-rose-50 text-rose-700 px-3 py-1.5 rounded flex items-center gap-2 text-[10px] font-bold border border-rose-200 mt-1">
            <AlertCircle size={14} />
            Aviso: {lead.atendido_por} já está atendendo.
            <button onClick={onAssumeLead} className="ml-auto underline hover:text-rose-900">Tomar para mim</button>
          </div>
        )}

        <div className="mt-2 bg-white p-3 rounded-lg border border-indigo-100 shadow-sm flex flex-col gap-2">
          <div>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wide mb-1">Pedido do Cliente:</p>
            <div className="flex flex-wrap gap-2">
              {lead.itens.map((item, idx) => (
                <span key={idx} className="bg-indigo-600 text-white px-2 py-1 rounded shadow-sm text-xs font-medium">
                  {item.descricao} {item.produto} (Preço Base: R$ {item.preco_concorrente})
                </span>
              ))}
            </div>
          </div>
          <div className="bg-amber-50 text-amber-800 p-2 rounded border border-amber-200 text-xs flex items-start gap-2">
            <Siren size={14} className="text-amber-600 shrink-0 mt-0.5" />
            <p><strong>Nota do Vendedor:</strong> "{lead.observacoes || 'Nenhuma'}"</p>
          </div>
        </div>

        {/* Exibindo os dados do Banco (RAG) */}
        <div className="mt-1 text-[10px] text-slate-500 flex justify-between">
          <span><strong>Dados Receita:</strong> Capital Social aprox. {lead.enriched?.capital || 'N/A'}</span>
          <span>Tempo de Mercado: {lead.enriched?.fundacao || 'N/A'}</span>
        </div>
      </div>

      {/* 2. ÁREA CENTRAL (Scrollable) */}
      <div 
        className="flex-1 overflow-y-auto p-6 bg-slate-50 flex items-center justify-center relative"
        style={{ backgroundImage: 'radial-gradient(#cbd5e1 1px, transparent 1px)', backgroundSize: '20px 20px' }}
      >
        
        {/* Modal de Gerar Orçamento (No centro da tela) */}
        <div className={`text-center max-w-md w-full bg-white/90 backdrop-blur-sm p-8 rounded-2xl border border-white shadow-sm transition-all ${!isBeingAttendedByMe ? 'opacity-50 grayscale pointer-events-none' : ''}`}>
          <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4 text-indigo-600">
            <Rocket size={32} />
          </div>
          <h3 className="text-slate-800 font-bold mb-2 text-lg">Novo Orçamento Capturado!</h3>
          <p className="text-slate-500 text-sm mb-6 max-w-sm mx-auto">
            O vendedor registrou esta solicitação e ela está pronta para contato inicial.
          </p>
          
          <div className="text-left mb-6">
            <label className="block text-xs font-bold text-indigo-700 mb-2 ml-1 uppercase tracking-wider">
              Instruções para a IA (Opcional)
            </label>
            <textarea 
              placeholder="Ex: Seja mais descontraído, ofereça um desconto à vista..." 
              className="w-full border border-indigo-200 rounded-xl px-4 py-3 bg-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all text-sm resize-none shadow-sm"
              rows={3}
            ></textarea>
          </div>

          <button className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2.5 px-6 rounded-full shadow-lg transition-transform transform hover:scale-105 flex items-center justify-center gap-2 mx-auto w-full max-w-xs text-sm">
            <Sparkles size={16} /> Gerar Mensagem
          </button>
        </div>

        {/* Overlay se não estiver atendendo */}
        {!isBeingAttendedByMe && (
           <div className="absolute inset-0 z-20 flex items-center justify-center">
             <button onClick={onAssumeLead} className="bg-indigo-900 text-white font-bold py-3 px-6 rounded-lg shadow-2xl flex items-center gap-2">
               <UserPlus size={18} /> Assuma o lead para usar a IA
             </button>
           </div>
        )}
      </div>

    </div>
  );
};

export default ChatArea;