"use client";

import { useState } from "react";
import Topbar from "@/components/Topbar";
import {
  Plus, MessageSquare, Phone, Calendar, Flame, X, Mail,
  Copy, Check, GripVertical, Clock,
} from "lucide-react";
import { cn } from "@/lib/utils";

// ─── Types ────────────────────────────────────────────────────────────────────

interface HistoryEntry { time: string; text: string }

interface Lead {
  id: string; name: string; phone: string; email: string;
  value: string; channel: string; score: number; avatar: string;
  tags: string[]; days: number; note: string; history: HistoryEntry[];
}

interface Stage {
  id: string; label: string; shortLabel: string;
  accent: string; color: string; bgTint: string; leads: Lead[];
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const initialStages: Stage[] = [
  {
    id: "interesse", label: "Novo Interesse", shortLabel: "Interesse",
    accent: "bg-gray-400", color: "#9ca3af", bgTint: "bg-gray-50",
    leads: [
      { id:"1", name:"Fernanda Lima",    phone:"+55 11 98400-1234", email:"fernanda.lima@gmail.com",  value:"R$ 459",   channel:"WhatsApp",  score:82, avatar:"F", tags:["VIP"],              days:0, note:"Interesse no Vestido Midi Floral — tamanho M.", history:[{time:"Hoje 10:30",text:"Mensagem sobre Vestido Midi Floral"},{time:"Hoje 08:12",text:"Entrou via link Instagram"}] },
      { id:"2", name:"Priscila Tavares", phone:"+55 21 97200-5678", email:"priscila.t@gmail.com",    value:"R$ 289",   channel:"TikTok",    score:61, avatar:"P", tags:["Novo"],              days:1, note:"", history:[{time:"Ontem 19:45",text:"Primeiro contato via TikTok — look formatura"}] },
      { id:"3", name:"Camila Rodrigues", phone:"+55 11 99300-9012", email:"camila.r@gmail.com",      value:"R$ 348",   channel:"Instagram", score:74, avatar:"C", tags:["Instagram"],         days:1, note:"", history:[{time:"Ontem 14:20",text:"DM Instagram — Conjunto Alfaiataria"}] },
    ],
  },
  {
    id: "consultoria", label: "Consultoria de Estilo", shortLabel: "Consultoria",
    accent: "bg-[#7B61FF]", color: "#7B61FF", bgTint: "bg-purple-50/50",
    leads: [
      { id:"4", name:"Rafaela Santos",    phone:"+55 11 94500-3456", email:"rafaela.s@gmail.com",   value:"R$ 890",   channel:"Instagram", score:91, avatar:"R", tags:["Consultoria","Quente"], days:2, note:"Look completo para casamento — orçamento até R$ 1.200.", history:[{time:"Hoje 09:00",text:"Consultoria agendada — look casamento"},{time:"Ontem 16:30",text:"Enviou fotos de referência"},{time:"18/05 11:00",text:"Primeiro contato via Instagram Direct"}] },
      { id:"5", name:"Bianca Figueiredo", phone:"+55 11 98700-7890", email:"bianca.f@gmail.com",   value:"R$ 560",   channel:"WhatsApp",  score:78, avatar:"B", tags:["Quente"],              days:3, note:"", history:[{time:"Ontem 11:15",text:"Consultoria — interesse em blazers"},{time:"17/05 09:30",text:"Perguntou sobre parcelamento"}] },
    ],
  },
  {
    id: "proposta", label: "Proposta Enviada", shortLabel: "Proposta",
    accent: "bg-[#6C3BFF]", color: "#6C3BFF", bgTint: "bg-[#6C3BFF]/5",
    leads: [
      { id:"6", name:"Tatiane Oliveira", phone:"+55 11 97100-2345", email:"tatiane.o@gmail.com",  value:"R$ 720",   channel:"WhatsApp",  score:88, avatar:"T", tags:["Look Festa"], days:2, note:"Proposta para 3 peças. Aguardando decisão.",  history:[{time:"Hoje 08:45",text:"Proposta enviada via WhatsApp (PDF)"},{time:"Ontem 15:00",text:"Consultoria finalizada — 3 looks"},{time:"17/05 10:30",text:"Primeiro contato — look festa"}] },
      { id:"7", name:"Larissa Mendes",   phone:"+55 21 98200-6789", email:"larissa.m@gmail.com",  value:"R$ 459",   channel:"WhatsApp",  score:75, avatar:"L", tags:["Troca"],      days:4, note:"Troca Blusa Cropped M → G.",                history:[{time:"Ontem 13:00",text:"Proposta de troca + novo item"},{time:"18/05 09:00",text:"Solicitou troca — tamanho incorreto"}] },
    ],
  },
  {
    id: "pagamento", label: "Aguardando Pagamento", shortLabel: "Pagamento",
    accent: "bg-amber-500", color: "#f59e0b", bgTint: "bg-amber-50/50",
    leads: [
      { id:"8", name:"Andressa Costa", phone:"+55 11 99800-1234", email:"andressa.c@gmail.com", value:"R$ 1.280", channel:"WhatsApp", score:93, avatar:"A", tags:["VIP","Recorrente"], days:1, note:"PIX gerado. Pagamento até 18h.", history:[{time:"Hoje 11:00",text:"Link PIX enviado"},{time:"Hoje 09:30",text:"Aprovação do look VIP — 4 peças"},{time:"Ontem 14:00",text:"Segunda consultoria"}] },
    ],
  },
  {
    id: "confirmado", label: "Pedido Confirmado", shortLabel: "Confirmado",
    accent: "bg-[#10B981]", color: "#10B981", bgTint: "bg-green-50/50",
    leads: [
      { id:"9",  name:"Marina Duarte",   phone:"+55 11 98100-5678", email:"marina.d@gmail.com",   value:"R$ 648", channel:"Instagram", score:99, avatar:"M", tags:["VIP"],        days:5, note:"Entrega agendada para sexta-feira.",   history:[{time:"Hoje 07:00",text:"Pedido #1089 confirmado"},{time:"Ontem 18:00",text:"PIX confirmado — R$ 648"},{time:"18/05 16:00",text:"Proposta aceita — 2 vestidos + 1 conjunto"}] },
      { id:"10", name:"Juliana Freitas", phone:"+55 11 97500-9012", email:"juliana.f@gmail.com",  value:"R$ 459", channel:"WhatsApp",  score:97, avatar:"J", tags:["Recorrente"],  days:7, note:"3ª compra no mês. Cliente fidelizada.", history:[{time:"Ontem 12:00",text:"Pedido #1085 confirmado"},{time:"17/05 11:30",text:"Aprovação via WhatsApp"}] },
    ],
  },
];

// ─── Lookup maps ──────────────────────────────────────────────────────────────

const avatarColors: Record<string, string> = {
  F:"bg-pink-500", P:"bg-rose-500", C:"bg-[#7B61FF]", R:"bg-[#6C3BFF]",
  B:"bg-emerald-600", T:"bg-teal-500", L:"bg-blue-500", A:"bg-amber-500",
  M:"bg-indigo-500", J:"bg-[#10B981]",
};

const tagColors: Record<string, string> = {
  VIP:"bg-amber-100 text-amber-700", Novo:"bg-green-100 text-green-700",
  Quente:"bg-rose-100 text-rose-700", Recorrente:"bg-teal-100 text-teal-700",
  Instagram:"bg-pink-100 text-pink-700", Consultoria:"bg-blue-100 text-blue-700",
  "Look Festa":"bg-purple-100 text-purple-700", Troca:"bg-orange-100 text-orange-700",
};

const channelBadge: Record<string, string> = {
  WhatsApp:"bg-green-100 text-green-700",
  Instagram:"bg-pink-100 text-pink-700",
  TikTok:"bg-slate-100 text-slate-700",
};

// ─── LeadCard ─────────────────────────────────────────────────────────────────

function LeadCard({ lead, accent, onOpen, onDragStart, onDragEnd }: {
  lead: Lead; accent: string;
  onOpen: () => void; onDragStart: () => void; onDragEnd: () => void;
}) {
  return (
    <div
      draggable
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      onClick={onOpen}
      className="bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all cursor-pointer group select-none active:opacity-60"
    >
      <div className={cn("h-0.5 rounded-t-xl", accent)} />
      <div className="p-3.5">
        <div className="flex items-center gap-2 mb-2.5">
          <div className={cn("w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0", avatarColors[lead.avatar] ?? "bg-gray-400")}>
            {lead.avatar}
          </div>
          <p className="flex-1 text-sm font-semibold text-[#111827] truncate">{lead.name}</p>
          <GripVertical size={13} className="text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
        </div>

        <div className="flex items-center gap-2 mb-2.5">
          <span className={cn("text-[10px] font-medium px-2 py-0.5 rounded-full", channelBadge[lead.channel] ?? "bg-gray-100 text-gray-600")}>
            {lead.channel}
          </span>
          <span className={cn("flex items-center gap-0.5 text-[10px]", lead.days >= 5 ? "text-rose-400 font-semibold" : "text-gray-400")}>
            <Clock size={9} />{lead.days}d na etapa
          </span>
        </div>

        {lead.tags.length > 0 && (
          <div className="flex gap-1 flex-wrap mb-2.5">
            {lead.tags.map((t) => (
              <span key={t} className={cn("text-[10px] px-1.5 py-0.5 rounded-full font-medium", tagColors[t] ?? "bg-gray-100 text-gray-600")}>{t}</span>
            ))}
          </div>
        )}

        <div className="flex items-center justify-between pt-2.5 border-t border-gray-50">
          <div className="flex items-center gap-1">
            {lead.score >= 80 && <Flame size={11} className="text-rose-500" />}
            <span className={cn("text-xs font-bold", lead.score >= 80 ? "text-rose-500" : lead.score >= 60 ? "text-amber-500" : "text-gray-400")}>
              {lead.score}
            </span>
          </div>
          <span className="text-sm font-bold text-[#111827]">{lead.value}</span>
          <div className="flex items-center gap-2 text-gray-300">
            <button onClick={(e) => e.stopPropagation()} className="hover:text-[#6C3BFF] transition-colors"><MessageSquare size={12} /></button>
            <button onClick={(e) => e.stopPropagation()} className="hover:text-[#6C3BFF] transition-colors"><Phone size={12} /></button>
            <button onClick={(e) => e.stopPropagation()} className="hover:text-[#6C3BFF] transition-colors"><Calendar size={12} /></button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── LeadDrawer ───────────────────────────────────────────────────────────────

function LeadDrawer({ lead, stageId, stages, onClose, onMove, onRemove }: {
  lead: Lead; stageId: string; stages: Stage[];
  onClose: () => void; onMove: (toStageId: string) => void; onRemove: () => void;
}) {
  const [tab, setTab] = useState<"info" | "historico" | "notas">("info");
  const [note, setNote] = useState(lead.note);
  const [saved, setSaved] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);

  function copy(val: string, key: string) {
    navigator.clipboard.writeText(val).catch(() => {});
    setCopied(key);
    setTimeout(() => setCopied(null), 1800);
  }

  function saveNote() {
    setSaved(true);
    setTimeout(() => setSaved(false), 2200);
  }

  const currentStage = stages.find((s) => s.id === stageId);

  return (
    <div className="fixed inset-0 z-40 flex justify-end">
      <div className="absolute inset-0 bg-black/25" onClick={onClose} />
      <div className="relative w-[440px] h-full bg-white shadow-2xl flex flex-col z-10 overflow-hidden">

        {/* Header */}
        <div className="flex items-start gap-3 px-5 pt-5 pb-4 border-b border-gray-100 flex-shrink-0">
          <div className={cn("w-11 h-11 rounded-full flex items-center justify-center text-white text-base font-bold flex-shrink-0", avatarColors[lead.avatar] ?? "bg-gray-400")}>
            {lead.avatar}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-base font-bold text-[#111827]">{lead.name}</p>
            <div className="flex items-center gap-2 mt-1 flex-wrap">
              <span className={cn("text-[10px] font-medium px-2 py-0.5 rounded-full", channelBadge[lead.channel] ?? "bg-gray-100 text-gray-600")}>{lead.channel}</span>
              <div className="flex items-center gap-0.5">
                {lead.score >= 80 && <Flame size={11} className="text-rose-500" />}
                <span className={cn("text-xs font-bold", lead.score >= 80 ? "text-rose-500" : "text-amber-500")}>{lead.score}/100</span>
              </div>
              <span className="text-xs font-bold text-[#6C3BFF]">{lead.value}</span>
            </div>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-700 transition-colors mt-0.5 flex-shrink-0">
            <X size={18} />
          </button>
        </div>

        {/* Stage mover */}
        <div className="px-5 py-3.5 border-b border-gray-100 bg-gray-50/50 flex-shrink-0">
          <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider mb-2">Mover para etapa</p>
          <div className="flex gap-1.5 flex-wrap">
            {stages.map((s) => (
              <button
                key={s.id}
                onClick={() => onMove(s.id)}
                className={cn(
                  "flex items-center gap-1 text-[10px] font-semibold px-2.5 py-1.5 rounded-lg border transition-all",
                  s.id === stageId
                    ? "text-white border-transparent"
                    : "bg-white text-gray-500 border-gray-200 hover:border-[#6C3BFF] hover:text-[#6C3BFF]"
                )}
                style={s.id === stageId ? { backgroundColor: s.color } : {}}
              >
                <div className={cn("w-1.5 h-1.5 rounded-full flex-shrink-0", s.id === stageId ? "bg-white/70" : s.accent)} />
                {s.shortLabel}
              </button>
            ))}
          </div>
        </div>

        {/* Quick actions */}
        <div className="px-5 py-3 border-b border-gray-100 flex gap-2 flex-shrink-0">
          {[
            { icon: MessageSquare, label: "WhatsApp", cls: "bg-green-100 text-green-700 hover:bg-green-200" },
            { icon: Phone,         label: "Ligar",    cls: "bg-blue-100 text-blue-700 hover:bg-blue-200"   },
            { icon: Calendar,      label: "Agendar",  cls: "bg-purple-100 text-purple-700 hover:bg-purple-200" },
            { icon: Mail,          label: "E-mail",   cls: "bg-gray-100 text-gray-700 hover:bg-gray-200"   },
          ].map((a) => (
            <button key={a.label} className={cn("flex flex-col items-center gap-1 flex-1 py-2.5 rounded-xl text-[10px] font-semibold transition-colors", a.cls)}>
              <a.icon size={15} />
              {a.label}
            </button>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-100 px-5 flex-shrink-0">
          {(["info", "historico", "notas"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={cn(
                "py-3 px-3 text-xs font-semibold border-b-2 -mb-px transition-colors",
                tab === t ? "border-[#6C3BFF] text-[#6C3BFF]" : "border-transparent text-gray-400 hover:text-gray-600"
              )}
            >
              {t === "info" ? "Informações" : t === "historico" ? "Histórico" : "Notas"}
            </button>
          ))}
        </div>

        {/* Tab content */}
        <div className="flex-1 overflow-y-auto p-5">

          {tab === "info" && (
            <div className="space-y-5">
              {/* Contact */}
              <div>
                <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider mb-2">Contato</p>
                <div className="space-y-2">
                  {[
                    { icon: Phone, label: "Telefone", value: lead.phone, key: "phone" },
                    { icon: Mail,  label: "E-mail",   value: lead.email, key: "email" },
                  ].map((c) => (
                    <div key={c.key} className="flex items-center gap-2.5 p-3 bg-gray-50 rounded-xl">
                      <c.icon size={13} className="text-gray-400 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-[10px] text-gray-400">{c.label}</p>
                        <p className="text-xs font-medium text-[#111827] truncate">{c.value}</p>
                      </div>
                      <button onClick={() => copy(c.value, c.key)} className="text-gray-400 hover:text-[#6C3BFF] transition-colors">
                        {copied === c.key ? <Check size={13} className="text-[#10B981]" /> : <Copy size={13} />}
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tags */}
              <div>
                <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider mb-2">Tags</p>
                <div className="flex flex-wrap gap-1.5">
                  {lead.tags.map((t) => (
                    <span key={t} className={cn("text-xs px-2.5 py-1 rounded-lg font-medium", tagColors[t] ?? "bg-gray-100 text-gray-600")}>{t}</span>
                  ))}
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-2.5">
                {[
                  { label: "Valor",         value: lead.value },
                  { label: "Score",         value: `${lead.score}/100` },
                  { label: "Dias na etapa", value: `${lead.days}d` },
                ].map((s) => (
                  <div key={s.label} className="bg-gray-50 rounded-xl p-3 text-center">
                    <p className="text-sm font-bold text-[#111827]">{s.value}</p>
                    <p className="text-[10px] text-gray-400 mt-0.5">{s.label}</p>
                  </div>
                ))}
              </div>

              {/* Etapa atual info */}
              {currentStage && (
                <div className="flex items-center gap-2 p-3 rounded-xl border border-gray-100 bg-gray-50">
                  <div className={cn("w-2.5 h-2.5 rounded-full flex-shrink-0", currentStage.accent)} />
                  <p className="text-xs text-gray-600">Etapa: <span className="font-semibold text-[#111827]">{currentStage.label}</span></p>
                </div>
              )}

              {/* Win / Loss */}
              <div className="space-y-2 pt-1">
                <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider">Gestão</p>
                <button onClick={onRemove} className="w-full flex items-center justify-center gap-2 p-3 rounded-xl bg-[#10B981]/10 text-[#10B981] text-sm font-semibold hover:bg-[#10B981]/20 transition-colors">
                  <Check size={15} /> Marcar como Ganho
                </button>
                <button onClick={onRemove} className="w-full flex items-center justify-center gap-2 p-3 rounded-xl bg-red-50 text-red-500 text-sm font-semibold hover:bg-red-100 transition-colors">
                  <X size={15} /> Marcar como Perdido
                </button>
              </div>
            </div>
          )}

          {tab === "historico" && (
            <div className="space-y-0">
              {lead.history.map((h, i) => (
                <div key={i} className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div className="w-2 h-2 rounded-full bg-[#6C3BFF] mt-1.5 flex-shrink-0" />
                    {i < lead.history.length - 1 && <div className="w-px flex-1 bg-gray-100 my-1 min-h-[16px]" />}
                  </div>
                  <div className="pb-4">
                    <p className="text-xs text-gray-700 leading-snug">{h.text}</p>
                    <p className="text-[10px] text-gray-400 mt-0.5">{h.time}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {tab === "notas" && (
            <div className="space-y-3">
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Adicione uma nota sobre este atendimento..."
                className="w-full h-44 p-3.5 rounded-xl border border-gray-200 text-sm text-gray-700 placeholder-gray-300 resize-none focus:outline-none focus:ring-2 focus:ring-[#6C3BFF]/30 focus:border-[#6C3BFF]"
              />
              <button
                onClick={saveNote}
                className={cn(
                  "w-full py-2.5 rounded-xl text-sm font-semibold transition-colors",
                  saved ? "bg-[#10B981] text-white" : "bg-[#6C3BFF] text-white hover:bg-[#5a2fd6]"
                )}
              >
                {saved ? "Nota salva" : "Salvar Nota"}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── NewLeadModal ─────────────────────────────────────────────────────────────

function NewLeadModal({ stages, onClose, onAdd }: { stages: Stage[]; onClose: () => void; onAdd: (lead: Lead, stageId: string) => void }) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [channel, setChannel] = useState("WhatsApp");
  const [stageId, setStageId] = useState(stages[0].id);
  const [value, setValue] = useState("R$ 0");

  function submit() {
    if (!name.trim()) return;
    const lead: Lead = {
      id: String(Date.now()), name, phone, email, value, channel, score: 50,
      avatar: name[0].toUpperCase(), tags: ["Novo"], days: 0, note: "", history: [{ time: "Agora", text: "Lead criado manualmente" }],
    };
    onAdd(lead, stageId);
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-[440px] p-6">
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-semibold text-[#111827]">Novo Lead</h3>
          <button onClick={onClose}><X size={16} className="text-gray-400" /></button>
        </div>
        <div className="space-y-3">
          {[
            { label: "Nome *", value: name, onChange: setName, placeholder: "Nome completo" },
            { label: "Telefone", value: phone, onChange: setPhone, placeholder: "+55 11 99999-0000" },
            { label: "Email", value: email, onChange: setEmail, placeholder: "email@exemplo.com" },
            { label: "Valor estimado", value, onChange: setValue, placeholder: "R$ 0" },
          ].map((f) => (
            <div key={f.label}>
              <label className="text-xs font-medium text-gray-500 block mb-1">{f.label}</label>
              <input value={f.value} onChange={(e) => f.onChange(e.target.value)} placeholder={f.placeholder} className="w-full px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6C3BFF]/20" />
            </div>
          ))}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-gray-500 block mb-1">Canal</label>
              <select value={channel} onChange={(e) => setChannel(e.target.value)} className="w-full px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none">
                {["WhatsApp","Instagram","TikTok","Email"].map((c) => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs font-medium text-gray-500 block mb-1">Etapa</label>
              <select value={stageId} onChange={(e) => setStageId(e.target.value)} className="w-full px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none">
                {stages.map((s) => <option key={s.id} value={s.id}>{s.shortLabel}</option>)}
              </select>
            </div>
          </div>
          <button onClick={submit} className="w-full py-2.5 bg-[#6C3BFF] text-white text-sm font-medium rounded-lg hover:bg-[#5930e8] transition-colors mt-1">Adicionar Lead</button>
        </div>
      </div>
    </div>
  );
}

// ─── CRMPage ──────────────────────────────────────────────────────────────────

export default function CRMPage() {
  const [stages, setStages] = useState<Stage[]>(initialStages);
  const [dragging, setDragging] = useState<{ leadId: string; fromStageId: string } | null>(null);
  const [dragOver, setDragOver] = useState<string | null>(null);
  const [selected, setSelected] = useState<{ lead: Lead; stageId: string } | null>(null);
  const [showNewLead, setShowNewLead] = useState(false);

  function addLead(lead: Lead, stageId: string) {
    setStages((prev) => prev.map((s) => s.id === stageId ? { ...s, leads: [lead, ...s.leads] } : s));
  }

  function moveLead(leadId: string, fromId: string, toId: string) {
    if (fromId === toId) return;
    setStages((prev) => {
      const fromStage = prev.find((s) => s.id === fromId);
      const lead = fromStage?.leads.find((l) => l.id === leadId);
      if (!lead) return prev;
      return prev.map((s) => {
        if (s.id === fromId) return { ...s, leads: s.leads.filter((l) => l.id !== leadId) };
        if (s.id === toId)   return { ...s, leads: [...s.leads, lead] };
        return s;
      });
    });
    setSelected((prev) => prev?.lead.id === leadId ? { ...prev, stageId: toId } : prev);
  }

  function handleDrop(toId: string) {
    if (dragging) moveLead(dragging.leadId, dragging.fromStageId, toId);
    setDragging(null);
    setDragOver(null);
  }

  function handleDragLeave(stageId: string, e: React.DragEvent) {
    if ((e.currentTarget as HTMLElement).contains(e.relatedTarget as Node)) return;
    if (dragOver === stageId) setDragOver(null);
  }

  const allLeads = stages.flatMap((s) => s.leads);
  const totalValue = allLeads.reduce((acc, l) => {
    const v = parseFloat(l.value.replace("R$", "").replace(/\./g, "").replace(",", ".").trim());
    return acc + (isNaN(v) ? 0 : v);
  }, 0);

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <Topbar
        title="CRM — Pipeline"
        subtitle={`${allLeads.length} clientes · R$ ${totalValue.toLocaleString("pt-BR", { minimumFractionDigits: 0 })} em pipeline`}
        action={{ label: "Novo Lead", onClick: () => setShowNewLead(true) }}
      />

      {showNewLead && <NewLeadModal stages={stages} onClose={() => setShowNewLead(false)} onAdd={addLead} />}

      <div className="flex-1 overflow-x-auto bg-[#F0F2F8] p-5">
        <div className="flex gap-5 h-full min-w-max">
          {stages.map((stage) => {
            const stageTotal = stage.leads.reduce((acc, l) => {
              const v = parseFloat(l.value.replace("R$", "").replace(/\./g, "").replace(",", ".").trim());
              return acc + (isNaN(v) ? 0 : v);
            }, 0);
            const isOver = dragOver === stage.id;

            return (
              <div
                key={stage.id}
                onDragOver={(e) => { e.preventDefault(); setDragOver(stage.id); }}
                onDragLeave={(e) => handleDragLeave(stage.id, e)}
                onDrop={() => handleDrop(stage.id)}
                className={cn(
                  "w-[280px] h-full flex flex-col flex-shrink-0 rounded-2xl transition-all overflow-hidden",
                  isOver
                    ? "ring-2 ring-[#6C3BFF] shadow-xl"
                    : "ring-1 ring-gray-200/80 shadow-sm"
                )}
              >
                {/* Colored accent bar */}
                <div className={cn("h-1.5 w-full flex-shrink-0", stage.accent)} />

                {/* Column header */}
                <div className="bg-white px-4 pt-3 pb-3 flex-shrink-0">
                  <div className="flex items-center gap-2 mb-1">
                    <div className={cn("w-2 h-2 rounded-full flex-shrink-0", stage.accent)} />
                    <span className="text-sm font-bold text-[#111827] flex-1 leading-tight">{stage.label}</span>
                    <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full font-semibold">
                      {stage.leads.length}
                    </span>
                  </div>
                  <p className="text-[10px] text-gray-400 pl-4">
                    R$ {stageTotal.toLocaleString("pt-BR")} em negociação
                  </p>
                </div>

                <div className="h-px bg-gray-100 flex-shrink-0" />

                {/* Cards area */}
                <div className={cn(
                  "flex-1 overflow-y-auto p-3 space-y-2.5 transition-colors",
                  isOver ? "bg-[#6C3BFF]/5" : "bg-[#F5F7FB]"
                )}>
                  {stage.leads.map((lead) => (
                    <LeadCard
                      key={lead.id}
                      lead={lead}
                      accent={stage.accent}
                      onOpen={() => setSelected({ lead, stageId: stage.id })}
                      onDragStart={() => setDragging({ leadId: lead.id, fromStageId: stage.id })}
                      onDragEnd={() => { setDragging(null); setDragOver(null); }}
                    />
                  ))}

                  {isOver && dragging && (
                    <div className="h-16 rounded-xl border-2 border-dashed border-[#6C3BFF]/40 bg-white/60 flex items-center justify-center">
                      <span className="text-xs text-[#6C3BFF] font-medium">Soltar aqui</span>
                    </div>
                  )}

                  <button onClick={() => setShowNewLead(true)} className="w-full py-2.5 flex items-center justify-center gap-1.5 text-gray-400 hover:text-[#6C3BFF] hover:bg-[#6C3BFF]/5 rounded-xl border-2 border-dashed border-gray-200 hover:border-[#6C3BFF]/30 transition-all text-xs font-medium">
                    <Plus size={13} /> Adicionar Lead
                  </button>
                </div>
              </div>
            );
          })}

          {/* Add stage */}
          <div className="w-[260px] flex-shrink-0 self-start">
            <button className="w-full h-12 flex items-center justify-center gap-2 text-gray-400 hover:text-[#6C3BFF] bg-white/60 hover:bg-white rounded-xl border-2 border-dashed border-gray-200 hover:border-[#6C3BFF]/30 transition-all text-sm font-medium">
              <Plus size={16} /> Nova Etapa
            </button>
          </div>
        </div>
      </div>

      {selected && (
        <LeadDrawer
          lead={selected.lead}
          stageId={selected.stageId}
          stages={stages}
          onClose={() => setSelected(null)}
          onMove={(toId) => moveLead(selected.lead.id, selected.stageId, toId)}
          onRemove={() => {
            setStages((prev) => prev.map((s) => s.id === selected.stageId ? { ...s, leads: s.leads.filter((l) => l.id !== selected.lead.id) } : s));
            setSelected(null);
          }}
        />
      )}
    </div>
  );
}
