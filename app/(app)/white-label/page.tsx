"use client";

import Topbar from "@/components/Topbar";
import { useState } from "react";
import {
  Palette, Globe, Upload, Check, Sparkles, MessageSquare, LayoutDashboard,
  Users, Kanban, MoreHorizontal, Eye, Copy, ExternalLink, Crown,
} from "lucide-react";
import { cn } from "@/lib/utils";

const tabs = ["Identidade Visual", "Domínio & URL", "Revendedores", "Preview"] as const;
type Tab = typeof tabs[number];

const resellers = [
  { id: "1", name: "Agência Alfa",     domain: "alfa.ideaatende.com",   clients: 14, revenue: "R$ 8.680", status: "Ativo"    },
  { id: "2", name: "TechVendas",       domain: "tech.ideaatende.com",   clients: 8,  revenue: "R$ 4.920", status: "Ativo"    },
  { id: "3", name: "CRM Solutions",    domain: "crm.ideaatende.com",    clients: 22, revenue: "R$13.640", status: "Ativo"    },
  { id: "4", name: "DataFlow Agency",  domain: "df.ideaatende.com",     clients: 3,  revenue: "R$ 1.840", status: "Pendente" },
];

const plans = [
  { name: "Starter Reseller",    price: "R$ 197/mês",  clients: 5,   commission: "20%" },
  { name: "Pro Reseller",        price: "R$ 497/mês",  clients: 25,  commission: "25%" },
  { name: "Enterprise Reseller", price: "R$ 997/mês",  clients: 100, commission: "30%" },
];

function ColorSwatch({ label, color, onChange }: { label: string; color: string; onChange?: (c: string) => void }) {
  return (
    <div className="flex items-center justify-between py-2">
      <span className="text-sm text-gray-600">{label}</span>
      <div className="flex items-center gap-2">
        <span className="text-xs text-gray-400 font-mono">{color}</span>
        <label className="w-8 h-8 rounded-lg border-2 border-gray-200 cursor-pointer overflow-hidden flex-shrink-0" style={{ backgroundColor: color }}>
          <input type="color" defaultValue={color} onChange={(e) => onChange?.(e.target.value)} className="opacity-0 w-full h-full cursor-pointer" />
        </label>
      </div>
    </div>
  );
}

