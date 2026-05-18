"use client";

import Topbar from "@/components/Topbar";
import { User, Bell, Shield, Palette, Globe, Users, CreditCard } from "lucide-react";
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

export default function ConfiguracoesPage() {
  const [activeTab, setActiveTab] = useState("perfil");

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
                <button className="px-5 py-2 bg-[#6C3BFF] text-white text-sm font-medium rounded-lg hover:bg-[#5930e8] transition-colors">
                  Salvar Alterações
                </button>
              </div>
            </div>
          )}

          {activeTab === "equipe" && (
            <div className="max-w-2xl space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-[#111827]">Membros da Equipe</h2>
                <button className="px-4 py-2 bg-[#6C3BFF] text-white text-sm font-medium rounded-lg hover:bg-[#5930e8] transition-colors">
                  Convidar Membro
                </button>
              </div>
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

          {(activeTab === "notificacoes" || activeTab === "seguranca" || activeTab === "aparencia") && (
            <div className="max-w-lg">
              <h2 className="text-lg font-semibold text-[#111827] mb-6 capitalize">{tabs.find(t => t.id === activeTab)?.label}</h2>
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <p className="text-sm text-gray-400">Em breve...</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
