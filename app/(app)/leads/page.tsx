"use client";

import Topbar from "@/components/Topbar";
import { useState } from "react";
import { Search, Filter, MessageSquare, Phone, MoreHorizontal, Flame, ArrowUpDown, X, Plus, ChevronDown } from "lucide-react";
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

const stages = ["Todos", "Novo Interesse", "Consultoria de Estilo", "Proposta Enviada", "Aguardando Pagamento", "Pedido Confirmado"];
const channels = ["Todos", "WhatsApp", "Instagram", "TikTok"];

export default function LeadsPage() {
  const [search, setSearch] = useState("");
  const [stageFilter, setStageFilter] = useState("Todos");
  const [channelFilter, setChannelFilter] = useState("Todos");
  const [sortBy, setSortBy] = useState<"name" | "score" | "value" | "created">("name");
  const [showFilter, setShowFilter] = useState(false);
  const [showSort, setShowSort] = useState(false);
  const [showNewLead, setShowNewLead] = useState(false);
  const [newName, setNewName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newPhone, setNewPhone] = useState("");
  const [newChannel, setNewChannel] = useState("WhatsApp");
  const [leadList, setLeadList] = useState(leads);

  const filtered = leadList
    .filter((l) => {
      const matchSearch = l.name.toLowerCase().includes(search.toLowerCase()) || l.email.toLowerCase().includes(search.toLowerCase());
      const matchStage = stageFilter === "Todos" || l.stage === stageFilter;
      const matchChannel = channelFilter === "Todos" || l.channel === channelFilter;
      return matchSearch && matchStage && matchChannel;
    })
    .sort((a, b) => {
      if (sortBy === "score") return b.score - a.score;
      if (sortBy === "value") return parseFloat(b.value.replace(/[R$.\s]/g, "").replace(",", ".")) - parseFloat(a.value.replace(/[R$.\s]/g, "").replace(",", "."));
      if (sortBy === "name") return a.name.localeCompare(b.name);
      return 0;
    });

  function addLead() {
    if (!newName.trim()) return;
    setLeadList((prev) => [{
      id: prev.length + 11, name: newName, company: "-",
      email: newEmail, phone: newPhone, channel: newChannel as typeof leads[0]["channel"],
      stage: "Novo Interesse", score: 50, value: "R$ 0", tags: ["Novo"], created: "Agora",
    }, ...prev]);
    setNewName(""); setNewEmail(""); setNewPhone(""); setShowNewLead(false);
  }

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <Topbar
        title="Leads"
        subtitle={`${leadList.length} clientes no pipeline · Bella Modas`}
        action={{ label: "Novo Lead", onClick: () => setShowNewLead(true) }}
      />

      {showNewLead && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40" onClick={() => setShowNewLead(false)} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-[420px] p-6">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-semibold text-[#111827]">Novo Lead</h3>
              <button onClick={() => setShowNewLead(false)}><X size={16} className="text-gray-400" /></button>
            </div>
            <div className="space-y-3">
              {[
                { label: "Nome *", value: newName, onChange: setNewName, placeholder: "Nome completo", type: "text" },
                { label: "Email", value: newEmail, onChange: setNewEmail, placeholder: "email@exemplo.com", type: "email" },
                { label: "Telefone", value: newPhone, onChange: setNewPhone, placeholder: "+55 11 99999-0000", type: "tel" },
              ].map((f) => (
                <div key={f.label}>
                  <label className="text-xs font-medium text-gray-500 block mb-1">{f.label}</label>
                  <input type={f.type} value={f.value} onChange={(e) => f.onChange(e.target.value)} placeholder={f.placeholder} className="w-full px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6C3BFF]/20" />
                </div>
              ))}
              <div>
                <label className="text-xs font-medium text-gray-500 block mb-1">Canal</label>
                <select value={newChannel} onChange={(e) => setNewChannel(e.target.value)} className="w-full px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none">
                  {["WhatsApp","Instagram","TikTok"].map((c) => <option key={c}>{c}</option>)}
                </select>
              </div>
              <button onClick={addLead} className="w-full py-2.5 bg-[#6C3BFF] text-white text-sm font-medium rounded-lg hover:bg-[#5930e8] transition-colors">Adicionar Lead</button>
            </div>
          </div>
        </div>
      )}

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
          <div className="relative">
            <button onClick={() => { setShowFilter((v) => !v); setShowSort(false); }} className="flex items-center gap-1.5 px-3 py-2 text-sm text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <Filter size={14} /> Filtrar {(stageFilter !== "Todos" || channelFilter !== "Todos") && <span className="w-1.5 h-1.5 bg-[#6C3BFF] rounded-full" />}
            </button>
            {showFilter && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setShowFilter(false)} />
                <div className="absolute top-10 left-0 z-20 bg-white rounded-xl shadow-xl border border-gray-200 p-4 w-64 space-y-3">
                  <div>
                    <p className="text-xs font-semibold text-gray-500 mb-1.5">Etapa</p>
                    <select value={stageFilter} onChange={(e) => setStageFilter(e.target.value)} className="w-full px-2 py-1.5 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none">
                      {stages.map((s) => <option key={s}>{s}</option>)}
                    </select>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-500 mb-1.5">Canal</p>
                    <select value={channelFilter} onChange={(e) => setChannelFilter(e.target.value)} className="w-full px-2 py-1.5 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none">
                      {channels.map((c) => <option key={c}>{c}</option>)}
                    </select>
                  </div>
                  <button onClick={() => { setStageFilter("Todos"); setChannelFilter("Todos"); setShowFilter(false); }} className="w-full py-1.5 text-xs text-gray-500 hover:text-gray-700 border border-gray-200 rounded-lg">Limpar filtros</button>
                </div>
              </>
            )}
          </div>
          <div className="relative">
            <button onClick={() => { setShowSort((v) => !v); setShowFilter(false); }} className="flex items-center gap-1.5 px-3 py-2 text-sm text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <ArrowUpDown size={14} /> Ordenar <ChevronDown size={12} />
            </button>
            {showSort && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setShowSort(false)} />
                <div className="absolute top-10 left-0 z-20 bg-white rounded-xl shadow-xl border border-gray-200 p-2 w-48">
                  {([["name","Nome A-Z"],["score","Score (maior)"],["value","Valor (maior)"]] as const).map(([key, label]) => (
                    <button key={key} onClick={() => { setSortBy(key); setShowSort(false); }} className={cn("w-full text-left px-3 py-2 text-sm rounded-lg transition-colors", sortBy === key ? "bg-[#6C3BFF]/10 text-[#6C3BFF] font-medium" : "text-gray-600 hover:bg-gray-50")}>
                      {label}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
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
