import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';

type Tema = 'claro' | 'escuro';

interface ValorTemaContext {
  tema: Tema;
  alternarTema: () => void;
}

// Usamos Context API nativa aqui (em vez de Zustand) propositalmente:
// é uma preferência de UI local, de escopo pequeno, e serve como
// contraste didático com o Zustand usado nos favoritos/registros.
const TemaContext = createContext<ValorTemaContext | undefined>(undefined);

const CHAVE_STORAGE = 'trilhafit-tema';

function lerTemaSalvo(): Tema {
  if (typeof window === 'undefined') return 'escuro';
  const salvo = window.localStorage.getItem(CHAVE_STORAGE);
  if (salvo === 'claro' || salvo === 'escuro') return salvo;
  // Respeita a preferência do sistema operacional na primeira visita.
  const prefereClaro = window.matchMedia?.('(prefers-color-scheme: light)').matches;
  return prefereClaro ? 'claro' : 'escuro';
}

export function TemaProvider({ children }: { children: ReactNode }) {
  const [tema, setTema] = useState<Tema>(lerTemaSalvo);

  useEffect(() => {
    document.documentElement.setAttribute('data-tema', tema);
    window.localStorage.setItem(CHAVE_STORAGE, tema);
  }, [tema]);

  function alternarTema() {
    setTema((atual) => (atual === 'claro' ? 'escuro' : 'claro'));
  }

  return (
    <TemaContext.Provider value={{ tema, alternarTema }}>{children}</TemaContext.Provider>
  );
}

export function useTema(): ValorTemaContext {
  const contexto = useContext(TemaContext);
  if (!contexto) {
    throw new Error('useTema precisa ser usado dentro de um <TemaProvider>');
  }
  return contexto;
}
