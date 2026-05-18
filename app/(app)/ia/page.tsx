"use client";

import Topbar from "@/components/Topbar";
import { useState, useRef } from "react";
import {
  Bot, Sparkles, MessageSquare, Target, Calendar, Pencil,
  BookOpen, ShoppingBag, TrendingUp, Settings, Send, Upload,
  FileText, Trash2, Plus, Brain, Activity, BarChart2, ChevronDown,
} from "lucide-react";
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer,
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
} from "recharts";
import { cn } from "@/lib/utils";

/* ── tabs ── */
const tabs = ["Playground", "Base de Conhecimento", "Treinamento", "Métricas"] as const;
type Tab = typeof tabs[number];

/* ── modules ── */
const features = [
  { icon: MessageSquare, label: "Atendimento Automático", desc: "Responde leads 24/7 com IA conversacional", active: true, color: "bg-blue-100 text-blue-600" },
  { icon: Target,        label: "Qualificação de Leads",   desc: "Classifica e pontua leads pelas respostas", active: true, color: "bg-purple-100 text-purple-600" },
  { icon: Calendar,      label: "Agendamento Inteligente", desc: "Agenda reuniões automaticamente",           active: false, color: "bg-amber-100 text-amber-600" },
  { icon: Sparkles,      label: "Sugestão de Resposta",    desc: "Sugere respostas em tempo real",           active: true, color: "bg-[#6C3BFF]/10 text-[#6C3BFF]" },
  { icon: Pencil,        label: "Correção Gramatical",     desc: "Corrige antes de enviar",                  active: true, color: "bg-green-100 text-green-600" },
  { icon: BookOpen,      label: "Resumo Inteligente",      desc: "Resume conversas longas",                  active: true, color: "bg-teal-100 text-teal-600" },
  { icon: ShoppingBag,   label: "Recomendação de Produtos",desc: "Sugere produtos pelo perfil do lead",      active: false, color: "bg-rose-100 text-rose-600" },
  { icon: TrendingUp,    label: "IA Comercial",            desc: "Analisa probabilidade de fechamento",      active: true, color: "bg-orange-100 text-orange-600" },
];

/* ── knowledge base docs ── */
const initialDocs = [
  { id: "1", name: "Tabela de Preços 2026.pdf",   size: "240 KB", chunks: 48,  status: "indexado" },
  { id: "2", name: "FAQ Clientes.docx",           size: "88 KB",  chunks: 112, status: "indexado" },
  { id: "3", name: "Script de Vendas.txt",        size: "32 KB",  chunks: 29,  status: "indexado" },
  { id: "4", name: "Catálogo de Produtos 2026.pdf",size: "1.2 MB", chunks: 0,  status: "indexando" },
];

/* ── training history ── */
const trainingData = [
  { epoch: "v1.0", accuracy: 72, precision: 68, recall: 74 },
  { epoch: "v1.1", accuracy: 78, precision: 75, recall: 79 },
  { epoch: "v1.2", accuracy: 83, precision: 80, recall: 84 },
  { epoch: "v1.3", accuracy: 87, precision: 86, recall: 88 },
  { epoch: "v2.0", accuracy: 91, precision: 89, recall: 92 },
  { epoch: "v2.1", accuracy: 94, precision: 93, recall: 95 },
];

/* ── radar ── */
const radarData = [
  { subject: "Precisão",     score: 94 },
  { subject: "Recall",       score: 92 },
  { subject: "Empatia",      score: 88 },
  { subject: "Velocidade",   score: 97 },
  { subject: "Qualificação", score: 85 },
  { subject: "Conversão",    score: 79 },
];

/* ── playground chat ── */
const initMessages = [
  { from: "user", text: "Olá! Quero saber mais sobre os planos disponíveis." },
  { from: "ia",   text: "Olá! Ficamos felizes com seu interesse. Temos 3 planos: **Starter** (R$ 197/mês — 1 usuário), **Pro** (R$ 397/mês — 3 usuários) e **Empresarial** (R$ 797/mês — usuários ilimitados). Qual se encaixa melhor na sua operação?" },
  { from: "user", text: "Tenho uma equipe de 8 pessoas. Qual você recomenda?" },
  { from: "ia",   text: "Para 8 pessoas, o **Plano Empresarial** é a melhor escolha! ✅ Você terá usuários ilimitados, WhatsApp API, automações avançadas e suporte prioritário. Quer que eu agende uma demo personalizada?" },
];

