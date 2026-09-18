import { useEffect, useState } from 'react';

/**
 * Retorna uma versão "atrasada" (debounced) do valor recebido.
 * O valor só é atualizado depois que o usuário para de digitar por
 * `atrasoMs` milissegundos — evita refiltrar a lista a cada tecla.
 */
export function useDebounce<T>(valor: T, atrasoMs = 300): T {
  const [valorDebounced, setValorDebounced] = useState(valor);

  useEffect(() => {
    const temporizador = setTimeout(() => {
      setValorDebounced(valor);
    }, atrasoMs);

    // Cleanup: cancela o timer anterior sempre que `valor` mudar de novo
    // antes do atraso terminar, ou quando o componente desmontar.
    return () => clearTimeout(temporizador);
  }, [valor, atrasoMs]);

  return valorDebounced;
}
