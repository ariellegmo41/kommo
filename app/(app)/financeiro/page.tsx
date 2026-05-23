"use client";

import Topbar from "@/components/Topbar";
import { useState } from "react";
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer,
} from "recharts";
import {
  TrendingUp, TrendingDown, DollarSign, ArrowUp, ArrowDown,
  Clock, CheckCircle2, AlertCircle, Filter,
} from "lucide-react";
import { cn } from "@/lib/utils";

// ─── Data ────────────────────────────────────────────────────────────────────

const cashflowData = [
  { dia: "Seg", entradas: 4200,  saidas: 1800, saldo: 2400  },
  { dia: "Ter", entradas: 3800,  saidas: 2100, saldo: 1700  },
  { dia: "Qua", entradas: 5100,  saidas: 1600, saldo: 3500  },
  { dia: "Qui", entradas: 7200,  saidas: 2400, saldo: 4800  },
  { dia: "Sex", entradas: 8400,  saidas: 3200, saldo: 5200  },
  { dia: "Sáb", entradas: 6100,  saidas: 1200, saldo: 4900  },
  { dia: "Dom", entradas: 2800,  saidas: 800,  saldo: 2000  },
];

const revenueData = [
  { mes: "Jan", receita: 28400, despesas: 12100 },
  { mes: "Fev", receita: 31200, despesas: 13400 },
  { mes: "Mar", receita: 27800, despesas: 11900 },
  { mes: "Abr", receita: 36900, despesas: 15200 },
  { mes: "Mai", receita: 43480, despesas: 16800 },
];

interface Transaction {
  id: string;
  desc: string;
  category: string;
  type: "entrada" | "saida";
  amount: number;
  status: "pago" | "pendente" | "atrasado";
  date: string;
  method: string;
}

const transactions: Transaction[] = [
  { id: "1",  desc: "Pedido #1085 — Fernanda Lima",   category: "Vendas",     type: "entrada", amount: 379.80, status: "pago",     date: "Hoje 10:30",     method: "Pix"       },
  { id: "2",  desc: "Pedido #1083 — Camila Rodrigues", category: "Vendas",     type: "entrada", amount: 489.80, status: "pago",     date: "Hoje 09:15",     method: "Cartão"    },
  { id: "3",  desc: "Fornecedor — Tecidos Premium",   category: "Estoque",    type: "saida",   amount: 2400,   status: "pendente", date: "Hoje 08:00",     method: "Boleto"    },
  { id: "4",  desc: "Pedido #1080 — Andressa Costa",  category: "Vendas",     type: "entrada", amount: 259.90, status: "pago",     date: "Ontem 16:22",    method: "Pix"       },
  { id: "5",  desc: "Pedido #1079 — Tatiane Oliveira",category: "Vendas",     type: "entrada", amount: 149.90, status: "pendente", date: "Ontem 14:00",    method: "Pix"       },
  { id: "6",  desc: "Aluguel do espaço — Maio",       category: "Operacional",type: "saida",   amount: 3500,   status: "pago",     date: "01/05 09:00",    method: "Transferência" },
  { id: "7",  desc: "Marketing — Instagram Ads",      category: "Marketing",  type: "saida",   amount: 850,    status: "pago",     date: "01/05 08:00",    method: "Cartão"    },
  { id: "8",  desc: "Pedido #1078 — Rafaela Santos",  category: "Vendas",     type: "entrada", amount: 189.90, status: "atrasado", date: "18/05 11:30",    method: "Pix"       },
  { id: "9",  desc: "Embalagens e etiquetas",         category: "Operacional",type: "saida",   amount: 320,    status: "pago",     date: "17/05 15:00",    method: "Pix"       },
  { id: "10", desc: "Pedido #1077 — Juliana Faria",   category: "Vendas",     type: "entrada", amount: 648,    status: "pago",     date: "17/05 12:00",    method: "Pix"       },
];

const receivables = [
  { customer: "Fernanda Lima",     amount: 379.80, due: "Hoje",     status: "pago",     method: "Pix"    },
  { customer: "Tatiane Oliveira",  amount: 149.90, due: "Hoje",     status: "pendente", method: "Pix"    },
  { customer: "Rafaela Santos",    amount: 189.90, due: "Ontem",    status: "atrasado", method: "Pix"    },
  { customer: "Camila Rodrigues",  amount: 489.80, due: "23/05",    status: "pendente", method: "Cartão" },
  { customer: "Beatriz Souza",     amount: 299.90, due: "25/05",    status: "pendente", method: "Pix"    },
];

