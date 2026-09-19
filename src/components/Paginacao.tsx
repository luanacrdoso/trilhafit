import React from 'react';

interface PaginacaoProps {
  totalPaginas: number;
  paginaAtual: number;
  onMudarPagina: (pagina: number) => void;
}

export const Paginacao: React.FC<PaginacaoProps> = ({
  totalPaginas,
  paginaAtual,
  onMudarPagina,
}) => {
  if (totalPaginas <= 1) return null;

  // Cria array com os números das páginas [1, 2, ..., totalPaginas]
  const paginas = Array.from({ length: totalPaginas }, (_, i) => i + 1);

  return (
    <nav className="flex items-center justify-center gap-2 my-8" aria-label="Paginação">
      {/* Botão Anterior */}
      <button
        onClick={() => onMudarPagina(paginaAtual - 1)}
        disabled={paginaAtual === 1}
        className="px-3 py-1.5 rounded-md border text-sm font-medium transition-colors
                   disabled:opacity-50 disabled:cursor-not-allowed
                   hover:bg-gray-100 dark:hover:bg-gray-800"
      >
        Anterior
      </button>

      {/* Botões Numerados */}
      {paginas.map((num) => (
        <button
          key={num}
          onClick={() => onMudarPagina(num)}
          className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
            paginaAtual === num
              ? 'bg-emerald-600 text-white'
              : 'border hover:bg-gray-100 dark:hover:bg-gray-800'
          }`}
        >
          {num}
        </button>
      ))}

      {/* Botão Próximo */}
      <button
        onClick={() => onMudarPagina(paginaAtual + 1)}
        disabled={paginaAtual === totalPaginas}
        className="px-3 py-1.5 rounded-md border text-sm font-medium transition-colors
                   disabled:opacity-50 disabled:cursor-not-allowed
                   hover:bg-gray-100 dark:hover:bg-gray-800"
      >
        Próximo
      </button>
    </nav>
  );
};