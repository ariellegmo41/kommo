"use client";

import Topbar from "@/components/Topbar";
import { useState } from "react";
import {
  Plus, Zap, GitBranch, MessageSquare, User, Tag,
  Clock, Globe, Bot, ChevronRight, Play, Pause, Pencil, Trash2,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Automation {
  id: string;
  name: string;
  trigger: string;
  actions: string[];
  active: boolean;
  runs: number;
}

const automations: Automation[] = [
  {
    id: "1",
    name: "Boas-vindas automático",
    trigger: "Nova mensagem recebida",
    actions: ["Enviar mensagem de boas-vindas", "Adicionar tag 'Novo'", "Atribuir ao SDR"],
    active: true,
    runs: 1432,
  },
  {
    id: "2",
    name: "Follow-up após 24h",
    trigger: "Inatividade por 24h",
    actions: ["Enviar follow-up", "Criar tarefa para vendedor"],
    active: true,
    runs: 287,
  },
  {
    id: "3",
    name: "Qualificação com IA",
    trigger: "Lead criado",
    actions: ["Chamar IA de qualificação", "Mover para etapa", "Notificar equipe"],
    active: true,
    runs: 654,
  },
  {
    id: "4",
    name: "Campanha pós-proposta",
    trigger: "Mudança de etapa: Proposta",
    actions: ["Enviar PDF da proposta", "Agendar follow-up em 2 dias"],
    active: false,
    runs: 89,
  },
  {
    id: "5",
    name: "Alerta de lead quente",
    trigger: "Score > 85",
    actions: ["Notificar closer por WhatsApp", "Criar tarefa urgente"],
    active: true,
    runs: 213,
  },
];

const triggers = [
  { icon: MessageSquare, label: "Nova mensagem", color: "bg-blue-100 text-blue-600" },
  { icon: User, label: "Lead criado", color: "bg-green-100 text-green-600" },
  { icon: GitBranch, label: "Mudança de etapa", color: "bg-purple-100 text-purple-600" },
  { icon: Clock, label: "Inatividade", color: "bg-amber-100 text-amber-600" },
  { icon: Tag, label: "Palavra-chave", color: "bg-rose-100 text-rose-600" },
  { icon: Globe, label: "Webhook recebido", color: "bg-gray-100 text-gray-600" },
];

const actions = [
  { icon: MessageSquare, label: "Enviar mensagem", color: "bg-[#6C3BFF]/10 text-[#6C3BFF]" },
  { icon: Plus, label: "Criar tarefa", color: "bg-green-100 text-green-600" },
  { icon: User, label: "Trocar responsável", color: "bg-blue-100 text-blue-600" },
  { icon: GitBranch, label: "Mover etapa", color: "bg-amber-100 text-amber-600" },
  { icon: Bot, label: "Chamar IA", color: "bg-purple-100 text-purple-600" },
  { icon: Globe, label: "Enviar webhook", color: "bg-gray-100 text-gray-600" },
];

export default function FunisPage() {
  const [list, setList] = useState<Automation[]>(automations);

  function toggle(id: string) {
    setList((prev) =>
      prev.map((a) => (a.id === id ? { ...a, active: !a.active } : a))
    );
  }

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <Topbar
        title="Automações"
        subtitle="Motor visual no-code de automações"
        action={{ label: "Nova Automação", onClick: () => {} }}
      />

      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-4 gap-4">
          {[
            { label: "Automações Ativas", value: list.filter((a) => a.active).length },
            { label: "Total de Execuções", value: list.reduce((acc, a) => acc + a.runs, 0).toLocaleString("pt-BR") },
            { label: "Mensagens Enviadas", value: "8.430" },
            { label: "Leads Qualificados", value: "654" },
          ].map((s) => (
            <div key={s.label} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
              <p className="text-2xl font-bold text-[#111827]">{s.value}</p>
              <p className="text-xs text-gray-400 mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-3 gap-6">
          {/* Automations list */}
          <div className="col-span-2 space-y-3">
            <h3 className="font-semibold text-[#111827]">Suas Automações</h3>
            {list.map((auto) => (
              <div key={auto.id} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      "w-9 h-9 rounded-lg flex items-center justify-center",
                      auto.active ? "bg-[#6C3BFF]/10" : "bg-gray-100"
                    )}>
                      <Zap size={16} className={auto.active ? "text-[#6C3BFF]" : "text-gray-400"} />
                    </div>
                    <div>
                      <p className="font-medium text-[#111827] text-sm">{auto.name}</p>
                      <p className="text-xs text-gray-400">{auto.runs.toLocaleString("pt-BR")} execuções</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="text-gray-400 hover:text-gray-600 transition-colors"><Pencil size={14} /></button>
                    <button className="text-gray-400 hover:text-rose-500 transition-colors"><Trash2 size={14} /></button>
                    <button
                      onClick={() => toggle(auto.id)}
                      className={cn(
                        "p-1.5 rounded-lg transition-colors",
                        auto.active ? "bg-[#10B981]/10 text-[#10B981] hover:bg-[#10B981]/20" : "bg-gray-100 text-gray-400 hover:bg-gray-200"
                      )}
                    >
                      {auto.active ? <Pause size={14} /> : <Play size={14} />}
                    </button>
                  </div>
                </div>

                {/* Flow visual */}
                <div className="flex items-center gap-2 flex-wrap">
                  <div className="flex items-center gap-1.5 bg-blue-50 border border-blue-100 rounded-lg px-2.5 py-1.5">
                    <Zap size={12} className="text-blue-500" />
                    <span className="text-xs text-blue-700 font-medium">{auto.trigger}</span>
                  </div>
                  {auto.actions.map((action, i) => (
                    <div key={i} className="flex items-center gap-1.5">
                      <ChevronRight size={12} className="text-gray-300" />
                      <div className="flex items-center gap-1.5 bg-[#6C3BFF]/5 border border-[#6C3BFF]/15 rounded-lg px-2.5 py-1.5">
                        <span className="text-xs text-[#6C3BFF]">{action}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Builder palette */}
          <div className="space-y-4">
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
              <h4 className="text-sm font-semibold text-[#111827] mb-3">Gatilhos disponíveis</h4>
              <div className="space-y-2">
                {triggers.map((t) => (
                  <div key={t.label} className="flex items-center gap-2.5 p-2 rounded-lg hover:bg-gray-50 cursor-grab transition-colors">
                    <div className={`w-7 h-7 rounded-lg ${t.color} flex items-center justify-center flex-shrink-0`}>
                      <t.icon size={14} />
                    </div>
                    <span className="text-sm text-gray-700">{t.label}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
              <h4 className="text-sm font-semibold text-[#111827] mb-3">Ações disponíveis</h4>
              <div className="space-y-2">
                {actions.map((a) => (
                  <div key={a.label} className="flex items-center gap-2.5 p-2 rounded-lg hover:bg-gray-50 cursor-grab transition-colors">
                    <div className={`w-7 h-7 rounded-lg ${a.color} flex items-center justify-center flex-shrink-0`}>
                      <a.icon size={14} />
                    </div>
                    <span className="text-sm text-gray-700">{a.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