const payables = [
  { supplier: "Tecidos Premium",   amount: 2400,  due: "Hoje",     status: "pendente", category: "Estoque"    },
  { supplier: "Meta Ads",          amount: 1200,  due: "25/05",    status: "pendente", category: "Marketing"  },
  { supplier: "Energia elétrica",  amount: 480,   due: "28/05",    status: "pendente", category: "Operacional"},
  { supplier: "Assistente virtual",amount: 350,   due: "01/06",    status: "pendente", category: "Serviços"   },
];

const statusBadge: Record<string, string> = {
  pago:     "bg-green-100 text-green-700",
  pendente: "bg-amber-100 text-amber-700",
  atrasado: "bg-red-100 text-red-600",
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload?.length) {
    return (
      <div className="bg-white border border-gray-200 rounded-xl shadow-lg p-3 text-xs">
        <p className="font-semibold text-gray-700 mb-1">{label}</p>
        {payload.map((p: any) => (
          <p key={p.name} style={{ color: p.color }}>
            {p.name}: <strong>R$ {p.value.toLocaleString("pt-BR")}</strong>
          </p>
        ))}
      </div>
    );
  }
  return null;
};

// ─── Page ────────────────────────────────────────────────────────────────────

export default function FinanceiroPage() {
  const [tab, setTab] = useState<"overview" | "transacoes" | "receber" | "pagar">("overview");
  const [txFilter, setTxFilter] = useState<"todos" | "entrada" | "saida">("todos");

  const totalEntradas  = transactions.filter((t) => t.type === "entrada" && t.status === "pago").reduce((s, t) => s + t.amount, 0);
  const totalSaidas    = transactions.filter((t) => t.type === "saida"   && t.status === "pago").reduce((s, t) => s + t.amount, 0);
  const saldoAtual     = totalEntradas - totalSaidas;
  const totalReceber   = receivables.filter((r) => r.status !== "pago").reduce((s, r) => s + r.amount, 0);
  const totalPagar     = payables.reduce((s, p) => s + p.amount, 0);
  const vencidos       = receivables.filter((r) => r.status === "atrasado").length;

  const filteredTx = txFilter === "todos"
    ? transactions
    : transactions.filter((t) => t.type === txFilter);

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <Topbar
        title="Financeiro"
        subtitle="Controle de caixa, recebíveis e pagamentos — Bella Modas"
        action={{ label: "Exportar Relatório", onClick: () => {
          const rows = [["Data","Descrição","Tipo","Valor","Status","Método"],
            ...transactions.map((t) => [t.date, t.desc, t.type, t.amount, t.status, t.method])];
          const csv  = rows.map((r) => r.join(",")).join("\n");
          const blob = new Blob([csv], { type: "text/csv" });
          const url  = URL.createObjectURL(blob);
          const a    = document.createElement("a"); a.href = url; a.download = "financeiro.csv"; a.click();
          URL.revokeObjectURL(url);
        }}}
      />

      <div className="flex-1 overflow-y-auto p-6 space-y-5">

        {/* KPI cards */}
        <div className="grid grid-cols-5 gap-4">
          {[
            { label: "Saldo Atual",    value: `R$ ${saldoAtual.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`, icon: DollarSign, color: "bg-[#6C3BFF]/10 text-[#6C3BFF]",  change: "+R$ 5.2k", up: true  },
            { label: "Total Recebido", value: `R$ ${totalEntradas.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`, icon: ArrowUp, color: "bg-green-100 text-green-600",  change: "+18%", up: true  },
            { label: "Total Gasto",    value: `R$ ${totalSaidas.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`,   icon: ArrowDown, color: "bg-red-100 text-red-500",    change: "+4%",  up: false },
            { label: "A Receber",      value: `R$ ${totalReceber.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`,   icon: Clock, color: "bg-amber-100 text-amber-600",  change: `${vencidos} atrasado${vencidos !== 1 ? "s" : ""}`, up: vencidos === 0 },
            { label: "A Pagar",        value: `R$ ${totalPagar.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`,     icon: AlertCircle, color: "bg-orange-100 text-orange-500", change: "4 contas", up: true },
          ].map((s) => (
            <div key={s.label} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-3">
                <div className={cn("w-9 h-9 rounded-lg flex items-center justify-center", s.color)}>
                  <s.icon size={16} />
                </div>
                <span className={cn("flex items-center gap-0.5 text-xs font-medium", s.up ? "text-[#10B981]" : "text-red-500")}>
                  {s.up ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
                  {s.change}
                </span>
              </div>
              <p className="text-lg font-bold text-[#111827] leading-tight">{s.value}</p>
              <p className="text-xs text-gray-400 mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-gray-100 rounded-xl p-1 w-fit">
          {([
            ["overview",    "Visão Geral"],
            ["transacoes",  "Transações"],
            ["receber",     "A Receber"],
            ["pagar",       "A Pagar"],
          ] as const).map(([key, label]) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              className={cn(
                "px-4 py-2 text-sm rounded-lg font-medium transition-colors",
                tab === key ? "bg-white text-[#6C3BFF] shadow-sm" : "text-gray-500 hover:text-gray-700"
              )}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Overview tab */}
        {tab === "overview" && (
          <div className="space-y-5">
            {/* Charts */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
                <h3 className="font-semibold text-[#111827] mb-1">Fluxo de Caixa — Semana</h3>
                <p className="text-xs text-gray-400 mb-5">Entradas e saídas diárias</p>
                <ResponsiveContainer width="100%" height={200}>
                  <AreaChart data={cashflowData}>
                    <defs>
                      <linearGradient id="gradEntradas" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10B981" stopOpacity={0.15} />
                        <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="gradSaidas" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#EF4444" stopOpacity={0.1} />
                        <stop offset="95%" stopColor="#EF4444" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="dia" tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} tickFormatter={(v) => `R$${(v / 1000).toFixed(0)}k`} />
                    <Tooltip content={<CustomTooltip />} />
                    <Area type="monotone" dataKey="entradas" name="Entradas" stroke="#10B981" strokeWidth={2} fill="url(#gradEntradas)" dot={false} />
                    <Area type="monotone" dataKey="saidas" name="Saídas" stroke="#EF4444" strokeWidth={2} fill="url(#gradSaidas)" dot={false} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
                <h3 className="font-semibold text-[#111827] mb-1">Receita vs Despesas — Mensal</h3>
                <p className="text-xs text-gray-400 mb-5">Comparativo últimos 5 meses</p>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={revenueData} barGap={4}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                    <XAxis dataKey="mes" tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} tickFormatter={(v) => `R$${(v / 1000).toFixed(0)}k`} />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="receita"  name="Receita"  fill="#6C3BFF" radius={[4, 4, 0, 0]} barSize={14} />
                    <Bar dataKey="despesas" name="Despesas" fill="#e5e7eb" radius={[4, 4, 0, 0]} barSize={14} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Quick summary */}
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle2 size={16} className="text-green-600" />
                  <p className="text-sm font-semibold text-green-800">Recebimentos do Mês</p>
                </div>
                <p className="text-2xl font-bold text-green-700">R$ {totalEntradas.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</p>
                <p className="text-xs text-green-600 mt-1">{transactions.filter((t) => t.type === "entrada" && t.status === "pago").length} transações confirmadas</p>
              </div>
              <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <ArrowDown size={16} className="text-red-500" />
                  <p className="text-sm font-semibold text-red-800">Despesas do Mês</p>
                </div>
                <p className="text-2xl font-bold text-red-600">R$ {totalSaidas.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</p>
                <p className="text-xs text-red-500 mt-1">{transactions.filter((t) => t.type === "saida" && t.status === "pago").length} pagamentos realizados</p>
              </div>
              <div className="bg-[#6C3BFF]/5 border border-[#6C3BFF]/20 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <DollarSign size={16} className="text-[#6C3BFF]" />
                  <p className="text-sm font-semibold text-[#6C3BFF]">Lucro Líquido</p>
                </div>
                <p className="text-2xl font-bold text-[#6C3BFF]">R$ {saldoAtual.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</p>
                <p className="text-xs text-[#6C3BFF]/70 mt-1">
                  Margem: {totalEntradas > 0 ? ((saldoAtual / totalEntradas) * 100).toFixed(1) : 0}%
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Transactions tab */}
        {tab === "transacoes" && (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Filter size={14} className="text-gray-400" />
              {(["todos", "entrada", "saida"] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => setTxFilter(f)}
                  className={cn(
                    "px-3 py-1.5 text-xs rounded-lg font-medium transition-colors capitalize",
                    txFilter === f ? "bg-[#6C3BFF] text-white" : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
                  )}
                >
                  {f === "todos" ? "Todos" : f === "entrada" ? "Entradas" : "Saídas"}
                </button>
              ))}
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50">
                    {["Descrição", "Categoria", "Data", "Método", "Valor", "Status"].map((h) => (
                      <th key={h} className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wide px-4 py-3">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filteredTx.map((t) => (
                    <tr key={t.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2.5">
                          <div className={cn("w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0",
                            t.type === "entrada" ? "bg-green-100" : "bg-red-100")}>
                            {t.type === "entrada"
                              ? <ArrowUp size={13} className="text-green-600" />
                              : <ArrowDown size={13} className="text-red-500" />}
                          </div>
                          <span className="text-sm text-[#111827] font-medium truncate max-w-[200px]">{t.desc}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">{t.category}</span>
                      </td>
                      <td className="px-4 py-3 text-xs text-gray-400 whitespace-nowrap">{t.date}</td>
                      <td className="px-4 py-3 text-xs text-gray-600">{t.method}</td>
                      <td className="px-4 py-3">
                        <span className={cn("text-sm font-bold", t.type === "entrada" ? "text-[#10B981]" : "text-red-500")}>
                          {t.type === "entrada" ? "+" : "-"} R$ {t.amount.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={cn("text-[10px] font-semibold px-2.5 py-1 rounded-full capitalize", statusBadge[t.status])}>
                          {t.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Receivables tab */}
        {tab === "receber" && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
              <p className="text-sm font-semibold text-[#111827]">Contas a Receber</p>
              <span className="text-xs text-gray-400">Total pendente: <strong className="text-[#111827]">R$ {totalReceber.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</strong></span>
            </div>
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50">
                  {["Cliente", "Vencimento", "Método", "Valor", "Status", "Ação"].map((h) => (
                    <th key={h} className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wide px-4 py-3">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {receivables.map((r, i) => (
                  <tr key={i} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 text-sm font-medium text-[#111827]">{r.customer}</td>
                    <td className={cn("px-4 py-3 text-xs font-medium", r.status === "atrasado" ? "text-red-500" : "text-gray-600")}>{r.due}</td>
                    <td className="px-4 py-3 text-xs text-gray-500">{r.method}</td>
                    <td className="px-4 py-3 text-sm font-bold text-[#111827]">R$ {r.amount.toFixed(2).replace(".", ",")}</td>
                    <td className="px-4 py-3">
                      <span className={cn("text-[10px] font-semibold px-2.5 py-1 rounded-full capitalize", statusBadge[r.status])}>
                        {r.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {r.status !== "pago" && (
                        <button className="text-xs text-[#6C3BFF] font-medium hover:underline">
                          Cobrar via {r.method === "Pix" ? "Pix" : "Link"}
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Payables tab */}
        {tab === "pagar" && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
              <p className="text-sm font-semibold text-[#111827]">Contas a Pagar</p>
              <span className="text-xs text-gray-400">Total: <strong className="text-[#111827]">R$ {totalPagar.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</strong></span>
            </div>
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50">
                  {["Fornecedor / Conta", "Categoria", "Vencimento", "Valor", "Status", "Ação"].map((h) => (
                    <th key={h} className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wide px-4 py-3">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {payables.map((p, i) => (
                  <tr key={i} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 text-sm font-medium text-[#111827]">{p.supplier}</td>
                    <td className="px-4 py-3">
                      <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">{p.category}</span>
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-600 font-medium">{p.due}</td>
                    <td className="px-4 py-3 text-sm font-bold text-red-500">R$ {p.amount.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</td>
                    <td className="px-4 py-3">
                      <span className={cn("text-[10px] font-semibold px-2.5 py-1 rounded-full capitalize", statusBadge[p.status])}>
                        {p.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <button className="text-xs bg-[#6C3BFF] text-white font-medium px-3 py-1 rounded-lg hover:bg-[#5a2fd6] transition-colors">
                        Pagar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
