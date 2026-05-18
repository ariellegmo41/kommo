"use client";

import Topbar from "@/components/Topbar";
import { MessageSquare, Globe, Zap, DollarSign, BarChart3, Check, Plus } from "lucide-react";

const integrations = [
  { name: "WhatsApp Business API", desc: "Integração oficial Meta — multi números", icon: MessageSquare, connected: true, color: "bg-green-100 text-green-600", category: "Mensagens" },
  { name: "Instagram Direct", desc: "Mensagens e DMs via API Meta", icon: MessageSquare, connected: true, color: "bg-pink-100 text-pink-600", category: "Mensagens" },
  { name: "Telegram", desc: "Bot e canal Telegram", icon: MessageSquare, connected: false, color: "bg-blue-100 text-blue-600", category: "Mensagens" },
  { name: "Google Calendar", desc: "Sincronização de agenda e reuniões", icon: Globe, connected: true, color: "bg-orange-100 text-orange-600", category: "Produtividade" },
  { name: "n8n", desc: "Automações e integrações personalizadas", icon: Zap, connected: false, color: "bg-red-100 text-red-600", category: "Automação" },
  { name: "Make (Integromat)", desc: "Construção de fluxos avançados", icon: Zap, connected: false, color: "bg-purple-100 text-purple-600", category: "Automação" },
  { name: "Zapier", desc: "Conecte com mais de 5.000 apps", icon: Zap, connected: true, color: "bg-amber-100 text-amber-600", category: "Automação" },
  { name: "Stripe", desc: "Pagamentos e assinaturas", icon: DollarSign, connected: false, color: "bg-indigo-100 text-indigo-600", category: "Pagamentos" },
  { name: "Mercado Pago", desc: "Pagamentos no Brasil", icon: DollarSign, connected: false, color: "bg-blue-100 text-blue-700", category: "Pagamentos" },
  { name: "HubSpot", desc: "Sincronização de CRM externo", icon: BarChart3, connected: false, color: "bg-orange-100 text-orange-600", category: "CRM" },
  { name: "Pipedrive", desc: "Integração com funil Pipedrive", icon: BarChart3, connected: false, color: "bg-teal-100 text-teal-600", category: "CRM" },
  { name: "Webhook", desc: "Envie e receba dados via HTTP", icon: Globe, connected: true, color: "bg-gray-100 text-gray-600", category: "API" },
];

const categories = ["Todas", "Mensagens", "Automação", "Pagamentos", "CRM", "Produtividade", "API"];

export default function IntegracoesPage() {
  return (
    <div className="flex flex-col h-full overflow-hidden">
      <Topbar title="Integrações" subtitle="Conecte o IDEA Atende com suas ferramentas" />

      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        <div className="flex items-center gap-2 flex-wrap">
          {categories.map((c, i) => (
            <button key={c} className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${i === 0 ? "bg-[#6C3BFF] text-white" : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"}`}>
              {c}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-3 gap-4">
          {integrations.map((int) => (
            <div key={int.name} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 flex items-start gap-3">
              <div className={`w-10 h-10 rounded-xl ${int.color} flex items-center justify-center flex-shrink-0`}>
                <int.icon size={18} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-0.5">
                  <p className="font-medium text-[#111827] text-sm truncate">{int.name}</p>
                  {int.connected && (
                    <span className="flex items-center gap-1 text-[10px] text-[#10B981] bg-green-50 px-1.5 py-0.5 rounded-full ml-1 flex-shrink-0">
                      <Check size={8} /> Ativo
                    </span>
                  )}
                </div>
                <p className="text-xs text-gray-400 mb-3 leading-relaxed">{int.desc}</p>
                <button className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-colors flex items-center gap-1 ${
                  int.connected
                    ? "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    : "bg-[#6C3BFF] text-white hover:bg-[#5930e8]"
                }`}>
                  {int.connected ? "Configurar" : <><Plus size={11} /> Conectar</>}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
