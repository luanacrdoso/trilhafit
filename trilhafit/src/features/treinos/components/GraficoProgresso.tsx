import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

interface PontoGrafico {
  semana: string;
  cargaTotal: number;
}

interface GraficoProgressoProps {
  dados: PontoGrafico[];
}

// Este componente é carregado sob demanda via React.lazy + Suspense
// (ver DashboardPage). Se `dados` vier malformado, o erro de renderização
// do Recharts é capturado pelo ErrorBoundary que envolve este componente.
export default function GraficoProgresso({ dados }: GraficoProgressoProps) {
  return (
    <div className="grafico-progresso">
      <ResponsiveContainer width="100%" height={320}>
        <LineChart data={dados} margin={{ top: 16, right: 24, left: 0, bottom: 8 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--cor-borda)" />
          <XAxis dataKey="semana" stroke="var(--cor-texto-secundario)" fontSize={12} />
          <YAxis stroke="var(--cor-texto-secundario)" fontSize={12} unit="kg" />
          <Tooltip
            contentStyle={{
              background: 'var(--cor-superficie)',
              border: '1px solid var(--cor-borda)',
              borderRadius: 8,
              color: 'var(--cor-texto)',
            }}
          />
          <Line
            type="monotone"
            dataKey="cargaTotal"
            name="Carga total (kg)"
            stroke="var(--cor-destaque)"
            strokeWidth={3}
            dot={{ fill: 'var(--cor-destaque)', r: 4 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
