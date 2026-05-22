"use client";

import Topbar from "@/components/Topbar";
import { Bot, Plus, Play, Pause, Pencil, MessageSquare, GitBranch, X, Check } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

const bots = [
  { id: "1", name: "Boas-vindas Bella Modas",    active: true,  conversations: 1842, responses: 98, channel: "WhatsApp + Instagram" },
  { id: "2", name: "Guia de Tamanhos & Medidas", active: true,  conversations: 743,  responses: 96, channel: "WhatsApp" },
  { id: "3", name: "Assistente de Moda",         active: true,  conversations: 391,  responses: 93, channel: "Instagram + TikTok" },
  { id: "4", name: "Trocas & Devoluções",        active: false, conversations: 128,  responses: 91, channel: "WhatsApp" },
];

const flowSteps = [
  { label: "Nova mensagem recebida", type: "trigger", color: "bg-blue-500" },
  { label: "Olá! Seja bem-vinda à Bella Modas 💜", type: "message", color: "bg-[#6C3BFF]" },
  { label: "Pergunta: O que você procura?", type: "question", color: "bg-amber-500" },
  { label: "Condição: Tamanho / Produto / Troca", type: "condition", color: "bg-rose-500" },
  { label: "Enviar catálogo e tabela de medidas", type: "message", color: "bg-[#6C3BFF]" },
  { label: "Transferir para consultora de estilo", type: "handoff", color: "bg-[#10B981]" },
];

