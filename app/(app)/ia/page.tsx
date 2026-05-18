"use client";

import Topbar from "@/components/Topbar";
import { Bot, Sparkles, MessageSquare, Target, Calendar, Pencil, BookOpen, ShoppingBag, TrendingUp, Settings } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

const features = [
  { icon: MessageSquare, label: "Atendimento Automático", desc: "Responde leads automaticamente com IA conversacional 24/7", active: true, color: "bg-blue-100 text-blue-600" },
  { icon: Target, label: "Qualificação de Leads", desc: "Classifica e pontua leads com base nas respostas", active: true, color: "bg-purple-100 text-purple-600" },
  { icon: Calendar, label: "Agendamento Inteligente", desc: "Agenda reuniões automaticamente via calendário", active: false, color: "bg-amber-100 text-amber-600" },
  { icon: Sparkles, label: "Sugestão de Resposta", desc: "Sugere respostas em tempo real para os agentes", active: true, color: "bg-[#6C3BFF]/10 text-[#6C3BFF]" },
  { icon: Pencil, label: "Correção Gramatical", desc: "Corrige e melhora o texto antes de enviar", active: true, color: "bg-green-100 text-green-600" },
  { icon: BookOpen, label: "Resumo Inteligente", desc: "Resume conversas longas para o agente", active: true, color: "bg-teal-100 text-teal-600" },
  { icon: ShoppingBag, label: "Recomendação de Produtos", desc: "Recomenda produtos com base no perfil do lead", active: false, color: "bg-rose-100 text-rose-600" },
  { icon: TrendingUp, label: "IA Comercial", desc: "Analisa probabilidade de fechamento e sugere ações", active: true, color: "bg-orange-100 text-orange-600" },
];

export default function IAPage() {
  const [items, setItems] = useState(features);

  function toggle(label: string) {
    setItems((prev) => prev.map((i) => i.label === label ? { ...i, active: !i.active } : i));
  }

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <Topbar title="Inteligência Artificial" subtitle="Módulos de IA do IDEA Atende" />

      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* Hero banner */}
        <div className="bg-gradient-to-r from-[#6C3BFF] to-[#7B61FF] rounded-2xl p-6 text-white">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center">
              <Bot size={28} className="text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold">Salesbot + IA</h2>
              <p className="text-white/70 text-sm mt-1">Transforme leads em clientes com inteligência artificial integrada a todos os canais.</p>
            </div>
            <div className="ml-auto text-right">
              <p className="text-3xl font-bold">98%</p>
              <p className="text-white/60 text-xs">Taxa de acerto da IA</p>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-4">
          {[
            { label: "Atendimentos pela IA", value: "3.421" },
            { label: "Leads qualificados", value: "1.230" },
            { label: "Tempo economizado", value: "120h" },
            { label: "Conversões via IA", value: "287" },
          ].map((s) => (
            <div key={s.label} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 text-center">
              <p className="text-2xl font-bold text-[#6C3BFF]">{s.value}</p>
              <p className="text-xs text-gray-400 mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Features grid */}
        <div>
          <h3 className="font-semibold text-[#111827] mb-4">Módulos de IA</h3>
          <div className="grid grid-cols-2 gap-4">
            {items.map((feat) => (
              <div key={feat.label} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 flex items-start gap-3">
                <div className={`w-10 h-10 rounded-xl ${feat.color} flex items-center justify-center flex-shrink-0`}>
                  <feat.icon size={18} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-[#111827] text-sm">{feat.label}</p>
                  <p className="text-xs text-gray-400 mt-0.5 leading-relaxed">{feat.desc}</p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button className="text-gray-300 hover:text-gray-500 transition-colors">
                    <Settings size={14} />
                  </button>
                  <button
                    onClick={() => toggle(feat.label)}
                    className={cn(
                      "w-10 h-5 rounded-full transition-colors relative",
                      feat.active ? "bg-[#6C3BFF]" : "bg-gray-200"
                    )}
                  >
                    <span className={cn(
                      "absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform",
                      feat.active ? "translate-x-5" : "translate-x-0.5"
                    )} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Test IA */}
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <h3 className="font-semibold text-[#111827] mb-4">Testar IA — Playground</h3>
          <div className="flex gap-3">
            <input
              type="text"
              placeholder="Digite uma mensagem para testar a IA..."
              className="flex-1 px-4 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6C3BFF]/20"
            />
            <button className="px-5 py-2.5 bg-[#6C3BFF] text-white text-sm font-medium rounded-lg hover:bg-[#5930e8] transition-colors flex items-center gap-2">
              <Sparkles size={14} /> Testar
            </button>
          </div>
          <div className="mt-3 p-3 bg-gray-50 rounded-lg border border-dashed border-gray-200">
            <p className="text-xs text-gray-400 text-center">A resposta da IA aparecerá aqui...</p>
          </div>
        </div>
      </div>
    </div>
  );
}
