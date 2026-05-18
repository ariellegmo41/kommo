"use client";

import { useState } from "react";
import Topbar from "@/components/Topbar";
import { Plus, MoreHorizontal, MessageSquare, Phone, Calendar, User, Flame } from "lucide-react";
import { cn } from "@/lib/utils";

interface Lead {
  id: string;
  name: string;
  company?: string;
  value: string;
  channel: string;
  score: number;
  avatar: string;
  tags: string[];
  days: number;
}

interface Stage {
  id: string;
  label: string;
  color: string;
  leads: Lead[];
}

const initialStages: Stage[] = [
  {
    id: "interesse",
    label: "Novo Interesse",
    color: "bg-gray-400",
    leads: [
      { id: "1", name: "Fernanda Lima", value: "R$ 459", channel: "WhatsApp", score: 82, avatar: "F", tags: ["VIP"], days: 0 },
      { id: "2", name: "Priscila Tavares", value: "R$ 289", channel: "TikTok", score: 61, avatar: "P", tags: ["Novo"], days: 1 },
      { id: "3", name: "Camila Rodrigues", value: "R$ 348", channel: "Instagram", score: 74, avatar: "C", tags: ["Instagram"], days: 1 },
    ],
  },
  {
    id: "consultoria",
    label: "Consultoria de Estilo",
    color: "bg-[#7B61FF]",
    leads: [
      { id: "4", name: "Rafaela Santos", value: "R$ 890", channel: "Instagram", score: 91, avatar: "R", tags: ["Consultoria"], days: 2 },
      { id: "5", name: "Bianca Figueiredo", value: "R$ 560", channel: "WhatsApp", score: 78, avatar: "B", tags: ["Quente"], days: 3 },
    ],
  },
  {
    id: "proposta",
    label: "Proposta Enviada",
    color: "bg-[#6C3BFF]",
    leads: [
      { id: "6", name: "Tatiane Oliveira", value: "R$ 720", channel: "WhatsApp", score: 88, avatar: "T", tags: ["Look Festa"], days: 2 },
      { id: "7", name: "Larissa Mendes", value: "R$ 459", channel: "WhatsApp", score: 75, avatar: "L", tags: ["Troca"], days: 4 },
    ],
  },
  {
    id: "pagamento",
    label: "Aguardando Pagamento",
    color: "bg-amber-500",
    leads: [
      { id: "8", name: "Andressa Costa", value: "R$ 1.280", channel: "WhatsApp", score: 93, avatar: "A", tags: ["VIP", "Recorrente"], days: 1 },
    ],
  },
  {
    id: "confirmado",
    label: "Pedido Confirmado ✓",
    color: "bg-[#10B981]",
    leads: [
      { id: "9", name: "Marina Duarte", value: "R$ 648", channel: "Instagram", score: 99, avatar: "M", tags: ["VIP"], days: 5 },
      { id: "10", name: "Juliana Freitas", value: "R$ 459", channel: "WhatsApp", score: 97, avatar: "J", tags: ["Recorrente"], days: 7 },
    ],
  },
];

const avatarColors: Record<string, string> = {
  M: "bg-[#6C3BFF]",
  J: "bg-[#10B981]",
  A: "bg-amber-500",
  C: "bg-[#7B61FF]",
  E: "bg-blue-500",
  P: "bg-rose-500",
  L: "bg-teal-500",
  D: "bg-indigo-500",
  F: "bg-pink-500",
  B: "bg-emerald-600",
};

const tagColors: Record<string, string> = {
  VIP: "bg-amber-100 text-amber-700",
  Interessado: "bg-blue-100 text-blue-700",
  Novo: "bg-green-100 text-green-700",
  Quente: "bg-rose-100 text-rose-700",
  Negociação: "bg-purple-100 text-purple-700",
  "Lead Quente": "bg-rose-100 text-rose-700",
  B2B: "bg-gray-100 text-gray-700",
  Proposta: "bg-orange-100 text-orange-700",
  SDR: "bg-blue-100 text-blue-700",
  Recorrente: "bg-teal-100 text-teal-700",
};

