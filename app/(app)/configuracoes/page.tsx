"use client";

import Topbar from "@/components/Topbar";
import { User, Bell, Shield, Palette, Globe, Users, CreditCard, Check, X, Moon, Sun, Eye, EyeOff } from "lucide-react";
import { useState } from "react";

const tabs = [
  { id: "perfil", label: "Perfil", icon: User },
  { id: "equipe", label: "Equipe", icon: Users },
  { id: "notificacoes", label: "Notificações", icon: Bell },
  { id: "seguranca", label: "Segurança", icon: Shield },
  { id: "aparencia", label: "Aparência", icon: Palette },
  { id: "plano", label: "Plano & Faturamento", icon: CreditCard },
];

const team = [
  { name: "Carla Mendes",  email: "carla@bellamodas.com.br",   role: "Admin",       status: "Ativo",  avatar: "C" },
  { name: "Ana Beatriz",   email: "ana@bellamodas.com.br",     role: "Closer",      status: "Ativo",  avatar: "A" },
  { name: "Juliana Costa", email: "juliana@bellamodas.com.br", role: "SDR",         status: "Ativo",  avatar: "J" },
  { name: "Beatriz Lima",  email: "bia@bellamodas.com.br",     role: "Atendimento", status: "Ativo",  avatar: "B" },
];

const avColors: Record<string, string> = {
  C: "bg-[#6C3BFF]",
  A: "bg-amber-500",
  J: "bg-[#10B981]",
  B: "bg-rose-500",
};

function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${checked ? "bg-[#6C3BFF]" : "bg-gray-200"}`}
    >
      <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform shadow-sm ${checked ? "translate-x-4" : "translate-x-1"}`} />
    </button>
  );
}

