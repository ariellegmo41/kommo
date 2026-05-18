"use client";

import { useState } from "react";
import Topbar from "@/components/Topbar";
import {
  Megaphone, Users, Send, Eye, MoreHorizontal, Plus, X,
  MessageSquare, Mail, Camera, ChevronRight, ChevronLeft,
  Calendar, Tag, Check, Clock, BarChart2,
} from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import { cn } from "@/lib/utils";

const campaigns = [
  { id: "1", name: "Coleção Verão 2026 — Lançamento", status: "Ativa", channel: "WhatsApp", sent: 1842, delivered: 1810, opened: 1540, clicked: 387, date: "18/05/2026" },
  { id: "2", name: "VIP Night — Clientes Especiais", status: "Agendada", channel: "WhatsApp", sent: 0, delivered: 0, opened: 0, clicked: 0, date: "22/05/2026" },
  { id: "3", name: "Liquidação Inverno — Até 50% OFF", status: "Concluída", channel: "WhatsApp", sent: 2130, delivered: 2098, opened: 1670, clicked: 412, date: "10/05/2026" },
  { id: "4", name: "Novas Peças — Outono Elegante", status: "Rascunho", channel: "Instagram", sent: 0, delivered: 0, opened: 0, clicked: 0, date: "-" },
];

const perfData = [
  { name: "Enviado", value: 1842 },
  { name: "Entregue", value: 1810 },
  { name: "Aberto", value: 1540 },
  { name: "Clicado", value: 387 },
];

const statusColors: Record<string, string> = {
  Ativa: "bg-green-100 text-green-700",
  Agendada: "bg-blue-100 text-blue-700",
  Concluída: "bg-gray-100 text-gray-600",
  Rascunho: "bg-amber-100 text-amber-700",
};

const templates = [
  { id: "1", name: "Lançamento Coleção", preview: "Oi {{nome}}! A nova Coleção Verão 2026 da Bella Modas chegou! Peças exclusivas para você arrasar..." },
  { id: "2", name: "Follow-up produto", preview: "Oi {{nome}}, vi que você se interessou pelo {{produto}}. Ainda temos no seu tamanho!" },
  { id: "3", name: "Reativação cliente", preview: "{{nome}}, sentimos sua falta! Temos novidades lindas esperando por você na Bella Modas 😍" },
  { id: "4", name: "Pedido confirmado", preview: "Olá {{nome}}, seu pedido foi confirmado! Em breve chega na sua casa com muito amor 💜" },
];

const segments = [
  { id: "1", name: "Todas as clientes",            count: 2340 },
  { id: "2", name: "Clientes VIP (score ≥ 80)",    count: 312  },
  { id: "3", name: "Sem compra há 30 dias",         count: 487  },
  { id: "4", name: "Interessadas — sem fechar",     count: 194  },
  { id: "5", name: "Seguidoras Instagram",          count: 890  },
];

const channelOptions = [
  { id: "whatsapp", label: "WhatsApp", icon: MessageSquare, color: "border-green-300 bg-green-50" },
  { id: "email", label: "Email", icon: Mail, color: "border-blue-300 bg-blue-50" },
  { id: "instagram", label: "Instagram", icon: Camera, color: "border-pink-300 bg-pink-50" },
];

const steps = ["Canal", "Audiência", "Mensagem", "Agendamento", "Revisão"];

