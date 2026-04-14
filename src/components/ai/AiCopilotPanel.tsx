import React, { useState, useEffect } from 'react';
import { 
  Bot, 
  Sparkles, 
  Loader2, 
  TrendingUp, 
  Lightbulb, 
  MessageSquare, 
  Send, 
  Share2 
} from 'lucide-react';
import type { Lead } from '../../types/index';

interface AiCopilotPanelProps {
  activeLead: Lead | null;
}

type AiStatus = 'idle' | 'loading' | 'suggestion';

const AiCopilotPanel: React.FC<AiCopilotPanelProps> = ({ activeLead }) => {
  const [status, setStatus] = useState<AiStatus>('idle');

  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout>;

    if (activeLead && activeLead.history.length === 0) {
      setStatus('loading');
      timeoutId = setTimeout(() => {
        setStatus('suggestion');
      }, 2000);
    } else {
      setStatus('idle');
    }

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [activeLead]);

  return (
    <aside className="w-1/3 min-w-[300px] bg-slate-50 border-l border-slate-200 flex flex-col h-full overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-slate-200 bg-white flex items-center gap-2 shrink-0">
        <div className="w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center text-indigo-600">
          <Bot size={20} />
        </div>
        <h2 className="font-bold text-slate-800 tracking-tight">PrintIA Copilot</h2>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto">
        {status === 'idle' && (
          <div className="h-full flex flex-col items-center justify-center p-8 text-center text-slate-400">
            <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mb-4">
              <Sparkles size={32} strokeWidth={1.5} />
            </div>
            <p className="text-sm font-medium leading-relaxed">
              Selecione um lead sem histórico para gerar uma estratégia de venda.
            </p>
          </div>
        )}

        {status === 'loading' && (
          <div className="h-full flex flex-col items-center justify-center p-8 text-center">
            <Loader2 size={40} className="text-indigo-600 animate-spin mb-4" />
            <p className="text-sm font-semibold text-slate-600 animate-pulse">
              Formulando estratégia e gatilhos...
            </p>
          </div>
        )}

        {status === 'suggestion' && activeLead && (
          <div className="p-4 flex flex-col gap-4">
            {/* Card 1: Visão de Mercado */}
            <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
              <div className="flex items-center gap-2 mb-3 text-indigo-600">
                <TrendingUp size={18} />
                <h3 className="font-bold text-sm uppercase tracking-wider">Visão de Mercado</h3>
              </div>
              <p className="text-sm text-slate-600 leading-relaxed">
                A empresa <span className="font-semibold">{activeLead.empresa}</span> possui um capital social estimado em <span className="text-indigo-600 font-bold">{activeLead.enriched.capital}</span>. 
                Isso sugere um potencial de compra de alto volume para materiais gráficos premium e fidelização a longo prazo.
              </p>
            </div>

            {/* Card 2: Dica Estratégica */}
            <div className="bg-amber-50 rounded-xl border border-amber-200 p-4 shadow-sm">
              <div className="flex items-center gap-2 mb-3 text-amber-700">
                <Lightbulb size={18} />
                <h3 className="font-bold text-sm uppercase tracking-wider">Dica Estratégica</h3>
              </div>
              <p className="text-sm text-amber-900 leading-relaxed">
                Utilize o gatilho de <span className="font-bold">exclusividade</span>. Mencione que, devido ao porte da empresa, vocês podem oferecer um acabamento em verniz localizado sem custo adicional no primeiro lote de 5000 unidades.
              </p>
            </div>

            {/* Card 3: Mensagem Sugerida */}
            <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm flex flex-col gap-4">
              <div className="flex items-center gap-2 text-indigo-600">
                <MessageSquare size={18} />
                <h3 className="font-bold text-sm uppercase tracking-wider">Mensagem Sugerida</h3>
              </div>
              <div className="bg-slate-50 rounded-lg p-3 text-sm text-slate-700 italic border-l-4 border-indigo-400">
                "Olá {activeLead.name.split(' ')[0]}, vi que a {activeLead.empresa} está expandindo! 🚀 Para acompanhar esse crescimento, preparei uma proposta especial para os panfletos com um acabamento premium cortesia. Podemos fechar?"
              </div>
              <div className="grid grid-cols-2 gap-2 mt-2">
                <button className="flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold py-2.5 px-3 rounded-lg transition-colors">
                  <Send size={14} />
                  Aplicar no Chat
                </button>
                <button className="flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold py-2.5 px-3 rounded-lg transition-colors">
                  <Share2 size={14} />
                  WhatsApp
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
};

export default AiCopilotPanel;
