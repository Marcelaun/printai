import type { Lead } from '../types/index';

const API_URL = 'http://localhost:3000/api';

export const getLeads = async (): Promise<Lead[]> => {
  const res = await fetch(`${API_URL}/leads`);
  if (!res.ok) throw new Error('Erro ao buscar leads');
  return res.json();
};

// Adicionamos o parâmetro "vendedor" aqui
export const sendCopilotMessage = async (lead: Lead, message: string, mode: 'cliente' | 'vendedor', vendedor?: any) => {
  const res = await fetch(`${API_URL}/copilot`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    // Agora o vendedor viaja junto no corpo da requisição!
    body: JSON.stringify({ lead, message, mode, vendedor }) 
  });
  
  if (!res.ok) throw new Error('Erro no Copilot');
  const data = await res.json();
  return data.reply;
};