/* ── sentiment sample ── */
const sentiments = [
  { text: "Gostei muito do atendimento!", sentiment: "Positivo", score: 0.92, color: "text-green-600 bg-green-50" },
  { text: "Preciso de um desconto maior.", sentiment: "Neutro",   score: 0.61, color: "text-amber-600 bg-amber-50" },
  { text: "Estou insatisfeito com o prazo.", sentiment: "Negativo", score: 0.15, color: "text-rose-600 bg-rose-50" },
  { text: "Perfeito! Quero fechar agora.",  sentiment: "Positivo", score: 0.97, color: "text-green-600 bg-green-50" },
];

export default function IAPage() {
  const [tab, setTab]       = useState<Tab>("Playground");
  const [modules, setModules] = useState(features);
  const [docs, setDocs]     = useState(initialDocs);
  const [messages, setMessages] = useState(initMessages);
  const [input, setInput]   = useState("");
  const [model, setModel]   = useState("GPT-4o");
  const fileRef             = useRef<HTMLInputElement>(null);

  function toggleModule(label: string) {
    setModules((p) => p.map((m) => m.label === label ? { ...m, active: !m.active } : m));
  }

  function sendMessage() {
    if (!input.trim()) return;
    const userMsg = { from: "user", text: input };
    setMessages((p) => [...p, userMsg]);
    setInput("");
    setTimeout(() => {
      setMessages((p) => [...p, {
        from: "ia",
        text: "Ótima pergunta! Com base na nossa base de conhecimento, posso te dizer que temos opções personalizadas para esse cenário. Quer que eu conecte você com um especialista?",
      }]);
    }, 800);
  }

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <Topbar title="IA Avançada" subtitle="Motor de inteligência artificial do IDEA Atende" />

      {/* Tabs */}
      <div className="bg-white border-b border-gray-200 px-6 flex gap-1 flex-shrink-0">
        {tabs.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={cn(
              "px-4 py-3 text-sm font-medium border-b-2 transition-colors",
              tab === t ? "border-[#6C3BFF] text-[#6C3BFF]" : "border-transparent text-gray-500 hover:text-gray-700"
            )}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto p-6">

        {/* ── PLAYGROUND ── */}
        {tab === "Playground" && (
          <div className="grid grid-cols-3 gap-6 h-full">
            {/* Chat */}
            <div className="col-span-2 flex flex-col bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden" style={{ height: "calc(100vh - 210px)" }}>
              <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#6C3BFF] to-[#7B61FF] flex items-center justify-center">
                    <Bot size={15} className="text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[#111827]">Playground — IDEA IA</p>
                    <p className="text-xs text-[#10B981]">● Simulando atendimento real</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-xs bg-gray-50 border border-gray-200 rounded-lg px-3 py-1.5">
                  <Brain size={12} className="text-[#6C3BFF]" />
                  <span className="text-gray-600 font-medium">{model}</span>
                  <ChevronDown size={11} className="text-gray-400" />
                </div>
              </div>

              <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
                {messages.map((m, i) => (
                  <div key={i} className={cn("flex", m.from === "user" ? "justify-end" : "justify-start")}>
                    {m.from === "ia" && (
                      <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#6C3BFF] to-[#7B61FF] flex items-center justify-center flex-shrink-0 mr-2 mt-0.5">
                        <Bot size={13} className="text-white" />
                      </div>
                    )}
                    <div className={cn(
                      "max-w-[70%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed",
                      m.from === "user"
                        ? "bg-[#6C3BFF] text-white rounded-br-sm"
                        : "bg-gray-100 text-gray-700 rounded-bl-sm"
                    )}>
                      {m.text}
                    </div>
                  </div>
                ))}
              </div>

              <div className="px-4 py-3 border-t border-gray-100 flex gap-2">
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                  placeholder="Digite uma mensagem para testar a IA..."
                  className="flex-1 px-4 py-2 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#6C3BFF]/20"
                />
                <button onClick={sendMessage} className="px-4 py-2 bg-[#6C3BFF] text-white rounded-xl hover:bg-[#5930e8] transition-colors">
                  <Send size={15} />
                </button>
              </div>
            </div>

            {/* Right panel */}
            <div className="space-y-4">
              {/* Model config */}
              <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
                <p className="text-sm font-semibold text-[#111827] mb-3">Configurações do Modelo</p>
                {[
                  { label: "Modelo", options: ["GPT-4o", "Claude Sonnet 4.6", "Gemini 1.5 Pro"], current: model, set: setModel },
                ].map((cfg) => (
                  <div key={cfg.label} className="mb-3">
                    <label className="text-xs text-gray-500 block mb-1">{cfg.label}</label>
                    <select
                      value={cfg.current}
                      onChange={(e) => cfg.set(e.target.value)}
                      className="w-full px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6C3BFF]/20"
                    >
                      {cfg.options.map((o) => <option key={o}>{o}</option>)}
                    </select>
                  </div>
                ))}
                <div className="mb-3">
                  <label className="text-xs text-gray-500 block mb-1">Temperatura <span className="font-bold text-[#111827]">0.7</span></label>
                  <input type="range" min="0" max="1" step="0.1" defaultValue="0.7" className="w-full accent-[#6C3BFF]" />
                </div>
                <div>
                  <label className="text-xs text-gray-500 block mb-1">Personalidade</label>
                  <select className="w-full px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none">
                    <option>Profissional e amigável</option>
                    <option>Formal</option>
                    <option>Descontraído</option>
                    <option>Consultivo</option>
                  </select>
                </div>
              </div>

              {/* Sentiment */}
              <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
                <p className="text-sm font-semibold text-[#111827] mb-3">Análise de Sentimento</p>
                <div className="space-y-2">
                  {sentiments.map((s, i) => (
                    <div key={i} className="p-2.5 bg-gray-50 rounded-xl">
                      <p className="text-xs text-gray-600 mb-1.5 truncate">&ldquo;{s.text}&rdquo;</p>
                      <div className="flex items-center justify-between">
                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${s.color}`}>{s.sentiment}</span>
                        <div className="flex items-center gap-1.5">
                          <div className="w-16 bg-gray-200 rounded-full h-1.5">
                            <div className="h-1.5 rounded-full bg-[#6C3BFF]" style={{ width: `${s.score * 100}%` }} />
                          </div>
                          <span className="text-[10px] text-gray-500">{(s.score * 100).toFixed(0)}%</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── BASE DE CONHECIMENTO ── */}
        {tab === "Base de Conhecimento" && (
          <div className="grid grid-cols-3 gap-6">
            <div className="col-span-2 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-[#111827]">Documentos indexados</h3>
                <button
                  onClick={() => fileRef.current?.click()}
                  className="flex items-center gap-1.5 px-4 py-2 bg-[#6C3BFF] text-white text-sm font-medium rounded-xl hover:bg-[#5930e8] transition-colors"
                >
                  <Upload size={14} /> Upload documento
                </button>
                <input ref={fileRef} type="file" className="hidden" multiple accept=".pdf,.docx,.txt,.csv" />
              </div>

              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-100">
                      {["Documento", "Tamanho", "Chunks", "Status", ""].map((h) => (
                        <th key={h} className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wide px-4 py-3">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {docs.map((doc) => (
                      <tr key={doc.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 bg-[#6C3BFF]/10 rounded-lg flex items-center justify-center">
                              <FileText size={14} className="text-[#6C3BFF]" />
                            </div>
                            <span className="text-sm font-medium text-[#111827]">{doc.name}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-500">{doc.size}</td>
                        <td className="px-4 py-3 text-sm text-gray-600">{doc.chunks > 0 ? doc.chunks : "—"}</td>
                        <td className="px-4 py-3">
                          {doc.status === "indexado" ? (
                            <span className="text-xs bg-green-100 text-green-700 px-2.5 py-1 rounded-full font-medium">✓ Indexado</span>
                          ) : (
                            <span className="text-xs bg-amber-100 text-amber-700 px-2.5 py-1 rounded-full font-medium animate-pulse">⟳ Indexando…</span>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          <button onClick={() => setDocs((p) => p.filter((d) => d.id !== doc.id))} className="text-gray-300 hover:text-rose-500 transition-colors">
                            <Trash2 size={14} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Drop zone */}
              <button
                onClick={() => fileRef.current?.click()}
                className="w-full py-8 flex flex-col items-center gap-2 bg-white rounded-2xl border-2 border-dashed border-gray-200 hover:border-[#6C3BFF]/40 hover:bg-[#6C3BFF]/5 transition-all group"
              >
                <Upload size={24} className="text-gray-300 group-hover:text-[#6C3BFF] transition-colors" />
                <p className="text-sm text-gray-400 group-hover:text-[#6C3BFF]">Arraste arquivos ou clique para fazer upload</p>
                <p className="text-xs text-gray-300">PDF, DOCX, TXT, CSV — até 50 MB</p>
              </button>
            </div>

            {/* Stats */}
            <div className="space-y-4">
              <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                <p className="text-sm font-semibold text-[#111827] mb-4">Estatísticas da Base</p>
                <div className="space-y-3">
                  {[
                    { label: "Documentos",  value: docs.length.toString() },
                    { label: "Chunks totais", value: docs.reduce((a, d) => a + d.chunks, 0).toString() },
                    { label: "Tamanho total", value: "1,56 MB" },
                    { label: "Última atualiz.", value: "Hoje 14:30" },
                  ].map((s) => (
                    <div key={s.label} className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">{s.label}</span>
                      <span className="text-sm font-bold text-[#111827]">{s.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                <p className="text-sm font-semibold text-[#111827] mb-3">Módulos ativos</p>
                <div className="space-y-2">
                  {modules.slice(0, 5).map((m) => (
                    <div key={m.label} className="flex items-center justify-between">
                      <span className="text-xs text-gray-600 truncate flex-1">{m.label}</span>
                      <button
                        onClick={() => toggleModule(m.label)}
                        className={cn("w-9 h-5 rounded-full transition-colors relative flex-shrink-0 ml-2", m.active ? "bg-[#6C3BFF]" : "bg-gray-200")}
                      >
                        <span className={cn("absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform", m.active ? "translate-x-4" : "translate-x-0.5")} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── TREINAMENTO ── */}
        {tab === "Treinamento" && (
          <div className="grid grid-cols-3 gap-6">
            <div className="col-span-2 space-y-4">
              <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                <div className="flex items-center justify-between mb-5">
                  <div>
                    <h3 className="font-semibold text-[#111827]">Histórico de treinamento</h3>
                    <p className="text-xs text-gray-400 mt-0.5">Acurácia por versão do modelo</p>
                  </div>
                  <button className="flex items-center gap-1.5 px-4 py-2 bg-[#6C3BFF] text-white text-sm font-medium rounded-xl hover:bg-[#5930e8] transition-colors">
                    <Brain size={14} /> Novo treinamento
                  </button>
                </div>
                <ResponsiveContainer width="100%" height={220}>
                  <LineChart data={trainingData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="epoch" tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
                    <YAxis domain={[60, 100]} tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} tickFormatter={(v) => `${v}%`} />
                    <Tooltip formatter={(v) => `${v}%`} contentStyle={{ fontSize: 11, borderRadius: 8, border: "1px solid #e5e7eb" }} />
                    <Line type="monotone" dataKey="accuracy"  name="Acurácia"  stroke="#6C3BFF" strokeWidth={2.5} dot={{ fill: "#6C3BFF", r: 4 }} />
                    <Line type="monotone" dataKey="precision" name="Precisão"  stroke="#10B981" strokeWidth={2} dot={{ fill: "#10B981", r: 3 }} strokeDasharray="4 2" />
                    <Line type="monotone" dataKey="recall"    name="Recall"    stroke="#f59e0b" strokeWidth={2} dot={{ fill: "#f59e0b", r: 3 }} strokeDasharray="4 2" />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {/* Fine-tuning jobs */}
              <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                <h3 className="font-semibold text-[#111827] mb-4">Jobs de treinamento</h3>
                <div className="space-y-3">
                  {[
                    { name: "fine-tune-v2.1", status: "concluído", time: "14 min", accuracy: "94%", date: "Hoje 12:00" },
                    { name: "fine-tune-v2.0", status: "concluído", time: "18 min", accuracy: "91%", date: "Ontem 09:30" },
                    { name: "fine-tune-v1.3", status: "concluído", time: "11 min", accuracy: "87%", date: "15/05/2026" },
                  ].map((job) => (
                    <div key={job.name} className="flex items-center gap-4 p-3 bg-gray-50 rounded-xl">
                      <div className="w-8 h-8 bg-[#10B981]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Brain size={15} className="text-[#10B981]" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-[#111827]">{job.name}</p>
                        <p className="text-xs text-gray-400">{job.date} · {job.time}</p>
                      </div>
                      <span className="text-xs bg-green-100 text-green-700 px-2.5 py-1 rounded-full font-medium">{job.accuracy}</span>
                      <span className="text-xs text-gray-400">{job.status}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Config */}
            <div className="space-y-4">
              <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                <p className="text-sm font-semibold text-[#111827] mb-4">Configurar treinamento</p>
                <div className="space-y-3">
                  {[
                    { label: "Modelo base", type: "select", options: ["GPT-4o-mini", "GPT-4o", "Claude Haiku 4.5"] },
                    { label: "Épocas", type: "number", default: "3" },
                    { label: "Learning rate", type: "select", options: ["0.0001", "0.001", "0.01"] },
                  ].map((f) => (
                    <div key={f.label}>
                      <label className="text-xs text-gray-500 block mb-1">{f.label}</label>
                      {f.type === "select" ? (
                        <select className="w-full px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6C3BFF]/20">
                          {f.options?.map((o) => <option key={o}>{o}</option>)}
                        </select>
                      ) : (
                        <input type="number" defaultValue={f.default} className="w-full px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6C3BFF]/20" />
                      )}
                    </div>
                  ))}
                </div>
                <button className="mt-4 w-full py-2.5 bg-[#6C3BFF] text-white text-sm font-medium rounded-xl hover:bg-[#5930e8] transition-colors">
                  Iniciar treinamento
                </button>
              </div>

              <div className="bg-gradient-to-br from-[#6C3BFF] to-[#7B61FF] rounded-2xl p-5 text-white">
                <Brain size={24} className="mb-3 text-white/80" />
                <p className="font-semibold text-base mb-1">Modelo atual: v2.1</p>
                <p className="text-white/70 text-xs mb-3">Treinado com 3.200 conversas reais</p>
                <div className="space-y-2">
                  {[["Acurácia", "94%"], ["Precisão", "93%"], ["Recall", "95%"]].map(([k, v]) => (
                    <div key={k} className="flex justify-between text-sm">
                      <span className="text-white/70">{k}</span>
                      <span className="font-bold">{v}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── MÉTRICAS ── */}
        {tab === "Métricas" && (
          <div className="space-y-6">
            <div className="grid grid-cols-4 gap-4">
              {[
                { label: "Atendimentos pela IA", value: "3.421", icon: Bot,      color: "text-[#6C3BFF]" },
                { label: "Taxa de resolução",    value: "94%",   icon: Target,   color: "text-[#10B981]" },
                { label: "Leads qualificados",   value: "1.230", icon: Activity, color: "text-amber-500" },
                { label: "Horas economizadas",   value: "248h",  icon: BarChart2,color: "text-blue-500"  },
              ].map((s) => (
                <div key={s.label} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                  <s.icon size={20} className={`${s.color} mb-3`} />
                  <p className="text-2xl font-bold text-[#111827]">{s.value}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{s.label}</p>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-6">
              {/* Radar */}
              <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                <h3 className="font-semibold text-[#111827] mb-4">Perfil de Competências da IA</h3>
                <ResponsiveContainer width="100%" height={260}>
                  <RadarChart data={radarData}>
                    <PolarGrid stroke="#f0f0f0" />
                    <PolarAngleAxis dataKey="subject" tick={{ fontSize: 11, fill: "#9ca3af" }} />
                    <Radar name="IA" dataKey="score" stroke="#6C3BFF" fill="#6C3BFF" fillOpacity={0.2} strokeWidth={2} />
                  </RadarChart>
                </ResponsiveContainer>
              </div>

              {/* Modules */}
              <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                <h3 className="font-semibold text-[#111827] mb-4">Módulos de IA</h3>
                <div className="space-y-3">
                  {modules.map((m) => (
                    <div key={m.label} className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-xl ${m.color} flex items-center justify-center flex-shrink-0`}>
                        <m.icon size={14} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-[#111827] truncate">{m.label}</p>
                      </div>
                      <button
                        onClick={() => toggleModule(m.label)}
                        className={cn("w-10 h-5 rounded-full transition-colors relative flex-shrink-0", m.active ? "bg-[#6C3BFF]" : "bg-gray-200")}
                      >
                        <span className={cn("absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform", m.active ? "translate-x-5" : "translate-x-0.5")} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
