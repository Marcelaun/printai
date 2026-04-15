import type { Lead } from '../types/index';

const API_URL = 'http://localhost:3000/api';

export const getLeads = async (): Promise<Lead[]> => {
  const res = await fetch(`${API_URL}/leads`);
  if (!res.ok) throw new Error('Erro ao buscar leads');
  return res.json();
};

export const sendCopilotMessage = async (lead: Lead, message: string, mode: 'cliente' | 'vendedor') => {
  const res = await fetch(`${API_URL}/copilot`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ lead, message, mode })
  });
  if (!res.ok) throw new Error('Erro no Copilot');
  const data = await res.json();
  return data.reply;
};