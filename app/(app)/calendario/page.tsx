"use client";

import Topbar from "@/components/Topbar";
import { ChevronLeft, ChevronRight, Clock, User, Check } from "lucide-react";

const days = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
const hours = Array.from({ length: 12 }, (_, i) => `${i + 8}:00`);

const events = [
  { day: 1, hour: 9,  label: "Live de moda — Instagram", color: "bg-[#6C3BFF]", duration: 2 },
  { day: 2, hour: 11, label: "Recebimento nova coleção",  color: "bg-[#10B981]", duration: 1 },
  { day: 3, hour: 14, label: "Atendimento VIP — Fernanda Lima", color: "bg-amber-500", duration: 1 },
  { day: 3, hour: 16, label: "Sessão de fotos — Outono", color: "bg-blue-500", duration: 2 },
  { day: 4, hour: 9,  label: "Reunião c/ fornecedora",   color: "bg-rose-500", duration: 1 },
  { day: 5, hour: 10, label: "Lançamento Coleção Verão",  color: "bg-[#7B61FF]", duration: 1 },
];

const tasks = [
  { label: "Enviar proposta look para Rafaela Santos", done: false, priority: "Alta", due: "Hoje 17:00" },
  { label: "Confirmar atendimento VIP — Fernanda Lima", done: false, priority: "Alta", due: "Hoje 13:00" },
  { label: "Fotografar novas peças Outono",             done: true,  priority: "Baixa", due: "Ontem" },
  { label: "Publicar Reels — Coleção Verão 2026",       done: false, priority: "Alta", due: "Amanhã 9:00" },
  { label: "Revisar tabela de tamanhos no Salesbot",    done: false, priority: "Média", due: "Sex 16:00" },
];

const priorityColors: Record<string, string> = {
  Alta: "text-rose-500 bg-rose-50",
  Média: "text-amber-500 bg-amber-50",
  Baixa: "text-green-500 bg-green-50",
};

export default function CalendarioPage() {
  return (
    <div className="flex flex-col h-full overflow-hidden">
      <Topbar title="Calendário & Tarefas" subtitle="Agenda integrada e gestão de follow-ups" action={{ label: "Novo Evento", onClick: () => {} }} />

      <div className="flex-1 overflow-hidden flex gap-0">
        {/* Calendar */}
        <div className="flex-1 flex flex-col overflow-hidden border-r border-gray-200 bg-white">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <button className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"><ChevronLeft size={16} /></button>
              <h3 className="font-semibold text-[#111827]">Maio 2026</h3>
              <button className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"><ChevronRight size={16} /></button>
            </div>
            <div className="flex gap-1">
              {["Dia", "Semana", "Mês"].map((v, i) => (
                <button key={v} className={`px-3 py-1.5 text-xs rounded-lg transition-colors ${i === 1 ? "bg-[#6C3BFF] text-white" : "text-gray-500 hover:bg-gray-100"}`}>{v}</button>
              ))}
            </div>
          </div>

          {/* Week grid */}
          <div className="flex-1 overflow-auto">
            <div className="grid grid-cols-8 min-w-[600px]">
              {/* Time column */}
              <div className="border-r border-gray-100">
                <div className="h-10 border-b border-gray-100" />
                {hours.map((h) => (
                  <div key={h} className="h-14 border-b border-gray-50 flex items-start justify-end pr-2 pt-1">
                    <span className="text-[10px] text-gray-400">{h}</span>
                  </div>
                ))}
              </div>

              {/* Day columns */}
              {days.map((day, di) => (
                <div key={day} className="border-r border-gray-100 relative">
                  <div className={`h-10 border-b border-gray-100 flex flex-col items-center justify-center ${di === 1 ? "bg-[#6C3BFF]/5" : ""}`}>
                    <span className="text-[10px] text-gray-400">{day}</span>
                    <span className={`text-sm font-semibold ${di === 1 ? "text-[#6C3BFF]" : "text-[#111827]"}`}>{17 + di}</span>
                  </div>
                  <div className="relative">
                    {hours.map((_, hi) => (
                      <div key={hi} className="h-14 border-b border-gray-50" />
                    ))}
                    {events
                      .filter((e) => e.day === di)
                      .map((ev, i) => (
                        <div
                          key={i}
                          className={`absolute left-1 right-1 ${ev.color} rounded-md px-1.5 py-1 text-white text-[10px] font-medium overflow-hidden`}
                          style={{ top: `${(ev.hour - 8) * 56 + 2}px`, height: `${ev.duration * 56 - 4}px` }}
                        >
                          {ev.label}
                        </div>
                      ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Tasks sidebar */}
        <div className="w-72 bg-[#F5F7FB] flex flex-col overflow-hidden">
          <div className="p-4 border-b border-gray-200 bg-white">
            <h3 className="font-semibold text-[#111827]">Tarefas</h3>
            <p className="text-xs text-gray-400 mt-0.5">{tasks.filter((t) => !t.done).length} pendentes</p>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-2">
            {tasks.map((task, i) => (
              <div key={i} className="bg-white rounded-xl p-3.5 shadow-sm border border-gray-100">
                <div className="flex items-start gap-2.5">
                  <button className={`w-4 h-4 rounded border-2 flex-shrink-0 mt-0.5 flex items-center justify-center transition-colors ${task.done ? "bg-[#10B981] border-[#10B981]" : "border-gray-300 hover:border-[#6C3BFF]"}`}>
                    {task.done && <Check size={10} className="text-white" />}
                  </button>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm ${task.done ? "line-through text-gray-400" : "text-[#111827]"}`}>{task.label}</p>
                    <div className="flex items-center gap-2 mt-1.5">
                      <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${priorityColors[task.priority]}`}>
                        {task.priority}
                      </span>
                      <span className="text-[10px] text-gray-400 flex items-center gap-1">
                        <Clock size={9} /> {task.due}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
