import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { RegistroTreino } from '../types';

interface EstadoRegistros {
  registros: RegistroTreino[];
  adicionarRegistro: (registro: Omit<RegistroTreino, 'id'>) => void;
  removerRegistro: (id: string) => void;
}

/**
 * Estado global dos registros de treinos concluídos (histórico usado
 * pela RegistroPage e pelo DashboardPage), persistido em localStorage.
 */
export const useRegistrosStore = create<EstadoRegistros>()(
  persist(
    (set) => ({
      registros: [],

      adicionarRegistro: (registro) => {
        const novoRegistro: RegistroTreino = {
          ...registro,
          id: crypto.randomUUID(),
        };
        set((estado) => ({ registros: [...estado.registros, novoRegistro] }));
      },

      removerRegistro: (id: string) => {
        set((estado) => ({
          registros: estado.registros.filter((registro) => registro.id !== id),
        }));
      },
    }),
    {
      name: 'trilhafit-registros',
    }
  )
);