function LeadCard({ lead }: { lead: Lead }) {
  return (
    <div className="bg-white rounded-xl p-3.5 shadow-sm border border-gray-100 cursor-grab active:cursor-grabbing hover:shadow-md transition-shadow group">
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-2">
          <div className={`w-7 h-7 rounded-full ${avatarColors[lead.avatar] || "bg-gray-400"} flex items-center justify-center text-white text-xs font-bold flex-shrink-0`}>
            {lead.avatar}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium text-[#111827] truncate">{lead.name}</p>
            {lead.company && <p className="text-xs text-gray-400 truncate">{lead.company}</p>}
          </div>
        </div>
        <button className="opacity-0 group-hover:opacity-100 transition-opacity text-gray-400 hover:text-gray-600">
          <MoreHorizontal size={14} />
        </button>
      </div>

      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-bold text-[#111827]">{lead.value}</span>
        <div className="flex items-center gap-1">
          {lead.score >= 80 && <Flame size={12} className="text-rose-500" />}
          <span className={cn("text-xs font-semibold", lead.score >= 80 ? "text-rose-500" : lead.score >= 60 ? "text-amber-500" : "text-gray-400")}>
            {lead.score}
          </span>
        </div>
      </div>

      <div className="flex gap-1 mb-3 flex-wrap">
        {lead.tags.map((tag) => (
          <span key={tag} className={`text-[10px] px-1.5 py-0.5 rounded-full ${tagColors[tag] || "bg-gray-100 text-gray-600"}`}>
            {tag}
          </span>
        ))}
      </div>

      <div className="flex items-center justify-between text-gray-400">
        <div className="flex items-center gap-2">
          <button className="hover:text-[#6C3BFF] transition-colors"><MessageSquare size={13} /></button>
          <button className="hover:text-[#6C3BFF] transition-colors"><Phone size={13} /></button>
          <button className="hover:text-[#6C3BFF] transition-colors"><Calendar size={13} /></button>
        </div>
        <div className="flex items-center gap-1 text-[10px]">
          <span className={cn(lead.days > 7 ? "text-rose-400" : "text-gray-400")}>
            {lead.days}d
          </span>
          <User size={10} />
          <span className="text-[10px] text-gray-400">{lead.channel}</span>
        </div>
      </div>
    </div>
  );
}

export default function CRMPage() {
  const [stages] = useState<Stage[]>(initialStages);

  const totalValue = stages.flatMap((s) => s.leads).reduce((acc, l) => {
    const v = parseFloat(l.value.replace("R$", "").replace(".", "").replace(",", ".").trim());
    return acc + (isNaN(v) ? 0 : v);
  }, 0);

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <Topbar
        title="CRM — Pipeline"
        subtitle={`${stages.flatMap((s) => s.leads).length} leads · R$ ${totalValue.toLocaleString("pt-BR", { minimumFractionDigits: 0 })} em pipeline`}
        action={{ label: "Novo Lead", onClick: () => {} }}
      />

      <div className="flex-1 overflow-x-auto p-6">
        <div className="flex gap-4 h-full min-w-max">
          {stages.map((stage) => (
            <div key={stage.id} className="w-[260px] flex flex-col flex-shrink-0">
              {/* Stage header */}
              <div className="flex items-center gap-2 mb-3">
                <div className={`w-2.5 h-2.5 rounded-full ${stage.color}`} />
                <span className="text-sm font-semibold text-[#111827] flex-1">{stage.label}</span>
                <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full font-medium">
                  {stage.leads.length}
                </span>
                <button className="text-gray-400 hover:text-gray-600 transition-colors">
                  <MoreHorizontal size={14} />
                </button>
              </div>

              {/* Cards */}
              <div className="flex-1 overflow-y-auto space-y-2.5 pr-1">
                {stage.leads.map((lead) => (
                  <LeadCard key={lead.id} lead={lead} />
                ))}

                {/* Add card */}
                <button className="w-full py-2.5 flex items-center justify-center gap-1.5 text-gray-400 hover:text-[#6C3BFF] hover:bg-[#6C3BFF]/5 rounded-xl border-2 border-dashed border-gray-200 hover:border-[#6C3BFF]/30 transition-all text-sm">
                  <Plus size={14} />
                  Adicionar Lead
                </button>
              </div>

              {/* Stage total */}
              <div className="mt-3 pt-3 border-t border-gray-100">
                <p className="text-xs text-gray-400 text-center">
                  Total:{" "}
                  <span className="font-semibold text-[#111827]">
                    R${" "}
                    {stage.leads.reduce((acc, l) => {
                      const v = parseFloat(l.value.replace("R$", "").replace(".", "").replace(",", ".").trim());
                      return acc + (isNaN(v) ? 0 : v);
                    }, 0).toLocaleString("pt-BR")}
                  </span>
                </p>
              </div>
            </div>
          ))}

          {/* Add stage */}
          <div className="w-[260px] flex-shrink-0">
            <button className="w-full h-12 flex items-center justify-center gap-2 text-gray-400 hover:text-[#6C3BFF] bg-white/50 hover:bg-white rounded-xl border-2 border-dashed border-gray-200 hover:border-[#6C3BFF]/30 transition-all text-sm">
              <Plus size={16} />
              Nova Etapa
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
