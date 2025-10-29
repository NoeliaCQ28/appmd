import { ArrowDownLeft, ArrowUpRight } from "lucide-react";
import { Card } from "primereact/card";
import { Chart } from "primereact/chart";
import { Dropdown } from "primereact/dropdown";
import { useState } from "react";
import { cn } from "../../../../utils/utils";
import { useCardResumeReport } from "../../hooks/useCardResumeReport";

// Datos
const salesData = [
  { month: "Sep", value: 15 },
  { month: "Oct", value: 12 },
  { month: "Nov", value: 29 },
  { month: "Dic", value: 35 },
  { month: "Ene", value: 25 },
  { month: "Feb", value: 32 },
];

const productsData = [
  { name: "MP-60", value: 45 },
  { name: "MP-68", value: 65 },
  { name: "MP-76", value: 40 },
  { name: "MP-82", value: 70 },
  { name: "MD-65", value: 80 },
  { name: "MD-80", value: 30 },
];

const quotationStates = [
  { name: "Borrador", value: 40 },
  { name: "En Proceso", value: 65 },
  { name: "Procesado", value: 45 },
  { name: "Entregado", value: 70 },
  { name: "En Pedido", value: 55 },
  { name: "Rechazada", value: 30 },
];

// Opciones para los Dropdowns
const periodOptions = [
  { label: "Últimos 6 meses", value: "6months" },
  { label: "Últimos 3 meses", value: "3months" },
  { label: "Último mes", value: "1month" },
];

const groupOptions = [
  { label: "Grupos Electrógenos", value: "all" },
  { label: "Grupo 1", value: "group1" },
  { label: "Grupo 2", value: "group2" },
];

const vendorOptions = [
  { label: "Marilin Velasquez", value: "marilin" },
  { label: "Vendedor 1", value: "other1" },
  { label: "Vendedor 2", value: "other2" },
];

