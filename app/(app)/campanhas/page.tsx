"use client";

import Topbar from "@/components/Topbar";
import { Megaphone, Users, Send, Eye, MoreHorizontal, Plus } from "lucide-react";

const campaigns = [
  { name: "Black Friday — Oferta Especial", status: "Ativa", channel: "WhatsApp", sent: 2340, delivered: 2298, opened: 1840, clicked: 420, date: "18/05/2026" },
  { name: "Reativação de Leads Frios", status: "Agendada", channel: "WhatsApp", sent: 0, delivered: 0, opened: 0, clicked: 0, date: "20/05/2026" },
  { name: "Newsletter Semanal", status: "Concluída", channel: "Email", sent: 1200, delivered: 1189, opened: 876, clicked: 234, date: "11/05/2026" },
  { name: "Promoção Instagram", status: "Rascunho", channel: "Instagram", sent: 0, delivered: 0, opened: 0, clicked: 0, date: "-" },
];

const statusColors: Record<string, string> = {
  Ativa: "bg-green-100 text-green-700",
  Agendada: "bg-blue-100 text-blue-700",
  Concluída: "bg-gray-100 text-gray-600",
  Rascunho: "bg-amber-100 text-amber-700",
};

export default function CampanhasPage() {
  return (
    <div className="flex flex-col h-full overflow-hidden">
      <Topbar title="Campanhas" subtitle="Gestão de campanhas e broadcasts" action={{ label: "Nova Campanha", onClick: () => {} }} />

      <div className="flex-1 overflow-y-auto p-6 space-y-6">
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
                <tr key={c.name} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 text-sm font-medium text-[#111827]">{c.name}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${statusColors[c.status]}`}>{c.status}</span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">{c.channel}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{c.sent.toLocaleString("pt-BR")}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{c.delivered.toLocaleString("pt-BR")}</td>
                  <td className="px-4 py-3 text-sm text-[#10B981] font-medium">{c.opened.toLocaleString("pt-BR")}</td>
                  <td className="px-4 py-3 text-sm text-[#6C3BFF] font-medium">{c.clicked.toLocaleString("pt-BR")}</td>
                  <td className="px-4 py-3 text-xs text-gray-400">{c.date}</td>
                  <td className="px-4 py-3">
                    <button className="text-gray-400 hover:text-gray-600 transition-colors"><MoreHorizontal size={16} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
