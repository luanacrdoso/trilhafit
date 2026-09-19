import { useId, useState, type FormEvent } from 'react';
import type { Treino } from '../types';

interface FormularioRegistroProps {
  treinos: Treino[];
  aoSalvar: (dados: {
    treinoId: string;
    data: string;
    duracaoMinutos: number;
    cargaTotal: number;
    observacoes?: string;
  }) => void;
}

interface ErrosFormulario {
  treinoId?: string;
  data?: string;
  duracaoMinutos?: string;
  cargaTotal?: string;
}

/**
 * Formulário controlado "na mão" (sem bibliotecas de formulário), para
 * fins didáticos: cada campo é um useState, a validação roda no submit,
 * e os erros são associados aos campos via aria-describedby.
 */
export function FormularioRegistro({ treinos, aoSalvar }: FormularioRegistroProps) {
  const idTreino = useId();
  const idData = useId();
  const idDuracao = useId();
  const idCarga = useId();
  const idObservacoes = useId();

  const [treinoId, setTreinoId] = useState('');
  const [data, setData] = useState(() => new Date().toISOString().slice(0, 10));
  const [duracaoMinutos, setDuracaoMinutos] = useState('');
  const [cargaTotal, setCargaTotal] = useState('');
  const [observacoes, setObservacoes] = useState('');
  const [erros, setErros] = useState<ErrosFormulario>({});
  const [mensagemSucesso, setMensagemSucesso] = useState(false);

  function validar(): ErrosFormulario {
    const novosErros: ErrosFormulario = {};

    if (!treinoId) {
      novosErros.treinoId = 'Selecione um treino.';
    }

    if (!data) {
      novosErros.data = 'Informe a data do treino.';
    }

    const duracaoNumero = Number(duracaoMinutos);
    if (!duracaoMinutos || Number.isNaN(duracaoNumero) || duracaoNumero <= 0) {
      novosErros.duracaoMinutos = 'A duração precisa ser maior que zero.';
    }

    const cargaNumero = Number(cargaTotal);
    if (cargaTotal === '' || Number.isNaN(cargaNumero) || cargaNumero < 0) {
      novosErros.cargaTotal = 'A carga total não pode ser negativa.';
    }

    return novosErros;
  }

  function aoSubmeter(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault();
    const novosErros = validar();
    setErros(novosErros);
    setMensagemSucesso(false);

    if (Object.keys(novosErros).length > 0) {
      return;
    }

    aoSalvar({
      treinoId,
      data,
      duracaoMinutos: Number(duracaoMinutos),
      cargaTotal: Number(cargaTotal),
      observacoes: observacoes.trim() || undefined,
    });

    setTreinoId('');
    setData(new Date().toISOString().slice(0, 10));
    setDuracaoMinutos('');
    setCargaTotal('');
    setObservacoes('');
    setMensagemSucesso(true);
  }

  return (
    <form className="formulario" onSubmit={aoSubmeter} noValidate>
      <div className="formulario__campo">
        <label htmlFor={idTreino}>Treino concluído</label>
        <select
          id={idTreino}
          value={treinoId}
          onChange={(e) => setTreinoId(e.target.value)}
          aria-invalid={Boolean(erros.treinoId)}
          aria-describedby={erros.treinoId ? `${idTreino}-erro` : undefined}
        >
          <option value="">Selecione...</option>
          {treinos.map((treino) => (
            <option key={treino.id} value={treino.id}>
              {treino.titulo}
            </option>
          ))}
        </select>
        {erros.treinoId && (
          <p id={`${idTreino}-erro`} className="formulario__erro" role="alert">
            {erros.treinoId}
          </p>
        )}
      </div>

      <div className="formulario__campo">
        <label htmlFor={idData}>Data</label>
        <input
          id={idData}
          type="date"
          value={data}
          onChange={(e) => setData(e.target.value)}
          aria-invalid={Boolean(erros.data)}
          aria-describedby={erros.data ? `${idData}-erro` : undefined}
        />
        {erros.data && (
          <p id={`${idData}-erro`} className="formulario__erro" role="alert">
            {erros.data}
          </p>
        )}
      </div>

      <div className="formulario__campo">
        <label htmlFor={idDuracao}>Duração (minutos)</label>
        <input
          id={idDuracao}
          type="number"
          min={1}
          value={duracaoMinutos}
          onChange={(e) => setDuracaoMinutos(e.target.value)}
          aria-invalid={Boolean(erros.duracaoMinutos)}
          aria-describedby={erros.duracaoMinutos ? `${idDuracao}-erro` : undefined}
        />
        {erros.duracaoMinutos && (
          <p id={`${idDuracao}-erro`} className="formulario__erro" role="alert">
            {erros.duracaoMinutos}
          </p>
        )}
      </div>

      <div className="formulario__campo">
        <label htmlFor={idCarga}>Carga total (kg)</label>
        <input
          id={idCarga}
          type="number"
          min={0}
          step="0.5"
          value={cargaTotal}
          onChange={(e) => setCargaTotal(e.target.value)}
          aria-invalid={Boolean(erros.cargaTotal)}
          aria-describedby={erros.cargaTotal ? `${idCarga}-erro` : undefined}
        />
        {erros.cargaTotal && (
          <p id={`${idCarga}-erro`} className="formulario__erro" role="alert">
            {erros.cargaTotal}
          </p>
        )}
      </div>

      <div className="formulario__campo">
        <label htmlFor={idObservacoes}>Observações (opcional)</label>
        <textarea
          id={idObservacoes}
          value={observacoes}
          onChange={(e) => setObservacoes(e.target.value)}
          rows={3}
        />
      </div>

      <button type="submit" className="botao botao--primario">
        Salvar registro
      </button>

      {mensagemSucesso && (
        <p className="formulario__sucesso" role="status">
          Registro salvo com sucesso!
        </p>
      )}
    </form>
  );
}
