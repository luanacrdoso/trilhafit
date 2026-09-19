import { lazy, Suspense, useMemo } from 'react';
import { ErrorBoundary } from '../../../components/ErrorBoundary';
import { Loading } from '../../../components/Loading';
import { useRegistrosStore } from '../store/registros.store';
import { agruparCargaPorSemana } from '../treinos.utils';

// Code-splitting real: o Recharts só é baixado quando o usuário
// navega até o Dashboard, não no bundle inicial da aplicação.
const GraficoProgresso = lazy(() => import('../components/GraficoProgresso'));

export function DashboardPage() {
  const registros = useRegistrosStore((estado) => estado.registros);

  const dadosGrafico = useMemo(() => agruparCargaPorSemana(registros), [registros]);

  const totalRegistros = registros.length;
  const cargaAcumulada = registros.reduce((soma, r) => soma + r.cargaTotal, 0);
  const minutosAcumulados = registros.reduce((soma, r) => soma + r.duracaoMinutos, 0);

  return (
    <div className="pagina">
      <header className="pagina__cabecalho">
        <h1>Dashboard de progresso</h1>
        <p>Evolução da carga total levantada, semana a semana.</p>
      </header>

      <div className="cartoes-resumo">
        <div className="cartao-resumo">
          <span className="cartao-resumo__valor">{totalRegistros}</span>
          <span className="cartao-resumo__rotulo">treinos registrados</span>
        </div>
        <div className="cartao-resumo">
          <span className="cartao-resumo__valor">{cargaAcumulada}kg</span>
          <span className="cartao-resumo__rotulo">carga acumulada</span>
        </div>
        <div className="cartao-resumo">
          <span className="cartao-resumo__valor">{minutosAcumulados}min</span>
          <span className="cartao-resumo__rotulo">tempo total treinado</span>
        </div>
      </div>

      {dadosGrafico.length === 0 ? (
        <p className="lista-treinos__vazio" role="status">
          Ainda não há registros suficientes para gerar o gráfico. Registre um treino concluído
          para começar a ver sua evolução aqui.
        </p>
      ) : (
        <ErrorBoundary
          fallback={
            <div className="mensagem-erro" role="alert">
              <p className="mensagem-erro__titulo">Não foi possível exibir o gráfico</p>
              <p className="mensagem-erro__detalhe">
                Os dados de progresso parecem estar malformados.
              </p>
            </div>
          }
        >
          <Suspense fallback={<Loading rotulo="Carregando gráfico..." />}>
            <GraficoProgresso dados={dadosGrafico} />
          </Suspense>
        </ErrorBoundary>
      )}
    </div>
  );
}
