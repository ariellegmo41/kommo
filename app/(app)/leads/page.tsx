"use client";

import Topbar from "@/components/Topbar";
import { useState } from "react";
import { Search, Filter, MessageSquare, Phone, MoreHorizontal, Flame, ArrowUpDown } from "lucide-react";
import { cn } from "@/lib/utils";

const leads = [
  { id: 1, name: "Maria Fernanda", company: "Tech Startup", email: "maria@tech.com", phone: "+55 11 99999-0001", channel: "WhatsApp", stage: "Qualificando", score: 87, value: "R$ 2.400", tags: ["VIP", "Quente"], created: "Hoje" },
  { id: 2, name: "João Paulo", company: "-", email: "joao@email.com", phone: "+55 11 99999-0002", channel: "Instagram", stage: "Novo Lead", score: 65, value: "R$ 1.200", tags: ["Novo"], created: "Hoje" },
  { id: 3, name: "Ana Costa", company: "Ana Imóveis", email: "ana@imoveis.com", phone: "+55 11 99999-0003", channel: "WhatsApp", stage: "Proposta", score: 91, value: "R$ 8.000", tags: ["Quente", "B2B"], created: "Ontem" },
  { id: 4, name: "Carlos Alves", company: "-", email: "carlos@email.com", phone: "+55 11 99999-0004", channel: "Telegram", stage: "Negociação", score: 60, value: "R$ 3.600", tags: ["Negociação"], created: "Ontem" },
  { id: 5, name: "Empresa XYZ Ltda", company: "XYZ Ltda", email: "contato@xyz.com", phone: "+55 11 99999-0005", channel: "Email", stage: "Proposta", score: 95, value: "R$ 14.400", tags: ["B2B", "VIP"], created: "2 dias" },
  { id: 6, name: "Patricia Sousa", company: "-", email: "patricia@email.com", phone: "+55 11 99999-0006", channel: "WhatsApp", stage: "Novo Lead", score: 78, value: "R$ 2.800", tags: ["Interessado"], created: "3 dias" },
  { id: 7, name: "Diego Santos", company: "DS Group", email: "diego@dsgroup.com", phone: "+55 11 99999-0007", channel: "WhatsApp", stage: "Negociação", score: 88, value: "R$ 21.600", tags: ["Lead Quente", "B2B"], created: "5 dias" },
  { id: 8, name: "Fernanda Costa", company: "Costa & Filhos", email: "fernanda@costa.com", phone: "+55 11 99999-0008", channel: "Instagram", stage: "Fechado", score: 99, value: "R$ 4.200", tags: ["VIP"], created: "1 semana" },
];

const stageColors: Record<string, string> = {
  "Novo Lead": "bg-gray-100 text-gray-600",
  "Qualificando": "bg-purple-100 text-purple-700",
  "Proposta": "bg-blue-100 text-blue-700",
  "Negociação": "bg-amber-100 text-amber-700",
  "Fechado": "bg-green-100 text-green-700",
};

const tagColors: Record<string, string> = {
  VIP: "bg-amber-100 text-amber-700",
  Novo: "bg-green-100 text-green-700",
  Quente: "bg-rose-100 text-rose-700",
  B2B: "bg-gray-100 text-gray-700",
  Proposta: "bg-orange-100 text-orange-700",
  "Lead Quente": "bg-rose-100 text-rose-700",
  Negociação: "bg-purple-100 text-purple-700",
  Interessado: "bg-blue-100 text-blue-700",
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
        subtitle={`${leads.length} leads no total`}
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
