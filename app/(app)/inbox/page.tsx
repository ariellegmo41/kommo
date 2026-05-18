"use client";

import { useState } from "react";
import {
  Search,
  Filter,
  Mic,
  Paperclip,
  Send,
  Smile,
  MoreVertical,
  Phone,
  Tag,
  StickyNote,
  User,
  ChevronRight,
  Star,
  CheckCheck,
  Clock,
  Zap,
  MessageCircle,
  Camera,
  Bot,
} from "lucide-react";
import { cn } from "@/lib/utils";

type Channel = "whatsapp" | "instagram" | "telegram" | "messenger" | "email" | "tiktok";

interface Conversation {
  id: string;
  contact: string;
  avatar: string;
  channel: Channel;
  lastMessage: string;
  time: string;
  unread: number;
  tags: string[];
  status: "open" | "pending" | "resolved";
  assignee?: string;
}

const conversations: Conversation[] = [
  {
    id: "1",
    contact: "Maria Fernanda",
    avatar: "M",
    channel: "whatsapp",
    lastMessage: "Olá! Preciso de informações sobre o plano...",
    time: "agora",
    unread: 3,
    tags: ["VIP", "Interessado"],
    status: "open",
    assignee: "Carla",
  },
  {
    id: "2",
    contact: "João Paulo",
    avatar: "J",
    channel: "instagram",
    lastMessage: "Qual o preço do plano empresarial?",
    time: "2min",
    unread: 1,
    tags: ["Novo"],
    status: "open",
  },
  {
    id: "3",
    contact: "Ana Costa",
    avatar: "A",
    channel: "telegram",
    lastMessage: "Perfeito! Vou fechar agora mesmo.",
    time: "15min",
    unread: 0,
    tags: ["Quente"],
    status: "open",
    assignee: "Bruno",
  },
  {
    id: "4",
    contact: "Carlos Alves",
    avatar: "C",
    channel: "messenger",
    lastMessage: "Preciso de um desconto...",
    time: "1h",
    unread: 0,
    tags: ["Negociação"],
    status: "pending",
  },
  {
    id: "5",
    contact: "Empresa XYZ Ltda",
    avatar: "E",
    channel: "whatsapp",
    lastMessage: "Quando podemos marcar a demo?",
    time: "2h",
    unread: 0,
    tags: ["Lead Quente", "B2B"],
    status: "open",
    assignee: "Diego",
  },
  {
    id: "6",
    contact: "Patricia Sousa",
    avatar: "P",
    channel: "email",
    lastMessage: "Re: Proposta comercial enviada",
    time: "3h",
    unread: 0,
    tags: ["Proposta"],
    status: "pending",
  },
];

const messages = [
  { id: 1, from: "contact", text: "Olá! Preciso de informações sobre o plano empresarial.", time: "09:12", read: true },
  { id: 2, from: "agent", text: "Olá Maria! Tudo bem? Ficamos felizes com seu interesse! 😊\n\nNosso plano empresarial inclui atendimento omnichannel, CRM integrado e IA para qualificação automática.", time: "09:14", read: true },
  { id: 3, from: "contact", text: "Que ótimo! E qual o valor?", time: "09:15", read: true },
  { id: 4, from: "agent", text: "O plano empresarial começa em R$ 497/mês com até 5 usuários. Posso te enviar nossa proposta detalhada?", time: "09:16", read: true },
  { id: 5, from: "contact", text: "Sim, por favor! E tem teste gratuito?", time: "09:18", read: true },
  { id: 6, from: "contact", text: "Olá! Preciso de informações sobre o plano...", time: "09:20", read: false },
];

const channelIcons: Record<Channel, { icon: typeof MessageCircle; color: string; label: string }> = {
  whatsapp: { icon: MessageCircle, color: "text-[#25D366]", label: "WhatsApp" },
  instagram: { icon: Camera, color: "text-[#E1306C]", label: "Instagram" },
  telegram: { icon: MessageCircle, color: "text-[#0088cc]", label: "Telegram" },
  messenger: { icon: MessageCircle, color: "text-[#0099FF]", label: "Messenger" },
  email: { icon: MessageCircle, color: "text-gray-500", label: "Email" },
  tiktok: { icon: MessageCircle, color: "text-[#000000]", label: "TikTok" },
};

