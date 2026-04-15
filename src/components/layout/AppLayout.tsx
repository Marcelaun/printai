import React, { useState, useEffect, useCallback } from 'react';
import { 
  Printer, Bell, Search, Settings, User, Loader2, LogOut, 
  PanelLeftClose, PanelLeft, PanelRightClose, PanelRight 
} from 'lucide-react';
import { LeadSidebar } from '../sidebar/LeadSidebar';
import ChatArea from '../chat/ChatArea';
import AiCopilotPanel from '../ai/AiCopilotPanel';
import ProfileSetup from '../auth/ProfileSetup';
import { supabase } from '../../lib/supabase';
import { getLeads } from '../../services/api';
import type { Lead, LeadStatus } from '../../types/index';

const AppLayout: React.FC = () => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [activeLeadId, setActiveLeadId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  
  // --- ESTADOS DOS PAINÉIS MODULARES ---
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isCopilotOpen, setIsCopilotOpen] = useState(true);
  // -------------------------------------

  // Perfil do usuário logado
  const [userProfile, setUserProfile] = useState<{name: string, cpf: string} | null>(null);

  // Carrega perfil do localStorage ao iniciar
  useEffect(() => {
    const savedProfile = localStorage.getItem('printia_user_profile');
    if (savedProfile) {
      setUserProfile(JSON.parse(savedProfile));
    }
  }, []);

  const handleProfileComplete = (name: string, cpf: string) => {
    const profile = { name, cpf };
    setUserProfile(profile);
    localStorage.setItem('printia_user_profile', JSON.stringify(profile));
  };

  const handleLogout = () => {
    localStorage.removeItem('printia_user_profile');
    setUserProfile(null);
  };

  const formatLead = useCallback((item: any): Lead => {
    const names = item.cliente_nome ? item.cliente_nome.split(' ') : (item.name ? item.name.split(' ') : ['N', 'N']);
    const initials = names.length > 1 
      ? (names[0][0] + names[names.length - 1][0]).toUpperCase()
      : names[0].substring(0, 2).toUpperCase();

    const enriched = item.enriched || {
      capital: item.capital_social ? `R$ ${Number(item.capital_social).toLocaleString('pt-BR')}` : "N/A",
      fundacao: item.data_inicio_atividade 
        ? (item.data_inicio_atividade.includes('-') 
            ? item.data_inicio_atividade.split('-').reverse().join('/') 
            : item.data_inicio_atividade)
        : "N/A"
    };

    return {
      id: item.id?.toString() || Math.random().toString(),
      name: item.cliente_nome || item.name || 'Sem Nome',
      initials: initials,
      empresa: item.cliente_empresa || item.empresa || 'Sem Empresa',
      cpf_cnpj: item.cliente_cpf_cnpj || item.cpf_cnpj || '',
      telefone: item.cliente_telefone || item.telefone || '',
      email: item.cliente_email || item.email || '',
      endereco: item.cliente_endereco || item.endereco || '',
      itens: typeof item.itens === 'string' ? JSON.parse(item.itens) : (item.itens || []),
      probabilidade: item.probabilidade_venda || item.probabilidade || 5,
      observacoes: item.observacoes || '',
      vendedor: item.vendedor_nome || item.vendedor || '',
      status: item.status || 'aguardando',
      atendido_por: item.atendido_por || null,
      enriched: enriched,
      historico_compras: [],
      history: []
    };
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await getLeads();
        if (data && data.length > 0) {
          const formatted = data.map(item => formatLead(item));
          setLeads(formatted);
          if (!activeLeadId) {
            setActiveLeadId(formatted[0].id);
          }
        }
      } catch (err) {
        console.error("Erro ao puxar dados da API", err);
      } finally {
        setLoading(false);
      }
    };

    if (userProfile) {
      fetchData();
    }
  }, [userProfile]);

  useEffect(() => {
    if (!userProfile) return;

    const channel = supabase
      .channel('realtime_orcamentos')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'orcamentos' },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            const newLead = formatLead(payload.new);
            setLeads(prev => {
              if (prev.find(l => l.id === newLead.id)) return prev;
              return [newLead, ...prev];
            });
          } else if (payload.eventType === 'UPDATE') {
            const updatedLead = formatLead(payload.new);
            setLeads(prev => prev.map(l => l.id === updatedLead.id ? updatedLead : l));
          } else if (payload.eventType === 'DELETE') {
            setLeads(prev => prev.filter(l => l.id !== payload.old.id));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [formatLead, userProfile]);

  const activeLead = leads.find(l => l.id === activeLeadId) || null;

  const updateLeadStatus = async (id: string, status: LeadStatus) => {
    const previousLeads = [...leads];
    setLeads(prev => prev.map(l => l.id === id ? { ...l, status } : l));
    
    try {
      const { error } = await supabase.from('orcamentos').update({ status }).eq('id', id);
      if (error) throw error;
    } catch (error) {
      console.error('Erro ao atualizar status:', error);
      setLeads(previousLeads);
    }
  };

  const assumeLead = async (id: string) => {
    if (!userProfile) return;
    
    const previousLeads = [...leads];
    setLeads(prev => prev.map(l => l.id === id ? { ...l, atendido_por: userProfile.name } : l));
    
    try {
      const { error } = await supabase.from('orcamentos').update({ atendido_por: userProfile.name }).eq('id', id);
      if (error) throw error;
    } catch (error) {
      console.error('Erro ao assumir lead:', error);
      setLeads(previousLeads);
    }
  };

  if (!userProfile) {
    return <ProfileSetup onComplete={handleProfileComplete} />;
  }

  return (
    <div className="h-screen w-full flex flex-col bg-slate-50 overflow-hidden font-sans">
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
            <div className="flex items-center gap-3 cursor-pointer group relative">
              <div className="text-right">
                <p className="text-xs font-bold leading-none">{userProfile.name}</p>
                <p className="text-[10px] text-indigo-300 leading-none mt-1 uppercase font-bold tracking-tighter">Atendente Ativo</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-indigo-500 flex items-center justify-center border-2 border-indigo-400 group-hover:border-white transition-all overflow-hidden shadow-lg shadow-indigo-900/50">
                <User size={24} strokeWidth={1.5} />
              </div>
              <button 
                onClick={handleLogout}
                className="absolute -bottom-10 right-0 bg-white text-rose-600 text-[9px] font-black px-3 py-2 rounded-lg shadow-xl uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity border border-rose-100 flex items-center gap-2"
              >
                <LogOut size={12} /> Sair
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 flex overflow-hidden relative">
        {loading ? (
          <div className="flex-1 flex items-center justify-center bg-slate-50">
            <div className="flex flex-col items-center gap-4">
              <Loader2 size={48} className="text-indigo-600 animate-spin" />
              <p className="text-slate-500 font-bold uppercase tracking-widest text-xs animate-pulse">
                Carregando Leads...
              </p>
            </div>
          </div>
        ) : (
          <>
            {/* WRAPPER DA SIDEBAR (ESQUERDA) */}
            <div 
              className={`transition-all duration-300 ease-in-out flex-shrink-0 h-full overflow-hidden ${
                isSidebarOpen ? 'w-80 border-r border-slate-200' : 'w-0'
              }`}
            >
              {/* O conteúdo interno fica fixo em w-80 para não amassar durante a animação */}
              <div className="w-80 h-full">
                <LeadSidebar 
                  leads={leads} 
                  activeLeadId={activeLeadId || ''} 
                  onSelectLead={setActiveLeadId} 
                />
              </div>
            </div>

            {/* ÁREA CENTRAL (CHAT + FUTURO CATÁLOGO) */}
            <div className="flex-1 relative h-full bg-white shadow-2xl z-10">
              
              {/* Botão Flutuante de Controle da Sidebar */}
              <button 
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                title={isSidebarOpen ? "Recolher Leads" : "Expandir Leads"}
                className={`absolute top-1/2 -translate-y-1/2 z-50 bg-white border border-slate-200 text-indigo-600 p-2 shadow-lg hover:bg-indigo-50 transition-all cursor-pointer ${
                  isSidebarOpen ? '-left-5 rounded-full' : 'left-0 rounded-r-xl border-l-0'
                }`}
              >
                {isSidebarOpen ? <PanelLeftClose size={18} /> : <PanelLeft size={18} />}
              </button>

              <ChatArea 
                lead={activeLead} 
                onStatusChange={updateLeadStatus} 
                onAssumeLead={() => activeLead && assumeLead(activeLead.id)}
                currentUserName={userProfile.name}
              />

              {/* Botão Flutuante de Controle do Copilot */}
              <button 
                onClick={() => setIsCopilotOpen(!isCopilotOpen)}
                title={isCopilotOpen ? "Recolher Copilot" : "Expandir Copilot"}
                className={`absolute top-1/2 -translate-y-1/2 z-50 bg-white border border-slate-200 text-indigo-600 p-2 shadow-lg hover:bg-indigo-50 transition-all cursor-pointer ${
                  isCopilotOpen ? '-right-5 rounded-full' : 'right-0 rounded-l-xl border-r-0'
                }`}
              >
                {isCopilotOpen ? <PanelRightClose size={18} /> : <PanelRight size={18} />}
              </button>

            </div>

            {/* WRAPPER DO COPILOT (DIREITA) */}
            <div 
              className={`transition-all duration-300 ease-in-out flex-shrink-0 h-full overflow-hidden ${
                isCopilotOpen ? 'w-[585px] border-l border-slate-200' : 'w-0'
              }`}
            >
              {/* O conteúdo interno fica fixo para não amassar durante a animação */}
              <div className="w-[585px] h-full">
                <AiCopilotPanel activeLead={activeLead} />
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default AppLayout;