import React from 'react';
import { 
  Building2, User, Mail, Phone, Info, ShoppingCart, 
  ClipboardList, Siren, Rocket, Sparkles 
} from 'lucide-react';
import type { Lead, LeadStatus } from '../../types/index';

interface ChatAreaProps {
  lead: Lead | null;
  onStatusChange: (id: string, status: LeadStatus) => void;
}

const ChatArea: React.FC<ChatAreaProps> = ({ lead, onStatusChange }) => {
  if (!lead) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-slate-50 text-slate-400">
        <Building2 size={64} strokeWidth={1} className="mb-4 opacity-20" />
        <p className="text-lg font-medium">Selecione um lead no funil para analisar</p>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-full bg-white relative overflow-hidden border-r border-slate-200">
      
      {/* 1. PAINEL DE CONTEXTO DO LEAD (HEADER DETALHADO) */}
      <div className="bg-indigo-50/80 p-5 border-b border-indigo-200 z-10 shadow-sm flex flex-col gap-3 shrink-0">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="font-black text-xl text-indigo-900 flex items-center gap-2 tracking-tight">
              {lead.empresa}
              <span className="bg-white border border-indigo-200 text-indigo-700 text-[10px] px-2 py-0.5 rounded font-mono uppercase tracking-tighter shadow-sm">
                CNPJ: {lead.cpf_cnpj}
              </span>
            </h2>
            <div className="text-slate-600 text-xs mt-2 space-y-1 flex flex-col font-medium">
              <span className="flex items-center gap-2">
                <User size={14} className="text-indigo-500" />
                <span className="text-slate-400 uppercase text-[10px] font-black tracking-widest">Contato:</span>
                {lead.name} | {lead.telefone}
              </span>
              <span className="flex items-center gap-2">
                <Mail size={14} className="text-indigo-500" />
                <span className="text-slate-400 uppercase text-[10px] font-black tracking-widest">Email:</span>
                {lead.email}
              </span>
            </div>
          </div>
          
          <div className="text-right flex flex-col items-end gap-2">
            <span className="bg-green-500 text-white text-[12px] font-black px-4 py-1.5 rounded-xl shadow-md shadow-green-100 border border-green-600 uppercase tracking-tighter">
              Score: {lead.probabilidade}/10
            </span>
            <span className="text-[10px] font-bold text-indigo-500 uppercase tracking-widest">
              Captado por: {lead.vendedor}
            </span>
          </div>
        </div>

        {/* Caixa de Pedido */}
        <div className="mt-2 bg-white p-4 rounded-xl border border-indigo-100 shadow-sm">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Pedido do Cliente:</p>
          <div className="flex flex-wrap gap-2 mb-3">
            {lead.itens.map((item, idx) => (
              <span key={idx} className="bg-indigo-600 text-white px-3 py-1.5 rounded-lg shadow-sm text-xs font-bold">
                {item.descricao} {item.produto} (Preço Base: R$ {item.preco_concorrente})
              </span>
            ))}
          </div>

          <div className="bg-amber-50 text-amber-900 p-3 rounded-lg border border-amber-200 text-xs flex items-start gap-2 shadow-inner">
            <Siren size={16} className="text-amber-500 shrink-0 mt-0.5" />
            <p><strong>Nota do Vendedor:</strong> "{lead.observacoes || 'Nenhuma nota'}"</p>
          </div>
        </div>

        {/* Rodapé RAG */}
        <div className="flex justify-between items-center text-[10px] text-slate-500 mt-1 font-medium">
          <span><strong>Dados Receita:</strong> Capital Social aprox. {lead.enriched.capital}</span>
          <span>Tempo de Mercado: {lead.enriched.fundacao}</span>
        </div>
      </div>

      {/* 2. ÁREA CENTRAL (AÇÃO E GERADOR) */}
      {/* Aqui usamos um pattern de CSS de bolinhas sutis para dar o efeito de fundo */}
      <div 
        className="flex-1 p-6 overflow-y-auto flex flex-col items-center justify-center bg-slate-50"
        style={{ backgroundImage: 'radial-gradient(#cbd5e1 1px, transparent 1px)', backgroundSize: '20px 20px' }}
      >
        <div className="text-center w-full max-w-lg mx-auto bg-white/80 backdrop-blur-sm p-8 rounded-3xl border border-white shadow-sm">
          <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4 text-indigo-600 shadow-lg shadow-indigo-100/50">
            <Rocket size={32} />
          </div>
          
          <h3 className="text-2xl font-black text-slate-800 mb-2">Novo Orçamento Capturado!</h3>
          <p className="text-slate-500 text-sm mb-8 font-medium">
            O vendedor registrou esta solicitação e ela está pronta para contato inicial.
          </p>
          
          <div className="text-left w-full mb-6">
            <label className="block text-[10px] font-black text-indigo-700 mb-2 ml-2 uppercase tracking-widest">
              Instruções para a IA (Opcional)
            </label>
            <textarea
              placeholder="Ex: Seja mais descontraído, ofereça um desconto à vista ou tente vender também um banner..."
              className="w-full border border-indigo-200 rounded-2xl px-5 py-4 bg-white focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-400 transition-all text-sm resize-none shadow-sm h-28 font-medium placeholder:text-slate-300"
            ></textarea>
          </div>

          <button className="bg-indigo-600 hover:bg-indigo-700 text-white font-black py-4 px-8 rounded-2xl shadow-xl shadow-indigo-200 transition-all hover:-translate-y-1 flex items-center justify-center gap-3 w-full uppercase tracking-widest text-xs border-b-4 border-indigo-800">
            <Sparkles size={18} />
            Gerar Mensagem de Orçamento
          </button>
        </div>
      </div>

    </div>
  );
};

export default ChatArea;