const avatarColors: Record<string, string> = {
  M: "bg-[#6C3BFF]",
  J: "bg-[#10B981]",
  A: "bg-amber-500",
  C: "bg-[#7B61FF]",
  E: "bg-blue-500",
  P: "bg-rose-500",
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
};

const filters = ["Todos", "Abertos", "Pendentes", "Resolvidos", "Não lidos"];

export default function InboxPage() {
  const [selected, setSelected] = useState<Conversation>(conversations[0]);
  const [activeFilter, setActiveFilter] = useState("Todos");
  const [message, setMessage] = useState("");
  const [activeTab, setActiveTab] = useState<"info" | "pipeline" | "notas">("info");

  return (
    <div className="flex h-full overflow-hidden">
      {/* Coluna 1 — lista de conversas */}
      <div className="w-[300px] bg-white border-r border-gray-200 flex flex-col flex-shrink-0">
        <div className="p-4 border-b border-gray-100">
          <h2 className="font-semibold text-[#111827] mb-3">Inbox</h2>
          <div className="relative mb-3">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar conversas..."
              className="w-full pl-9 pr-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6C3BFF]/20"
            />
          </div>
          <div className="flex gap-1 overflow-x-auto">
            {filters.map((f) => (
              <button
                key={f}
                onClick={() => setActiveFilter(f)}
                className={cn(
                  "px-2.5 py-1 text-xs rounded-full whitespace-nowrap transition-colors",
                  activeFilter === f
                    ? "bg-[#6C3BFF] text-white"
                    : "text-gray-500 hover:bg-gray-100"
                )}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {conversations.map((conv) => {
            const ch = channelIcons[conv.channel];
            return (
              <div
                key={conv.id}
                onClick={() => setSelected(conv)}
                className={cn(
                  "flex items-start gap-3 p-4 cursor-pointer border-b border-gray-50 hover:bg-gray-50 transition-colors",
                  selected.id === conv.id && "bg-[#6C3BFF]/5 border-l-2 border-l-[#6C3BFF]"
                )}
              >
                <div className={`w-9 h-9 rounded-full ${avatarColors[conv.avatar] || "bg-gray-400"} flex items-center justify-center text-white text-sm font-bold flex-shrink-0 relative`}>
                  {conv.avatar}
                  <span className={`absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-white flex items-center justify-center`}>
                    <ch.icon size={8} className={ch.color} />
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-0.5">
                    <p className="text-sm font-medium text-[#111827] truncate">{conv.contact}</p>
                    <span className="text-[10px] text-gray-400 flex-shrink-0 ml-1">{conv.time}</span>
                  </div>
                  <p className="text-xs text-gray-500 truncate mb-1">{conv.lastMessage}</p>
                  <div className="flex items-center gap-1 flex-wrap">
                    {conv.tags.slice(0, 2).map((tag) => (
                      <span key={tag} className={`text-[10px] px-1.5 py-0.5 rounded-full ${tagColors[tag] || "bg-gray-100 text-gray-600"}`}>
                        {tag}
                      </span>
                    ))}
                    {conv.unread > 0 && (
                      <span className="ml-auto text-[10px] bg-[#6C3BFF] text-white rounded-full w-4 h-4 flex items-center justify-center font-bold">
                        {conv.unread}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Coluna 2 — chat */}
      <div className="flex-1 flex flex-col bg-[#F5F7FB] min-w-0">
        {/* Chat header */}
        <div className="bg-white border-b border-gray-200 px-5 py-3 flex items-center gap-3 flex-shrink-0">
          <div className={`w-9 h-9 rounded-full ${avatarColors[selected.avatar] || "bg-gray-400"} flex items-center justify-center text-white text-sm font-bold`}>
            {selected.avatar}
          </div>
          <div className="flex-1">
            <p className="font-semibold text-[#111827] text-sm">{selected.contact}</p>
            <p className="text-xs text-[#10B981] flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-[#10B981] rounded-full inline-block" />
              Online · {channelIcons[selected.channel].label}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
              <Phone size={16} />
            </button>
            <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
              <Star size={16} />
            </button>
            <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
              <MoreVertical size={16} />
            </button>
          </div>
        </div>

        {/* IA sugestão */}
        <div className="mx-4 mt-3 px-3 py-2 bg-[#6C3BFF]/10 border border-[#6C3BFF]/20 rounded-lg flex items-center gap-2 flex-shrink-0">
          <Bot size={14} className="text-[#6C3BFF]" />
          <p className="text-xs text-[#6C3BFF] flex-1">
            <strong>IA sugere:</strong> &quot;Olá Maria! Temos um teste gratuito de 14 dias. Posso ativar para você agora?&quot;
          </p>
          <button className="text-xs text-[#6C3BFF] font-medium hover:underline flex-shrink-0">Usar</button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={cn("flex", msg.from === "agent" ? "justify-end" : "justify-start")}
            >
              <div
                className={cn(
                  "max-w-[65%] px-3 py-2 rounded-xl text-sm",
                  msg.from === "agent"
                    ? "bg-[#6C3BFF] text-white rounded-br-none"
                    : "bg-white text-gray-700 rounded-bl-none shadow-sm"
                )}
              >
                <p className="whitespace-pre-line">{msg.text}</p>
                <div className={cn("flex items-center justify-end gap-1 mt-1", msg.from === "agent" ? "text-white/60" : "text-gray-400")}>
                  <span className="text-[10px]">{msg.time}</span>
                  {msg.from === "agent" && (
                    <CheckCheck size={10} className={msg.read ? "text-white" : "text-white/40"} />
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Input */}
        <div className="bg-white border-t border-gray-200 p-4 flex-shrink-0">
          <div className="flex items-end gap-2">
            <div className="flex-1 flex items-end gap-2 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2">
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Digite sua mensagem..."
                rows={1}
                className="flex-1 bg-transparent text-sm text-gray-700 resize-none focus:outline-none min-h-[20px] max-h-24"
              />
              <div className="flex items-center gap-1.5 flex-shrink-0">
                <button className="text-gray-400 hover:text-gray-600 transition-colors"><Smile size={18} /></button>
                <button className="text-gray-400 hover:text-gray-600 transition-colors"><Paperclip size={18} /></button>
                <button className="text-gray-400 hover:text-gray-600 transition-colors"><Mic size={18} /></button>
              </div>
            </div>
            <button className="w-10 h-10 bg-[#6C3BFF] rounded-xl flex items-center justify-center text-white hover:bg-[#5930e8] transition-colors flex-shrink-0">
              <Send size={16} />
            </button>
          </div>
          <div className="flex items-center gap-3 mt-2">
            <button className="text-xs text-gray-400 hover:text-[#6C3BFF] transition-colors flex items-center gap-1">
              <Zap size={12} /> Respostas rápidas
            </button>
            <button className="text-xs text-gray-400 hover:text-[#6C3BFF] transition-colors flex items-center gap-1">
              <StickyNote size={12} /> Nota interna
            </button>
          </div>
        </div>
      </div>

      {/* Coluna 3 — info do lead */}
      <div className="w-[280px] bg-white border-l border-gray-200 flex flex-col flex-shrink-0 overflow-y-auto">
        <div className="p-4 border-b border-gray-100">
          <div className="flex items-center gap-3 mb-4">
            <div className={`w-12 h-12 rounded-full ${avatarColors[selected.avatar] || "bg-gray-400"} flex items-center justify-center text-white text-lg font-bold`}>
              {selected.avatar}
            </div>
            <div>
              <p className="font-semibold text-[#111827]">{selected.contact}</p>
              <p className="text-xs text-gray-400">Lead · Score: 87</p>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 bg-gray-100 rounded-lg p-1">
            {(["info", "pipeline", "notas"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={cn(
                  "flex-1 text-xs py-1.5 rounded-md capitalize font-medium transition-colors",
                  activeTab === tab ? "bg-white text-[#6C3BFF] shadow-sm" : "text-gray-500"
                )}
              >
                {tab === "info" ? "Info" : tab === "pipeline" ? "Pipeline" : "Notas"}
              </button>
            ))}
          </div>
        </div>

        {activeTab === "info" && (
          <div className="p-4 space-y-4">
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Contato</p>
              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-gray-500">WhatsApp</span>
                  <span className="text-[#111827] font-medium">+55 11 9xxxx-xxxx</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-500">Email</span>
                  <span className="text-[#111827] font-medium">maria@email.com</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-500">Canal</span>
                  <span className="text-[#111827] font-medium">{channelIcons[selected.channel].label}</span>
                </div>
              </div>
            </div>

            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Etiquetas</p>
              <div className="flex flex-wrap gap-1">
                {selected.tags.map((tag) => (
                  <span key={tag} className={`text-xs px-2 py-0.5 rounded-full ${tagColors[tag] || "bg-gray-100 text-gray-600"}`}>
                    {tag}
                  </span>
                ))}
                <button className="text-xs px-2 py-0.5 rounded-full border border-dashed border-gray-300 text-gray-400 hover:border-[#6C3BFF] hover:text-[#6C3BFF] transition-colors">
                  + Tag
                </button>
              </div>
            </div>

            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Responsável</p>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-[#6C3BFF] flex items-center justify-center text-white text-xs font-bold">
                  {selected.assignee ? selected.assignee[0] : "?"}
                </div>
                <span className="text-sm text-[#111827]">{selected.assignee || "Não atribuído"}</span>
              </div>
            </div>

            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Score do Lead</p>
              <div className="flex items-center gap-2">
                <div className="flex-1 bg-gray-100 rounded-full h-2">
                  <div className="h-2 rounded-full bg-[#10B981]" style={{ width: "87%" }} />
                </div>
                <span className="text-sm font-bold text-[#10B981]">87</span>
              </div>
            </div>

            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Resumo da IA</p>
              <div className="bg-[#6C3BFF]/5 rounded-lg p-3">
                <p className="text-xs text-gray-600 leading-relaxed">
                  Contato com alto interesse no plano empresarial. Solicitou informações sobre preço e teste gratuito. Perfil: decisor, empresa de médio porte.
                </p>
              </div>
            </div>
          </div>
        )}

        {activeTab === "pipeline" && (
          <div className="p-4 space-y-3">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Etapa Atual</p>
            {["Novo Lead", "Qualificando", "Proposta", "Negociação", "Fechado"].map((stage, i) => (
              <div key={stage} className="flex items-center gap-2">
                <div className={cn(
                  "w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 text-xs font-bold",
                  i <= 1 ? "border-[#6C3BFF] bg-[#6C3BFF] text-white" : "border-gray-200 text-gray-400"
                )}>
                  {i <= 1 ? "✓" : i + 1}
                </div>
                <span className={cn("text-sm", i <= 1 ? "text-[#111827] font-medium" : "text-gray-400")}>{stage}</span>
              </div>
            ))}
            <button className="w-full mt-3 py-2 border border-[#6C3BFF] text-[#6C3BFF] rounded-lg text-sm font-medium hover:bg-[#6C3BFF]/5 transition-colors">
              Avançar Etapa <ChevronRight size={14} className="inline" />
            </button>
          </div>
        )}

        {activeTab === "notas" && (
          <div className="p-4">
            <textarea
              rows={5}
              placeholder="Adicionar nota interna..."
              className="w-full text-sm bg-gray-50 border border-gray-200 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-[#6C3BFF]/20 resize-none"
            />
            <button className="mt-2 w-full py-2 bg-[#6C3BFF] text-white rounded-lg text-sm font-medium hover:bg-[#5930e8] transition-colors">
              Salvar Nota
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
