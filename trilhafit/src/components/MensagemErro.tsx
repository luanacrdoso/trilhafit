interface MensagemErroProps {
  titulo?: string;
  detalhe?: string;
  aoTentarNovamente?: () => void;
}

/**
 * Usado para erros de DADOS (ex: isError do React Query) — distinto
 * do ErrorBoundary, que trata erros de RENDERIZAÇÃO.
 */
export function MensagemErro({
  titulo = 'Não foi possível carregar os dados',
  detalhe,
  aoTentarNovamente,
}: MensagemErroProps) {
  return (
    <div className="mensagem-erro" role="alert">
      <p className="mensagem-erro__titulo">{titulo}</p>
      {detalhe && <p className="mensagem-erro__detalhe">{detalhe}</p>}
      {aoTentarNovamente && (
        <button type="button" className="botao botao--secundario" onClick={aoTentarNovamente}>
          Tentar novamente
        </button>
      )}
    </div>
  );
}