export default function DashboardReportesView() {
  // Estados para los Dropdowns
  const [selectedPeriod, setSelectedPeriod] = useState("6months");
  const [selectedGroup, setSelectedGroup] = useState("all");
  const [selectedVendor, setSelectedVendor] = useState("marilin");
  const [selectedGroupProducts, setSelectedGroupProducts] = useState("all");
  const [selectedGroupQuotations, setSelectedGroupQuotations] = useState("all");

  // Configuración del gráfico de línea (Ventas)
  const lineChartData = {
    labels: salesData.map((item) => item.month),
    datasets: [
      {
        label: "Ventas",
        data: salesData.map((item) => item.value),
        fill: false,
        borderColor: "#FFA500",
        tension: 0.4,
        pointBackgroundColor: "#FFA500",
        pointBorderColor: "#FFA500",
        pointRadius: 4,
        pointHoverRadius: 6,
      },
    ],
  };

  const lineChartOptions = {
    scales: {
      x: {
        grid: { display: true, drawBorder: false },
        ticks: { padding: 10 },
      },
      y: {
        grid: { display: true, drawBorder: false },
        ticks: { padding: 10 },
      },
    },
    plugins: {
      tooltip: { enabled: true },
      legend: { display: false },
    },
    maintainAspectRatio: false,
  };

  // Configuración del gráfico de barras (Productos)
  const productsBarData = {
    labels: productsData.map((item) => item.name),
    datasets: [
      {
        label: "Productos",
        data: productsData.map((item) => item.value),
        backgroundColor: "#4CAF50",
        borderRadius: 16,
        borderSkipped: false,
      },
    ],
  };

  const productsBarOptions = {
    scales: {
      x: {
        grid: { display: true, drawBorder: false },
        ticks: { padding: 10 },
      },
      y: {
        grid: { display: true, drawBorder: false },
        ticks: { padding: 10 },
      },
    },
    plugins: {
      tooltip: { enabled: true },
      legend: { display: false },
    },
  };

  // Configuración del gráfico de barras (Cotizaciones)
  const quotationBarData = {
    labels: quotationStates.map((item) => item.name),
    datasets: [
      {
        label: "Cotizaciones",
        data: quotationStates.map((item) => item.value),
        backgroundColor: "#9E9E9E",
        borderRadius: 16,
        borderSkipped: false,
      },
    ],
  };

  const quotationBarOptions = {
    scales: {
      x: {
        grid: { display: true, drawBorder: false },
        ticks: { padding: 10 },
      },
      y: {
        grid: { display: true, drawBorder: false },
        ticks: { padding: 10 },
      },
    },
    plugins: {
      tooltip: { enabled: true },
      legend: { display: false },
    },
  };

  // Cabeceras de las tarjetas con Dropdowns
  const performanceHeader = (
    <div className="flex flex-row items-center justify-between">
      <h2 className="text-xl font-bold">
        Desempeño de los representantes de ventas
      </h2>
      <div className="flex gap-2">
        <Dropdown
          value={selectedPeriod}
          options={periodOptions}
          onChange={(e) => setSelectedPeriod(e.value)}
          placeholder="Período"
          className="bg-[#ebebeb] border-0 rounded-xl"
          panelClassName="bg-[#ebebeb]"
          style={{ width: "180px" }}
        />
        <Dropdown
          value={selectedGroup}
          options={groupOptions}
          onChange={(e) => setSelectedGroup(e.value)}
          placeholder="Grupos"
          className="bg-[#ebebeb] border-0 rounded-xl"
          panelClassName="bg-[#ebebeb]"
          style={{ width: "180px" }}
        />
        <Dropdown
          value={selectedVendor}
          options={vendorOptions}
          onChange={(e) => setSelectedVendor(e.value)}
          placeholder="Vendedor"
          className="bg-[#ebebeb] border-0 rounded-xl"
          panelClassName="bg-[#ebebeb]"
          style={{ width: "180px" }}
        />
      </div>
    </div>
  );

  const productsHeader = (
    <div className="flex flex-row items-center justify-between">
      <h2 className="text-xl font-bold">Productos Más Vendidos</h2>
      <Dropdown
        value={selectedGroupProducts}
        options={groupOptions}
        onChange={(e) => setSelectedGroupProducts(e.value)}
        placeholder="Grupos"
        className="bg-[#ebebeb] border-0 rounded-xl"
        panelClassName="bg-[#ebebeb]"
        style={{ width: "180px" }}
      />
    </div>
  );

  const quotationHeader = (
    <div className="flex flex-row items-center justify-between">
      <h2 className="text-xl font-bold">Estados Cotizaciones</h2>
      <Dropdown
        value={selectedGroupQuotations}
        options={groupOptions}
        onChange={(e) => setSelectedGroupQuotations(e.value)}
        placeholder="Grupos"
        className="bg-[#ebebeb] border-0 rounded-xl"
        panelClassName="bg-[#ebebeb]"
        style={{ width: "180px" }}
      />
    </div>
  );

  const { cardResume } = useCardResumeReport();

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Cotizaciones"
          total={cardResume?.quotesQuantityResume[0].CantidadMesActual}
          change={cardResume?.quotesQuantityResume[0].VariacionPorcentaje}
          period={new Date().toLocaleString("default", { month: "short" })}
          color={
            !cardResume?.quotesQuantityResume[0].VariacionPorcentaje?.includes(
              "-"
            )
              ? "green"
              : "red"
          }
        />
        <MetricCard
          title="Clientes"
          total={cardResume?.customerQuantityResume[0].CantidadMesActual}
          change={cardResume?.customerQuantityResume[0].VariacionPorcentaje}
          period={new Date().toLocaleString("default", { month: "short" })}
          color={
            !cardResume?.customerQuantityResume[0].VariacionPorcentaje?.includes(
              "-"
            )
              ? "green"
              : "red"
          }
        />
        <MetricCard
          title="Vendedores"
          total={cardResume?.sellerQuantityResume[0].CantidadMesActual}
          change={cardResume?.sellerQuantityResume[0].VariacionPorcentaje}
          period={new Date().toLocaleString("default", { month: "short" })}
          color={
            !cardResume?.sellerQuantityResume[0].VariacionPorcentaje?.includes(
              "-"
            )
              ? "green"
              : "red"
          }
        />
        <MetricCard
          title="Ventas"
          total={cardResume?.salesQuantityResume[0].CantidadMesActual}
          change={cardResume?.salesQuantityResume[0].VariacionPorcentaje}
          period={new Date().toLocaleString("default", { month: "short" })}
          color={
            !cardResume?.salesQuantityResume[0].VariacionPorcentaje?.includes(
              "-"
            )
              ? "green"
              : "red"
          }
        />
      </div>

      {/* Tarjeta de desempeño */}
      <Card
        header={performanceHeader}
        style={{ width: "100%" }}
        className="p-4"
      >
        <div className="mt-4" style={{ height: "300px" }} width="100%">
          <Chart
            type="line"
            className="bg-[#f5f5f5] border-0 rounded-xl"
            width="100%"
            data={lineChartData}
            options={lineChartOptions}
            style={{ height: "100%" }}
          />
        </div>
      </Card>

      {/* Tarjetas de Productos y Cotizaciones */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card
          header={productsHeader}
          className="p-4 shadow-none bg-[#f5f5f5] rounded-2xl"
        >
          <div style={{ height: "300px" }}>
            <Chart
              type="bar"
              data={productsBarData}
              options={productsBarOptions}
              style={{ height: "100%" }}
            />
          </div>
        </Card>

        <Card
          header={quotationHeader}
          className="p-4 shadow-none bg-[#f5f5f5] rounded-2xl"
        >
          <div style={{ height: "300px" }}>
            <Chart
              type="bar"
              data={quotationBarData}
              options={quotationBarOptions}
              style={{ height: "100%" }}
            />
          </div>
        </Card>
      </div>
    </div>
  );
}

function MetricCard({ title, total, change, period, color = "green" }) {
  const borderColor = color === "green" ? "#34D399" : "#ff7848";
  return (
    <Card
      style={{ border: `2px solid ${borderColor}` }}
      className="shadow-none rounded-2xl"
    >
      <div className="flex flex-row items-center justify-between pb-2">
        <span className="text-sm font-medium text-gray-600">{title}</span>
        {change?.includes("-") ? (
          <ArrowDownLeft size={24} className="text-red-500" />
        ) : (
          <ArrowUpRight size={24} className="text-green-500" />
        )}
      </div>
      <div>
        <div className="text-2xl font-bold">{total}</div>
        <div className="flex items-center gap-1">
          <span
            className={cn("text-sm font-medium", {
              "text-green-500": color === "green",
              "text-red-500": color !== "green",
            })}
          >
            {change}
          </span>
          <span className="text-sm text-gray-600">{period}</span>
        </div>
      </div>
    </Card>
  );
}