/* Mini preview of the branded sidebar */
function BrandPreview({ primary, name, logo }: { primary: string; name: string; logo: string }) {
  const sideItems = ["Dashboard", "Inbox", "CRM", "IA", "Analytics"];
  return (
    <div className="rounded-2xl overflow-hidden shadow-xl border border-gray-200 bg-white" style={{ width: 360, height: 420 }}>
      {/* Fake browser bar */}
      <div className="h-8 bg-gray-100 border-b border-gray-200 flex items-center px-3 gap-1.5">
        <div className="w-2.5 h-2.5 rounded-full bg-rose-400" />
        <div className="w-2.5 h-2.5 rounded-full bg-amber-400" />
        <div className="w-2.5 h-2.5 rounded-full bg-green-400" />
        <div className="flex-1 mx-3 bg-white rounded text-[10px] text-gray-400 px-2 py-0.5 border border-gray-200 truncate">
          minha-empresa.ideaatende.com
        </div>
      </div>
      {/* App */}
      <div className="flex h-[calc(100%-32px)]">
        {/* Sidebar */}
        <div className="w-36 flex flex-col flex-shrink-0" style={{ backgroundColor: "#111827" }}>
          <div className="px-3 py-3 border-b border-white/10 flex items-center gap-1.5">
            <div className="w-5 h-5 rounded flex items-center justify-center text-white text-[8px] font-bold" style={{ backgroundColor: primary }}>
              {logo || "A"}
            </div>
            <span className="text-white text-[10px] font-bold truncate">{name || "Minha Marca"}</span>
          </div>
          <div className="flex-1 px-2 py-2 space-y-0.5">
            {sideItems.map((item, i) => (
              <div key={item} className={`flex items-center gap-1.5 px-2 py-1.5 rounded-lg ${i === 0 ? "text-white" : "text-white/50"}`}
                style={i === 0 ? { backgroundColor: primary } : {}}>
                <div className="w-2.5 h-2.5 rounded-sm bg-current opacity-60" />
                <span className="text-[9px]">{item}</span>
              </div>
            ))}
          </div>
        </div>
        {/* Content */}
        <div className="flex-1 bg-[#F5F7FB] p-3">
          <div className="grid grid-cols-2 gap-2 mb-2">
            {["248 Conversas", "1.432 Leads", "24,6% Conv.", "R$ 87k"].map((kpi) => (
              <div key={kpi} className="bg-white rounded-lg p-2 shadow-sm">
                <p className="text-[8px] text-gray-500">{kpi.split(" ").slice(1).join(" ")}</p>
                <p className="text-[11px] font-bold text-[#111827]">{kpi.split(" ")[0]}</p>
              </div>
            ))}
          </div>
          <div className="bg-white rounded-lg p-2 shadow-sm">
            <div className="h-16 flex items-end gap-1">
              {[40, 65, 55, 80, 90, 70, 85].map((h, i) => (
                <div key={i} className="flex-1 rounded-t" style={{ height: `${h}%`, backgroundColor: primary, opacity: 0.8 }} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function WhiteLabelPage() {
  const [tab, setTab] = useState<Tab>("Identidade Visual");
  const [primary, setPrimary]   = useState("#6C3BFF");
  const [secondary, setSecondary] = useState("#7B61FF");
  const [brandName, setBrandName] = useState("Minha Marca");
  const [logo, setLogo] = useState("M");

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <Topbar title="White-label" subtitle="Personalize a plataforma com sua marca" />

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

        {/* ── IDENTIDADE VISUAL ── */}
        {tab === "Identidade Visual" && (
          <div className="grid grid-cols-2 gap-8">
            <div className="space-y-5">
              {/* Logo */}
              <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                <p className="text-sm font-semibold text-[#111827] mb-4">Logo & Identidade</p>
                <div className="flex items-center gap-4 mb-5">
                  <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-white text-2xl font-bold flex-shrink-0" style={{ backgroundColor: primary }}>
                    {logo}
                  </div>
                  <div className="flex-1 space-y-2">
                    <button className="w-full flex items-center justify-center gap-2 py-2 text-sm bg-gray-50 border border-gray-200 rounded-xl hover:bg-gray-100 transition-colors">
                      <Upload size={14} className="text-gray-400" /> Upload logo
                    </button>
                    <input
                      value={brandName}
                      onChange={(e) => setBrandName(e.target.value)}
                      placeholder="Nome da marca"
                      className="w-full px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#6C3BFF]/20"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-xs text-gray-500 block mb-1">Letra/símbolo do ícone</label>
                  <input maxLength={2} value={logo} onChange={(e) => setLogo(e.target.value.toUpperCase())}
                    className="w-24 px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#6C3BFF]/20 text-center font-bold text-lg" />
                </div>
              </div>

              {/* Colors */}
              <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                <p className="text-sm font-semibold text-[#111827] mb-1">Paleta de cores</p>
                <p className="text-xs text-gray-400 mb-4">Clique na cor para alterar</p>
                <div className="divide-y divide-gray-50">
                  <ColorSwatch label="Cor primária"     color={primary}   onChange={setPrimary} />
                  <ColorSwatch label="Cor secundária"   color={secondary} onChange={setSecondary} />
                  <ColorSwatch label="Background escuro" color="#111827" />
                  <ColorSwatch label="Background claro" color="#F5F7FB" />
                  <ColorSwatch label="Sucesso"          color="#10B981" />
                  <ColorSwatch label="Erro"             color="#EF4444" />
                </div>
              </div>

              {/* Typography */}
              <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                <p className="text-sm font-semibold text-[#111827] mb-3">Tipografia</p>
                <div className="space-y-3">
                  {["Fonte principal", "Fonte secundária"].map((f) => (
                    <div key={f}>
                      <label className="text-xs text-gray-500 block mb-1">{f}</label>
                      <select className="w-full px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none">
                        <option>Inter</option>
                        <option>Poppins</option>
                        <option>Nunito</option>
                        <option>Roboto</option>
                      </select>
                    </div>
                  ))}
                </div>
              </div>

              <button className="w-full py-3 bg-[#6C3BFF] text-white font-medium rounded-xl hover:bg-[#5930e8] transition-colors flex items-center justify-center gap-2">
                <Check size={16} /> Salvar identidade visual
              </button>
            </div>

            {/* Live preview */}
            <div>
              <p className="text-sm font-semibold text-[#111827] mb-4 flex items-center gap-2">
                <Eye size={15} className="text-gray-400" /> Preview em tempo real
              </p>
              <BrandPreview primary={primary} name={brandName} logo={logo} />
              <p className="text-xs text-gray-400 mt-3 text-center">Alterações refletem instantaneamente na plataforma</p>
            </div>
          </div>
        )}

        {/* ── DOMÍNIO ── */}
        {tab === "Domínio & URL" && (
          <div className="max-w-2xl space-y-5">
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
              <p className="text-sm font-semibold text-[#111827] mb-4">URL da plataforma</p>
              <div className="space-y-4">
                <div>
                  <label className="text-xs text-gray-500 block mb-1">Subdomínio padrão</label>
                  <div className="flex items-center gap-0">
                    <input defaultValue="minha-empresa" className="flex-1 px-3 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-l-xl focus:outline-none focus:ring-2 focus:ring-[#6C3BFF]/20 border-r-0" />
                    <span className="px-3 py-2.5 text-sm bg-gray-100 border border-gray-200 rounded-r-xl text-gray-500 flex-shrink-0">.ideaatende.com</span>
                  </div>
                </div>
                <div>
                  <label className="text-xs text-gray-500 block mb-1">Domínio personalizado</label>
                  <div className="flex gap-2">
                    <input defaultValue="crm.minhaempresa.com.br" placeholder="crm.seudominio.com.br"
                      className="flex-1 px-3 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#6C3BFF]/20" />
                    <button className="px-4 py-2.5 bg-[#6C3BFF] text-white text-sm font-medium rounded-xl hover:bg-[#5930e8] transition-colors">Verificar</button>
                  </div>
                  <p className="text-xs text-gray-400 mt-1.5">Adicione um registro CNAME: <code className="bg-gray-100 px-1 py-0.5 rounded text-[10px]">cname.ideaatende.com</code></p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
              <p className="text-sm font-semibold text-[#111827] mb-4">Configurações de email</p>
              <div className="space-y-3">
                {[
                  { label: "Email remetente", placeholder: "noreply@seudominio.com" },
                  { label: "Nome remetente",  placeholder: "Minha Empresa" },
                ].map((f) => (
                  <div key={f.label}>
                    <label className="text-xs text-gray-500 block mb-1">{f.label}</label>
                    <input placeholder={f.placeholder} className="w-full px-3 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#6C3BFF]/20" />
                  </div>
                ))}
              </div>
              <button className="mt-4 w-full py-2.5 bg-[#6C3BFF] text-white text-sm font-medium rounded-xl hover:bg-[#5930e8] transition-colors">Salvar configurações</button>
            </div>
          </div>
        )}

        {/* ── REVENDEDORES ── */}
        {tab === "Revendedores" && (
          <div className="space-y-6">
            <div className="grid grid-cols-3 gap-4">
              {plans.map((plan) => (
                <div key={plan.name} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                  <div className="flex items-center gap-2 mb-3">
                    <Crown size={16} className="text-amber-400" />
                    <p className="font-semibold text-[#111827] text-sm">{plan.name}</p>
                  </div>
                  <p className="text-2xl font-bold text-[#6C3BFF] mb-3">{plan.price}</p>
                  <div className="space-y-1.5 text-sm text-gray-600">
                    <p>Até <strong>{plan.clients}</strong> clientes</p>
                    <p>Comissão de <strong>{plan.commission}</strong></p>
                    <p>White-label completo</p>
                    <p>Suporte dedicado</p>
                  </div>
                  <button className="mt-4 w-full py-2 border border-[#6C3BFF] text-[#6C3BFF] text-sm font-medium rounded-xl hover:bg-[#6C3BFF]/5 transition-colors">
                    Convidar revendedor
                  </button>
                </div>
              ))}
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
                <p className="font-semibold text-[#111827]">Revendedores ativos</p>
                <button className="flex items-center gap-1.5 px-4 py-2 bg-[#6C3BFF] text-white text-sm font-medium rounded-xl hover:bg-[#5930e8] transition-colors">
                  <Crown size={13} /> Adicionar revendedor
                </button>
              </div>
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-100">
                    {["Agência", "Domínio", "Clientes", "Receita MRR", "Status", ""].map((h) => (
                      <th key={h} className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wide px-5 py-3">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {resellers.map((r) => (
                    <tr key={r.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-5 py-3 text-sm font-medium text-[#111827]">{r.name}</td>
                      <td className="px-5 py-3">
                        <span className="text-xs text-[#6C3BFF] flex items-center gap-1">
                          <Globe size={11} /> {r.domain}
                        </span>
                      </td>
                      <td className="px-5 py-3 text-sm text-gray-600">{r.clients}</td>
                      <td className="px-5 py-3 text-sm font-semibold text-[#10B981]">{r.revenue}</td>
                      <td className="px-5 py-3">
                        <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${r.status === "Ativo" ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"}`}>
                          {r.status}
                        </span>
                      </td>
                      <td className="px-5 py-3">
                        <div className="flex gap-1.5">
                          <button className="p-1.5 text-gray-400 hover:text-[#6C3BFF] hover:bg-[#6C3BFF]/5 rounded-lg transition-colors"><ExternalLink size={13} /></button>
                          <button className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"><MoreHorizontal size={13} /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ── PREVIEW ── */}
        {tab === "Preview" && (
          <div className="flex flex-col items-center gap-6">
            <div className="flex items-center gap-3">
              <p className="text-sm text-gray-500">URL de preview:</p>
              <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-3 py-2">
                <Globe size={13} className="text-gray-400" />
                <span className="text-sm text-[#6C3BFF] font-medium">minha-empresa.ideaatende.com</span>
                <button className="text-gray-400 hover:text-gray-600 ml-1"><Copy size={13} /></button>
              </div>
              <button className="flex items-center gap-1.5 px-4 py-2 bg-[#6C3BFF] text-white text-sm font-medium rounded-xl hover:bg-[#5930e8] transition-colors">
                <ExternalLink size={13} /> Abrir preview
              </button>
            </div>
            <BrandPreview primary={primary} name={brandName} logo={logo} />
            <p className="text-xs text-gray-400">Esta é uma visualização da plataforma com sua identidade visual aplicada.</p>
          </div>
        )}
      </div>
    </div>
  );
}
