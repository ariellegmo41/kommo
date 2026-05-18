"use client";

import Topbar from "@/components/Topbar";
import { useState } from "react";
import { Search, Filter, MessageSquare, Phone, MoreHorizontal, Flame, ArrowUpDown } from "lucide-react";
import { cn } from "@/lib/utils";

const leads = [
  { id: 1, name: "Fernanda Lima",     company: "-",         email: "fernanda@email.com",  phone: "+55 11 99400-0001", channel: "WhatsApp",  stage: "Consultoria de Estilo", score: 91, value: "R$ 459",   tags: ["VIP", "Quente"],    created: "Hoje"     },
  { id: 2, name: "Camila Rodrigues",  company: "-",         email: "camila@email.com",    phone: "+55 11 99400-0002", channel: "Instagram", stage: "Novo Interesse",        score: 74, value: "R$ 348",   tags: ["Instagram"],        created: "Hoje"     },
  { id: 3, name: "Rafaela Santos",    company: "-",         email: "rafaela@email.com",   phone: "+55 11 99400-0003", channel: "Instagram", stage: "Proposta Enviada",      score: 88, value: "R$ 890",   tags: ["Consultoria", "VIP"],created: "Ontem"    },
  { id: 4, name: "Larissa Mendes",    company: "-",         email: "larissa@email.com",   phone: "+55 11 99400-0004", channel: "WhatsApp",  stage: "Proposta Enviada",      score: 75, value: "R$ 459",   tags: ["Troca"],            created: "Ontem"    },
  { id: 5, name: "Andressa Costa",    company: "-",         email: "andressa@email.com",  phone: "+55 11 99400-0005", channel: "WhatsApp",  stage: "Aguardando Pagamento",  score: 93, value: "R$ 1.280", tags: ["VIP", "Recorrente"],created: "2 dias"   },
  { id: 6, name: "Priscila Tavares",  company: "-",         email: "priscila@email.com",  phone: "+55 11 99400-0006", channel: "TikTok",    stage: "Novo Interesse",        score: 61, value: "R$ 289",   tags: ["Novo", "TikTok"],   created: "2 dias"   },
  { id: 7, name: "Bianca Figueiredo", company: "-",         email: "bianca@email.com",    phone: "+55 11 99400-0007", channel: "WhatsApp",  stage: "Consultoria de Estilo", score: 78, value: "R$ 560",   tags: ["Quente"],           created: "3 dias"   },
  { id: 8, name: "Marina Duarte",     company: "-",         email: "marina@email.com",    phone: "+55 11 99400-0008", channel: "Instagram", stage: "Pedido Confirmado",     score: 99, value: "R$ 648",   tags: ["VIP"],              created: "5 dias"   },
  { id: 9, name: "Juliana Freitas",   company: "-",         email: "juliana@email.com",   phone: "+55 11 99400-0009", channel: "WhatsApp",  stage: "Pedido Confirmado",     score: 97, value: "R$ 459",   tags: ["Recorrente"],       created: "1 semana" },
  { id:10, name: "Tatiane Oliveira",  company: "-",         email: "tatiane@email.com",   phone: "+55 11 99400-0010", channel: "WhatsApp",  stage: "Proposta Enviada",      score: 82, value: "R$ 720",   tags: ["Look Festa"],       created: "1 semana" },
];

const stageColors: Record<string, string> = {
  "Novo Interesse": "bg-gray-100 text-gray-600",
  "Consultoria de Estilo": "bg-purple-100 text-purple-700",
  "Proposta Enviada": "bg-blue-100 text-blue-700",
  "Aguardando Pagamento": "bg-amber-100 text-amber-700",
  "Pedido Confirmado": "bg-green-100 text-green-700",
};

const tagColors: Record<string, string> = {
  VIP: "bg-amber-100 text-amber-700",
  Quente: "bg-rose-100 text-rose-700",
  Novo: "bg-green-100 text-green-700",
  Instagram: "bg-pink-100 text-pink-700",
  TikTok: "bg-gray-100 text-gray-700",
  Consultoria: "bg-[#6C3BFF]/10 text-[#6C3BFF]",
  Troca: "bg-orange-100 text-orange-700",
  Recorrente: "bg-teal-100 text-teal-700",
  "Look Festa": "bg-rose-100 text-rose-700",
};

export default function LeadsPage() {
  const [search, setSearch] = useState("");

  const filtered = leads.filter(
    (l) =>
      l.name.toLowerCase().includes(search.toLowerCase()) ||
      l.company.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <Topbar
        title="Leads"
        subtitle={`${leads.length} clientes no pipeline · Bella Modas`}
        action={{ label: "Novo Lead", onClick: () => {} }}
      />

      <div className="flex-1 overflow-hidden flex flex-col p-6 gap-4">
        {/* Filters */}
        <div className="flex items-center gap-3">
          <div className="relative flex-1 max-w-xs">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar leads..."
              className="w-full pl-9 pr-4 py-2 text-sm bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6C3BFF]/20"
            />
          </div>
          <button className="flex items-center gap-1.5 px-3 py-2 text-sm text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <Filter size={14} /> Filtrar
          </button>
          <button className="flex items-center gap-1.5 px-3 py-2 text-sm text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <ArrowUpDown size={14} /> Ordenar
          </button>
        </div>

        {/* Table */}
        <div className="flex-1 overflow-auto bg-white rounded-xl shadow-sm border border-gray-100">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wide px-4 py-3">Lead</th>
                <th className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wide px-4 py-3">Canal</th>
                <th className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wide px-4 py-3">Etapa</th>
                <th className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wide px-4 py-3">Score</th>
                <th className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wide px-4 py-3">Valor</th>
                <th className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wide px-4 py-3">Tags</th>
                <th className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wide px-4 py-3">Criado</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map((lead) => (
                <tr key={lead.id} className="hover:bg-gray-50 transition-colors cursor-pointer">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-[#6C3BFF] flex items-center justify-center text-white text-xs font-bold">
                        {lead.name[0]}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-[#111827]">{lead.name}</p>
                        <p className="text-xs text-gray-400">{lead.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">{lead.channel}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${stageColors[lead.stage] || "bg-gray-100 text-gray-600"}`}>
                      {lead.stage}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1.5">
                      {lead.score >= 80 && <Flame size={12} className="text-rose-500" />}
                      <span className={cn("text-sm font-bold", lead.score >= 80 ? "text-rose-500" : lead.score >= 60 ? "text-amber-500" : "text-gray-400")}>
                        {lead.score}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm font-semibold text-[#111827]">{lead.value}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1 flex-wrap">
                      {lead.tags.map((tag) => (
                        <span key={tag} className={`text-[10px] px-1.5 py-0.5 rounded-full ${tagColors[tag] || "bg-gray-100 text-gray-600"}`}>
                          {tag}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-400">{lead.created}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <button className="p-1.5 text-gray-400 hover:text-[#6C3BFF] hover:bg-[#6C3BFF]/5 rounded-lg transition-colors"><MessageSquare size={14} /></button>
                      <button className="p-1.5 text-gray-400 hover:text-[#6C3BFF] hover:bg-[#6C3BFF]/5 rounded-lg transition-colors"><Phone size={14} /></button>
                      <button className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"><MoreHorizontal size={14} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