function WizardModal({ onClose }: { onClose: () => void }) {
  const [step, setStep] = useState(0);
  const [channel, setChannel] = useState("");
  const [segment, setSegment] = useState("");
  const [template, setTemplate] = useState("");
  const [message, setMessage] = useState("");
  const [scheduleType, setScheduleType] = useState<"now" | "later">("now");
  const [name, setName] = useState("Nova Campanha");

  const selectedSegment = segments.find((s) => s.id === segment);
  const selectedTemplate = templates.find((t) => t.id === template);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-[620px] max-h-[80vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div>
            <h2 className="font-semibold text-[#111827]">Nova Campanha</h2>
            <p className="text-xs text-gray-400 mt-0.5">Passo {step + 1} de {steps.length}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <X size={16} className="text-gray-400" />
          </button>
        </div>

        {/* Progress */}
        <div className="px-6 py-3 border-b border-gray-100">
          <div className="flex items-center gap-1">
            {steps.map((s, i) => (
              <div key={s} className="flex items-center gap-1 flex-1">
                <div className={cn("w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 transition-colors",
                  i < step ? "bg-[#10B981] text-white" : i === step ? "bg-[#6C3BFF] text-white" : "bg-gray-100 text-gray-400"
                )}>
                  {i < step ? <Check size={12} /> : i + 1}
                </div>
                <span className={cn("text-xs flex-shrink-0", i === step ? "text-[#6C3BFF] font-medium" : "text-gray-400")}>{s}</span>
                {i < steps.length - 1 && <div className="flex-1 h-px bg-gray-200 mx-1" />}
              </div>
            ))}
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6">
          {step === 0 && (
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">Nome da campanha</label>
                <input value={name} onChange={(e) => setName(e.target.value)} className="w-full px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6C3BFF]/20" />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-3">Canal de envio</label>
                <div className="grid grid-cols-3 gap-3">
                  {channelOptions.map((ch) => (
                    <button key={ch.id} onClick={() => setChannel(ch.id)} className={cn("flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all", channel === ch.id ? "border-[#6C3BFF] bg-[#6C3BFF]/5" : `${ch.color} border-transparent hover:border-gray-300`)}>
                      <ch.icon size={24} className={channel === ch.id ? "text-[#6C3BFF]" : "text-gray-600"} />
                      <span className={cn("text-sm font-medium", channel === ch.id ? "text-[#6C3BFF]" : "text-gray-700")}>{ch.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {step === 1 && (
            <div className="space-y-3">
              <p className="text-sm text-gray-500 mb-4">Selecione o segmento de contatos que receberá a campanha.</p>
              {segments.map((seg) => (
                <button key={seg.id} onClick={() => setSegment(seg.id)} className={cn("w-full flex items-center justify-between px-4 py-3 rounded-xl border-2 text-left transition-all", segment === seg.id ? "border-[#6C3BFF] bg-[#6C3BFF]/5" : "border-gray-100 bg-gray-50 hover:border-gray-200")}>
                  <div className="flex items-center gap-3">
                    <Tag size={15} className={segment === seg.id ? "text-[#6C3BFF]" : "text-gray-400"} />
                    <span className={cn("text-sm font-medium", segment === seg.id ? "text-[#6C3BFF]" : "text-[#111827]")}>{seg.name}</span>
                  </div>
                  <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">{seg.count.toLocaleString("pt-BR")} contatos</span>
                </button>
              ))}
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium text-gray-700 mb-3">Templates aprovados</p>
                <div className="space-y-2 mb-4">
                  {templates.map((t) => (
                    <button key={t.id} onClick={() => { setTemplate(t.id); setMessage(t.preview); }} className={cn("w-full text-left px-4 py-3 rounded-xl border-2 transition-all", template === t.id ? "border-[#6C3BFF] bg-[#6C3BFF]/5" : "border-gray-100 bg-gray-50 hover:border-gray-200")}>
                      <p className={cn("text-sm font-medium mb-0.5", template === t.id ? "text-[#6C3BFF]" : "text-[#111827]")}>{t.name}</p>
                      <p className="text-xs text-gray-400 truncate">{t.preview}</p>
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">Mensagem personalizada</label>
                <textarea rows={4} value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Escreva sua mensagem... Use {{nome}} para personalizar." className="w-full px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6C3BFF]/20 resize-none" />
                <p className="text-xs text-gray-400 mt-1">Variáveis disponíveis: {"{{nome}}"} {"{{empresa}}"} {"{{link}}"}</p>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <div className="flex gap-3">
                <button onClick={() => setScheduleType("now")} className={cn("flex-1 flex items-center gap-3 px-4 py-3 rounded-xl border-2 transition-all", scheduleType === "now" ? "border-[#6C3BFF] bg-[#6C3BFF]/5" : "border-gray-100 bg-gray-50")}>
                  <Send size={16} className={scheduleType === "now" ? "text-[#6C3BFF]" : "text-gray-400"} />
                  <div className="text-left">
                    <p className={cn("text-sm font-medium", scheduleType === "now" ? "text-[#6C3BFF]" : "text-[#111827]")}>Enviar agora</p>
                    <p className="text-xs text-gray-400">Disparo imediato</p>
                  </div>
                </button>
                <button onClick={() => setScheduleType("later")} className={cn("flex-1 flex items-center gap-3 px-4 py-3 rounded-xl border-2 transition-all", scheduleType === "later" ? "border-[#6C3BFF] bg-[#6C3BFF]/5" : "border-gray-100 bg-gray-50")}>
                  <Clock size={16} className={scheduleType === "later" ? "text-[#6C3BFF]" : "text-gray-400"} />
                  <div className="text-left">
                    <p className={cn("text-sm font-medium", scheduleType === "later" ? "text-[#6C3BFF]" : "text-[#111827]")}>Agendar</p>
                    <p className="text-xs text-gray-400">Escolher data/hora</p>
                  </div>
                </button>
              </div>
              {scheduleType === "later" && (
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-medium text-gray-500 block mb-1">Data</label>
                    <input type="date" className="w-full px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6C3BFF]/20" defaultValue="2026-05-20" />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-500 block mb-1">Hora</label>
                    <input type="time" className="w-full px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6C3BFF]/20" defaultValue="09:00" />
                  </div>
                </div>
              )}
            </div>
          )}

          {step === 4 && (
            <div className="space-y-4">
              <div className="bg-gray-50 rounded-xl p-4 space-y-3">
                {[
                  { label: "Nome", value: name },
                  { label: "Canal", value: channel || "Não selecionado" },
                  { label: "Audiência", value: selectedSegment ? `${selectedSegment.name} (${selectedSegment.count.toLocaleString("pt-BR")})` : "Não selecionado" },
                  { label: "Template", value: selectedTemplate?.name || "Personalizado" },
                  { label: "Envio", value: scheduleType === "now" ? "Imediato" : "Agendado — 20/05/2026 09:00" },
                ].map((r) => (
                  <div key={r.label} className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">{r.label}</span>
                    <span className="text-sm font-medium text-[#111827]">{r.value}</span>
                  </div>
                ))}
              </div>
              <div className="bg-[#6C3BFF]/5 border border-[#6C3BFF]/20 rounded-xl p-4">
                <p className="text-sm text-[#6C3BFF] font-medium mb-1">Preview da mensagem</p>
                <p className="text-sm text-gray-600 leading-relaxed">{message || "Nenhuma mensagem configurada"}</p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100">
          <button onClick={() => step > 0 ? setStep(s => s - 1) : onClose()} className="flex items-center gap-1.5 px-4 py-2 text-sm text-gray-500 hover:bg-gray-100 rounded-lg transition-colors">
            <ChevronLeft size={14} /> {step === 0 ? "Cancelar" : "Voltar"}
          </button>
          <button onClick={() => step < steps.length - 1 ? setStep(s => s + 1) : onClose()} className="flex items-center gap-1.5 px-5 py-2 bg-[#6C3BFF] text-white text-sm font-medium rounded-lg hover:bg-[#5930e8] transition-colors">
            {step === steps.length - 1 ? <><Send size={14} /> Disparar Campanha</> : <>Continuar <ChevronRight size={14} /></>}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function CampanhasPage() {
  const [showWizard, setShowWizard] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState(campaigns[0]);

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <Topbar
        title="Campanhas"
        subtitle="Gestão de campanhas e broadcasts"
        action={{ label: "Nova Campanha", onClick: () => setShowWizard(true) }}
      />

      {showWizard && <WizardModal onClose={() => setShowWizard(false)} />}

      <div className="flex-1 overflow-hidden flex">
        {/* List */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* Stats */}
            <div className="grid grid-cols-4 gap-4">
              {[
                { label: "Campanhas Ativas", value: "2", icon: Megaphone },
                { label: "Total Enviados", value: "3.540", icon: Send },
                { label: "Taxa de Abertura", value: "73%", icon: Eye },
                { label: "Leads Alcançados", value: "2.890", icon: Users },
              ].map((s) => (
                <div key={s.label} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                  <s.icon size={18} className="text-[#6C3BFF] mb-2" />
                  <p className="text-2xl font-bold text-[#111827]">{s.value}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{s.label}</p>
                </div>
              ))}
            </div>

            {/* Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-100">
                    {["Campanha", "Status", "Canal", "Enviados", "Entregues", "Abertos", "Clicados", "Data", ""].map((h) => (
                      <th key={h} className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wide px-4 py-3">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {campaigns.map((c) => (
                    <tr
                      key={c.id}
                      onClick={() => setSelectedCampaign(c)}
                      className={cn("hover:bg-gray-50 transition-colors cursor-pointer", selectedCampaign.id === c.id && "bg-[#6C3BFF]/5")}
                    >
                      <td className="px-4 py-3 text-sm font-medium text-[#111827]">{c.name}</td>
                      <td className="px-4 py-3"><span className={`text-xs px-2.5 py-1 rounded-full font-medium ${statusColors[c.status]}`}>{c.status}</span></td>
                      <td className="px-4 py-3 text-sm text-gray-600">{c.channel}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{c.sent.toLocaleString("pt-BR")}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{c.delivered.toLocaleString("pt-BR")}</td>
                      <td className="px-4 py-3 text-sm text-[#10B981] font-medium">{c.opened.toLocaleString("pt-BR")}</td>
                      <td className="px-4 py-3 text-sm text-[#6C3BFF] font-medium">{c.clicked.toLocaleString("pt-BR")}</td>
                      <td className="px-4 py-3 text-xs text-gray-400">{c.date}</td>
                      <td className="px-4 py-3"><button className="text-gray-400 hover:text-gray-600"><MoreHorizontal size={16} /></button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Campaign detail */}
        <div className="w-72 bg-white border-l border-gray-200 flex flex-col flex-shrink-0 overflow-y-auto">
          <div className="p-4 border-b border-gray-100">
            <h3 className="font-semibold text-[#111827] text-sm truncate">{selectedCampaign.name}</h3>
            <span className={`text-xs px-2.5 py-0.5 rounded-full font-medium mt-1 inline-block ${statusColors[selectedCampaign.status]}`}>{selectedCampaign.status}</span>
          </div>
          <div className="p-4 space-y-5">
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">Performance</p>
              <ResponsiveContainer width="100%" height={160}>
                <BarChart data={perfData} barSize={28}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                  <XAxis dataKey="name" tick={{ fontSize: 9, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 9, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
                  <Tooltip />
                  <Bar dataKey="value" fill="#6C3BFF" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-2 text-sm">
              {[
                { label: "Taxa de entrega", value: selectedCampaign.sent > 0 ? `${((selectedCampaign.delivered / selectedCampaign.sent) * 100).toFixed(1)}%` : "-" },
                { label: "Taxa de abertura", value: selectedCampaign.delivered > 0 ? `${((selectedCampaign.opened / selectedCampaign.delivered) * 100).toFixed(1)}%` : "-" },
                { label: "Taxa de clique", value: selectedCampaign.opened > 0 ? `${((selectedCampaign.clicked / selectedCampaign.opened) * 100).toFixed(1)}%` : "-" },
              ].map((m) => (
                <div key={m.label} className="flex justify-between">
                  <span className="text-gray-500">{m.label}</span>
                  <span className="font-semibold text-[#111827]">{m.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
