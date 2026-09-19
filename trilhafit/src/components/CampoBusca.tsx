import { useId } from 'react';

interface CampoBuscaProps {
  valor: string;
  aoAlterar: (novoValor: string) => void;
  placeholder?: string;
}

export function CampoBusca({ valor, aoAlterar, placeholder = 'Buscar treinos...' }: CampoBuscaProps) {
  const id = useId();

  return (
    <div className="campo-busca">
      <label htmlFor={id} className="campo-busca__label-visualmente-oculto">
        Buscar treinos
      </label>
      <svg
        className="campo-busca__icone"
        viewBox="0 0 24 24"
        aria-hidden="true"
        focusable="false"
      >
        <circle cx="11" cy="11" r="7" fill="none" stroke="currentColor" strokeWidth="2" />
        <line x1="21" y1="21" x2="16.65" y2="16.65" stroke="currentColor" strokeWidth="2" />
      </svg>
      <input
        id={id}
        type="search"
        className="campo-busca__input"
        value={valor}
        placeholder={placeholder}
        onChange={(evento) => aoAlterar(evento.target.value)}
        autoComplete="off"
      />
    </div>
  );
}
