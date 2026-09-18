import { Component, type ErrorInfo, type ReactNode } from 'react';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

interface ErrorBoundaryState {
  temErro: boolean;
}

/**
 * Error Boundary de verdade (baseado em classe, como o React exige).
 * Captura erros de RENDERIZAÇÃO de componentes filhos — diferente da
 * MensagemErro, que trata erros de DADOS vindos do React Query.
 *
 * Usado ao redor do GraficoProgresso: se os dados do gráfico vierem
 * malformados e quebrarem o Recharts durante a renderização, o usuário
 * vê uma mensagem amigável em vez de uma tela em branco.
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { temErro: false };
  }

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { temErro: true };
  }

  componentDidCatch(erro: Error, infoErro: ErrorInfo) {
    console.error('ErrorBoundary capturou um erro de renderização:', erro, infoErro);
  }

  render() {
    if (this.state.temErro) {
      return (
        this.props.fallback ?? (
          <div className="mensagem-erro" role="alert">
            <p className="mensagem-erro__titulo">Algo deu errado ao exibir este conteúdo</p>
            <p className="mensagem-erro__detalhe">
              Tente recarregar a página. Se o problema persistir, os dados podem estar
              malformados.
            </p>
          </div>
        )
      );
    }

    return this.props.children;
  }
}