export default function SalesbotPage() {
  const [list, setList] = useState(bots);
  const [steps, setSteps] = useState(flowSteps);
  const [showNewBot, setShowNewBot] = useState(false);
  const [editBot, setEditBot] = useState<typeof bots[0] | null>(null);
  const [newBotName, setNewBotName] = useState("");
  const [newBotChannel, setNewBotChannel] = useState("WhatsApp");
  const [newStep, setNewStep] = useState("");
  const [saved, setSaved] = useState(false);

  function toggle(id: string) {
    setList((prev) => prev.map((b) => b.id === id ? { ...b, active: !b.active } : b));
  }

  function addBot() {
    if (!newBotName.trim()) return;
    setList((prev) => [...prev, { id: String(Date.now()), name: newBotName, active: false, conversations: 0, responses: 0, channel: newBotChannel }]);
    setNewBotName("");
    setShowNewBot(false);
  }

  function saveEditBot() {
    if (!editBot) return;
    setList((prev) => prev.map((b) => b.id === editBot.id ? editBot : b));
    setSaved(true);
    setTimeout(() => { setSaved(false); setEditBot(null); }, 1500);
  }

  function addStep() {
    if (!newStep.trim()) return;
    setSteps((prev) => [...prev, { label: newStep, type: "message", color: "bg-[#6C3BFF]" }]);
    setNewStep("");
  }

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <Topbar title="Salesbot" subtitle="Bots de atendimento e qualificação" action={{ label: "Novo Bot", onClick: () => setShowNewBot(true) }} />

      {showNewBot && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40" onClick={() => setShowNewBot(false)} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-[380px] p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-[#111827]">Novo Bot</h3>
              <button onClick={() => setShowNewBot(false)}><X size={16} className="text-gray-400" /></button>
            </div>
            <div className="space-y-3">
              <div>
                <label className="text-xs font-medium text-gray-500 block mb-1">Nome do bot</label>
                <input value={newBotName} onChange={(e) => setNewBotName(e.target.value)} placeholder="Ex: Atendimento VIP" className="w-full px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6C3BFF]/20" />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-500 block mb-1">Canal</label>
                <select value={newBotChannel} onChange={(e) => setNewBotChannel(e.target.value)} className="w-full px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none">
                  {["WhatsApp","Instagram","TikTok","WhatsApp + Instagram"].map((c) => <option key={c}>{c}</option>)}
                </select>
              </div>
              <button onClick={addBot} className="w-full py-2 bg-[#6C3BFF] text-white text-sm font-medium rounded-lg hover:bg-[#5930e8] transition-colors">Criar Bot</button>
            </div>
          </div>
        </div>
      )}

      {editBot && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40" onClick={() => setEditBot(null)} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-[380px] p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-[#111827]">Editar Bot</h3>
              <button onClick={() => setEditBot(null)}><X size={16} className="text-gray-400" /></button>
            </div>
            <div className="space-y-3">
              <div>
                <label className="text-xs font-medium text-gray-500 block mb-1">Nome</label>
                <input value={editBot.name} onChange={(e) => setEditBot({ ...editBot, name: e.target.value })} className="w-full px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6C3BFF]/20" />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-500 block mb-1">Canal</label>
                <input value={editBot.channel} onChange={(e) => setEditBot({ ...editBot, channel: e.target.value })} className="w-full px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none" />
              </div>
              <button onClick={saveEditBot} className={cn("w-full py-2 text-sm font-medium rounded-lg transition-colors", saved ? "bg-[#10B981] text-white" : "bg-[#6C3BFF] text-white hover:bg-[#5930e8]")}>
                {saved ? "✓ Salvo!" : "Salvar Alterações"}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        <div className="grid grid-cols-2 gap-6">
          {/* Bot list */}
          <div className="space-y-3">
            <h3 className="font-semibold text-[#111827]">Seus Bots</h3>
            {list.map((bot) => (
              <div key={bot.id} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 flex items-start gap-3">
                <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0", bot.active ? "bg-[#6C3BFF]/10" : "bg-gray-100")}>
                  <Bot size={18} className={bot.active ? "text-[#6C3BFF]" : "text-gray-400"} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <p className="font-medium text-[#111827] text-sm">{bot.name}</p>
                    <div className="flex items-center gap-1.5">
                      <button onClick={() => setEditBot(bot)} className="p-1.5 text-gray-400 hover:text-[#6C3BFF] hover:bg-[#6C3BFF]/5 rounded-lg transition-colors"><Pencil size={13} /></button>
                      <button onClick={() => toggle(bot.id)} className={cn("p-1.5 rounded-lg transition-colors", bot.active ? "bg-[#10B981]/10 text-[#10B981]" : "bg-gray-100 text-gray-400")}>
                        {bot.active ? <Pause size={13} /> : <Play size={13} />}
                      </button>
                    </div>
                  </div>
                  <p className="text-xs text-gray-400 mb-2">Canal: {bot.channel}</p>
                  <div className="flex gap-4 text-xs">
                    <span><span className="font-bold text-[#111827]">{bot.conversations.toLocaleString("pt-BR")}</span> <span className="text-gray-400">conversas</span></span>
                    <span><span className="font-bold text-[#10B981]">{bot.responses}%</span> <span className="text-gray-400">resolvidas</span></span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Flow preview */}
          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
            <h3 className="font-semibold text-[#111827] mb-4">Fluxo — Boas-vindas Bella Modas</h3>
            <div className="space-y-2">
              {steps.map((step, i) => (
                <div key={i} className="flex items-center gap-3">
                  {i > 0 && <div className="w-px h-4 bg-gray-200 ml-3 -mt-2 absolute" />}
                  <div className={`w-6 h-6 rounded-full ${step.color} flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0`}>
                    {i + 1}
                  </div>
                  <div className="flex-1 flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-2 border border-gray-100">
                    {step.type === "message" && <MessageSquare size={12} className="text-[#6C3BFF]" />}
                    {step.type === "condition" && <GitBranch size={12} className="text-rose-500" />}
                    {step.type === "trigger" && <Play size={12} className="text-blue-500" />}
                    {(step.type === "question" || step.type === "handoff") && <Bot size={12} className="text-amber-500" />}
                    <span className="text-sm text-gray-700">{step.label}</span>
                    <span className="ml-auto text-[10px] px-1.5 py-0.5 bg-gray-100 rounded text-gray-500 capitalize">{step.type}</span>
                  </div>
                </div>
              ))}
              <div className="flex gap-2 mt-2">
                <input value={newStep} onChange={(e) => setNewStep(e.target.value)} onKeyDown={(e) => e.key === "Enter" && addStep()} placeholder="Novo passo..." className="flex-1 px-3 py-1.5 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6C3BFF]/20" />
                <button onClick={addStep} className="flex items-center gap-1 px-3 py-1.5 bg-[#6C3BFF]/10 text-[#6C3BFF] hover:bg-[#6C3BFF]/20 rounded-lg text-sm font-medium transition-colors">
                  <Plus size={14} /> Adicionar
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