export default function ConfiguracoesPage() {
  const [activeTab, setActiveTab] = useState("perfil");
  const [saved, setSaved] = useState(false);
  const [inviteOpen, setInviteOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteSent, setInviteSent] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [compactMode, setCompactMode] = useState(false);
  const [colorBlind, setColorBlind] = useState(false);
  const [notifs, setNotifs] = useState({
    newMessage: true, newLead: true, orderConfirmed: true,
    liveAlert: true, dailySummary: false, weeklyReport: false,
    whatsapp: true, email: false, browser: true,
  });

  function saveProfile() {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  function sendInvite() {
    if (!inviteEmail.trim()) return;
    setInviteSent(true);
    setTimeout(() => { setInviteSent(false); setInviteOpen(false); setInviteEmail(""); }, 2000);
  }

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <Topbar title="Configurações" />

      <div className="flex-1 overflow-hidden flex">
        {/* Sidebar tabs */}
        <div className="w-56 bg-white border-r border-gray-200 p-3 space-y-1 flex-shrink-0">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm transition-colors text-left ${
                activeTab === tab.id ? "bg-[#6C3BFF]/10 text-[#6C3BFF] font-medium" : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              <tab.icon size={15} />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === "perfil" && (
            <div className="max-w-lg space-y-6">
              <h2 className="text-lg font-semibold text-[#111827]">Perfil da Empresa</h2>
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 space-y-4">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-[#6C3BFF] to-[#7B61FF] rounded-xl flex items-center justify-center text-white text-2xl font-bold">
                    B
                  </div>
                  <div>
                    <p className="font-semibold text-[#111827]">Bella Modas</p>
                    <button className="text-xs text-[#6C3BFF] hover:underline">Alterar logo</button>
                  </div>
                </div>
                {[
                  { label: "Nome da Empresa", value: "Bella Modas" },
                  { label: "CNPJ", value: "12.345.678/0001-99" },
                  { label: "Email", value: "contato@bellamodas.com.br" },
                  { label: "Telefone", value: "+55 11 99400-7820" },
                  { label: "Site", value: "www.bellamodas.com.br" },
                ].map((f) => (
                  <div key={f.label}>
                    <label className="text-xs font-medium text-gray-500 block mb-1">{f.label}</label>
                    <input
                      type="text"
                      defaultValue={f.value}
                      className="w-full px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6C3BFF]/20"
                    />
                  </div>
                ))}
                <button onClick={saveProfile} className={`px-5 py-2 text-white text-sm font-medium rounded-lg transition-colors ${saved ? "bg-[#10B981]" : "bg-[#6C3BFF] hover:bg-[#5930e8]"}`}>
                  {saved ? "✓ Salvo!" : "Salvar Alterações"}
                </button>
              </div>
            </div>
          )}

          {activeTab === "equipe" && (
            <div className="max-w-2xl space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-[#111827]">Membros da Equipe</h2>
                <button onClick={() => setInviteOpen(true)} className="px-4 py-2 bg-[#6C3BFF] text-white text-sm font-medium rounded-lg hover:bg-[#5930e8] transition-colors">
                  Convidar Membro
                </button>
              </div>
              {inviteOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center">
                  <div className="absolute inset-0 bg-black/40" onClick={() => setInviteOpen(false)} />
                  <div className="relative bg-white rounded-2xl shadow-2xl w-[400px] p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-semibold text-[#111827]">Convidar Membro</h3>
                      <button onClick={() => setInviteOpen(false)}><X size={16} className="text-gray-400" /></button>
                    </div>
                    <div className="space-y-3">
                      <div>
                        <label className="text-xs font-medium text-gray-500 block mb-1">Email</label>
                        <input type="email" value={inviteEmail} onChange={(e) => setInviteEmail(e.target.value)} placeholder="email@empresa.com.br" className="w-full px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6C3BFF]/20" />
                      </div>
                      <div>
                        <label className="text-xs font-medium text-gray-500 block mb-1">Perfil</label>
                        <select className="w-full px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none">
                          <option>Atendimento</option><option>SDR</option><option>Closer</option><option>Admin</option>
                        </select>
                      </div>
                      <button onClick={sendInvite} className={`w-full py-2 rounded-lg text-sm font-medium transition-colors ${inviteSent ? "bg-[#10B981] text-white" : "bg-[#6C3BFF] text-white hover:bg-[#5930e8]"}`}>
                        {inviteSent ? "✓ Convite enviado!" : "Enviar Convite"}
                      </button>
                    </div>
                  </div>
                </div>
              )}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-100">
                      <th className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wide px-4 py-3">Usuário</th>
                      <th className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wide px-4 py-3">Perfil</th>
                      <th className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wide px-4 py-3">Status</th>
                      <th className="px-4 py-3" />
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {team.map((m) => (
                      <tr key={m.name} className="hover:bg-gray-50 transition-colors">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2.5">
                            <div className={`w-8 h-8 rounded-full ${avColors[m.avatar]} flex items-center justify-center text-white text-xs font-bold`}>
                              {m.avatar}
                            </div>
                            <div>
                              <p className="text-sm font-medium text-[#111827]">{m.name}</p>
                              <p className="text-xs text-gray-400">{m.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <span className="text-xs bg-[#6C3BFF]/10 text-[#6C3BFF] px-2.5 py-1 rounded-full font-medium">{m.role}</span>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${m.status === "Ativo" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                            {m.status}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <button className="text-xs text-gray-400 hover:text-gray-600 transition-colors">Editar</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === "plano" && (
            <div className="max-w-lg space-y-6">
              <h2 className="text-lg font-semibold text-[#111827]">Plano & Faturamento</h2>
              <div className="bg-gradient-to-r from-[#6C3BFF] to-[#7B61FF] rounded-xl p-6 text-white">
                <p className="text-sm font-medium text-white/70 mb-1">Plano Atual</p>
                <p className="text-2xl font-bold">Empresarial</p>
                <p className="text-white/70 text-sm mt-1">5 usuários · Todos os módulos</p>
                <div className="mt-4 pt-4 border-t border-white/20 flex items-center justify-between">
                  <span className="text-white/70 text-sm">Próxima cobrança: 18/06/2026</span>
                  <span className="text-xl font-bold">R$ 497/mês</span>
                </div>
              </div>
            </div>
          )}

          {activeTab === "notificacoes" && (
            <div className="max-w-lg space-y-6">
              <h2 className="text-lg font-semibold text-[#111827]">Notificações</h2>
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 space-y-5">
                <div>
                  <p className="text-sm font-semibold text-gray-700 mb-3">Eventos</p>
                  <div className="space-y-3">
                    {[
                      { key: "newMessage",      label: "Nova mensagem recebida" },
                      { key: "newLead",         label: "Novo lead qualificado" },
                      { key: "orderConfirmed",  label: "Pedido confirmado" },
                      { key: "liveAlert",       label: "Alertas de live ao vivo" },
                      { key: "dailySummary",    label: "Resumo diário (18h)" },
                      { key: "weeklyReport",    label: "Relatório semanal" },
                    ].map(({ key, label }) => (
                      <div key={key} className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">{label}</span>
                        <Toggle checked={notifs[key as keyof typeof notifs]} onChange={(v) => setNotifs((n) => ({ ...n, [key]: v }))} />
                      </div>
                    ))}
                  </div>
                </div>
                <div className="border-t border-gray-100 pt-4">
                  <p className="text-sm font-semibold text-gray-700 mb-3">Canais de notificação</p>
                  <div className="space-y-3">
                    {[
                      { key: "whatsapp", label: "WhatsApp" },
                      { key: "email",   label: "Email" },
                      { key: "browser", label: "Navegador (push)" },
                    ].map(({ key, label }) => (
                      <div key={key} className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">{label}</span>
                        <Toggle checked={notifs[key as keyof typeof notifs]} onChange={(v) => setNotifs((n) => ({ ...n, [key]: v }))} />
                      </div>
                    ))}
                  </div>
                </div>
                <button onClick={saveProfile} className={`px-5 py-2 text-white text-sm font-medium rounded-lg transition-colors ${saved ? "bg-[#10B981]" : "bg-[#6C3BFF] hover:bg-[#5930e8]"}`}>
                  {saved ? "✓ Salvo!" : "Salvar Preferências"}
                </button>
              </div>
            </div>
          )}

          {activeTab === "seguranca" && (
            <div className="max-w-lg space-y-6">
              <h2 className="text-lg font-semibold text-[#111827]">Segurança</h2>
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 space-y-4">
                <p className="text-sm font-semibold text-gray-700">Alterar Senha</p>
                {[
                  { label: "Senha atual", placeholder: "••••••••" },
                  { label: "Nova senha", placeholder: "Mínimo 8 caracteres" },
                  { label: "Confirmar nova senha", placeholder: "Repita a nova senha" },
                ].map((f) => (
                  <div key={f.label}>
                    <label className="text-xs font-medium text-gray-500 block mb-1">{f.label}</label>
                    <div className="relative">
                      <input type={showPass ? "text" : "password"} placeholder={f.placeholder} className="w-full px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6C3BFF]/20" />
                      <button onClick={() => setShowPass((v) => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                        {showPass ? <EyeOff size={14} /> : <Eye size={14} />}
                      </button>
                    </div>
                  </div>
                ))}
                <button onClick={saveProfile} className={`px-5 py-2 text-white text-sm font-medium rounded-lg transition-colors ${saved ? "bg-[#10B981]" : "bg-[#6C3BFF] hover:bg-[#5930e8]"}`}>
                  {saved ? "✓ Senha alterada!" : "Alterar Senha"}
                </button>
              </div>
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 space-y-4">
                <p className="text-sm font-semibold text-gray-700">Autenticação de dois fatores</p>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">2FA via app autenticador</p>
                    <p className="text-xs text-gray-400">Recomendado para maior segurança</p>
                  </div>
                  <Toggle checked={false} onChange={() => {}} />
                </div>
              </div>
            </div>
          )}

          {activeTab === "aparencia" && (
            <div className="max-w-lg space-y-6">
              <h2 className="text-lg font-semibold text-[#111827]">Aparência</h2>
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 space-y-5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {darkMode ? <Moon size={15} className="text-[#6C3BFF]" /> : <Sun size={15} className="text-amber-500" />}
                    <div>
                      <p className="text-sm text-gray-700 font-medium">Modo Escuro</p>
                      <p className="text-xs text-gray-400">Interface com tema escuro</p>
                    </div>
                  </div>
                  <Toggle checked={darkMode} onChange={setDarkMode} />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-700 font-medium">Modo Compacto</p>
                    <p className="text-xs text-gray-400">Reduz espaçamentos da interface</p>
                  </div>
                  <Toggle checked={compactMode} onChange={setCompactMode} />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-700 font-medium">Modo Acessível (daltonismo)</p>
                    <p className="text-xs text-gray-400">Cores de alto contraste</p>
                  </div>
                  <Toggle checked={colorBlind} onChange={setColorBlind} />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-2">Cor de destaque</p>
                  <div className="flex gap-2">
                    {["#6C3BFF","#0ea5e9","#10B981","#f59e0b","#ef4444","#ec4899"].map((c) => (
                      <button key={c} className="w-7 h-7 rounded-full border-2 border-white shadow-sm ring-2 ring-transparent hover:ring-gray-300 transition-all" style={{ backgroundColor: c }} />
                    ))}
                  </div>
                </div>
                <button onClick={saveProfile} className={`px-5 py-2 text-white text-sm font-medium rounded-lg transition-colors ${saved ? "bg-[#10B981]" : "bg-[#6C3BFF] hover:bg-[#5930e8]"}`}>
                  {saved ? "✓ Salvo!" : "Salvar Aparência"}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
