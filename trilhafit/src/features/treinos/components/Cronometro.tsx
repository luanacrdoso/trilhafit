import { useEffect, useState } from 'react';
import { formatarTempo } from '../treinos.utils';

/**
 * Cronômetro de treino. Este é o useEffect "genuíno" do projeto:
 * ele não busca dados, apenas sincroniza um efeito colateral (o
 * intervalo do setInterval) com o estado `emExecucao`.
 *
 * O cleanup (clearInterval) é obrigatório: sem ele, cada vez que o
 * efeito rodasse de novo (ou o componente desmontasse) sobraria um
 * intervalo "fantasma" rodando em segundo plano — um vazamento de
 * memória e de comportamento.
 */
export function Cronometro() {
  const [segundos, setSegundos] = useState(0);
  const [emExecucao, setEmExecucao] = useState(false);

  useEffect(() => {
    if (!emExecucao) return;

    const intervalo = setInterval(() => {
      setSegundos((atual) => atual + 1);
    }, 1000);

    // Cleanup: limpa o intervalo anterior antes de criar um novo efeito,
    // e também quando o componente for desmontado (ex: ao sair da página).
    return () => clearInterval(intervalo);
  }, [emExecucao]);

  function iniciar() {
    setEmExecucao(true);
  }

  function pausar() {
    setEmExecucao(false);
  }

  function zerar() {
    setEmExecucao(false);
    setSegundos(0);
  }

  return (
    <div className="cronometro">
      <p className="cronometro__display" aria-live="polite" aria-atomic="true">
        {formatarTempo(segundos)}
      </p>
      <div className="cronometro__controles">
        <button
          type="button"
          className="botao botao--primario"
          onClick={iniciar}
          disabled={emExecucao}
        >
          Iniciar
        </button>
        <button
          type="button"
          className="botao botao--secundario"
          onClick={pausar}
          disabled={!emExecucao}
        >
          Pausar
        </button>
        <button type="button" className="botao botao--fantasma" onClick={zerar}>
          Zerar
        </button>
      </div>
    </div>
  );
}
