import type { Lead } from '../types/index';

export const mockLeads: Lead[] = [
  {
    id: "1776056451479",
    name: "Guilherme Alcântara Ferreira",
    initials: "GA",
    empresa: "SDG gráfica",
    cpf_cnpj: "70219798605",
    telefone: "33997054462",
    email: "guilherme@sdggrafica.com.br",
    endereco: "Rua das Flores, 123 - Centro",
    itens: [
      { 
        produto: "Panfletos Couché 90g", 
        descricao: "5000 unidades, 4/0 cores, refile", 
        preco_concorrente: "R$ 180,00" 
      }
    ],
    probabilidade: 85,
    observacoes: "Cliente solicitou urgência para evento no final de semana.",
    vendedor: "Marcelo Almeida",
    status: 'aguardando',
    enriched: {
      capital: "R$ 50.000,00",
      fundacao: "10/05/2015"
    },
    historico_compras: [
      {
        data: "2023-11-10",
        itens: "5000 Panfletos Couché 90g",
        valor_total: 175.00
      },
      {
        data: "2024-02-15",
        itens: "1000 Cartões de Visita",
        valor_total: 85.00
      }
    ],
    history: [
      { isCustomer: true, text: "Olá, gostaria de saber o preço para 5000 panfletos.", timestamp: "14:20" },
      { isCustomer: false, text: "Boa tarde Guilherme! Vou verificar agora.", timestamp: "14:25" }
    ]
  },
  {
    id: "1776056451480",
    name: "Ana Beatriz Souza",
    initials: "AB",
    empresa: "Livraria Saber",
    cpf_cnpj: "12345678000199",
    telefone: "11988887777",
    email: "contato@livrariasaber.com.br",
    endereco: "Av. Paulista, 1000 - Bela Vista",
    itens: [
      { 
        produto: "Marcadores de Página", 
        descricao: "1000 unidades, verniz total frente", 
        preco_concorrente: "R$ 120,00" 
      }
    ],
    probabilidade: 45,
    observacoes: "Primeira cotação deste cliente.",
    vendedor: "Marcelo Almeida",
    status: 'enviado',
    enriched: {
      capital: "R$ 10.000,00",
      fundacao: "20/01/2022"
    },
    historico_compras: [],
    history: []
  }
];
