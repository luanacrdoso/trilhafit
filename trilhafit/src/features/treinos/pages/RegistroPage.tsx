import { Loading } from '../../../components/Loading';
import { MensagemErro } from '../../../components/MensagemErro';
import { FormularioRegistro } from '../components/FormularioRegistro';
import { useTreinos } from '../hooks/useTreinos';
import { useRegistrosStore } from '../store/registros.store';

export function RegistroPage() {
  const { data: treinos, isLoading, isError, refetch } = useTreinos();
  const adicionarRegistro = useRegistrosStore((estado) => estado.adicionarRegistro);
  const registros = useRegistrosStore((estado) => estado.registros);

  return (
    <div className="pagina">
      <header className="pagina__cabecalho">
        <h1>Registrar treino concluído</h1>
        <p>Guarde a data, duração e carga total para acompanhar sua evolução no dashboard.</p>
      </header>

      {isLoading && <Loading rotulo="Carregando treinos..." />}
      {isError && (
        <MensagemErro
          detalhe="Não foi possível carregar a lista de treinos para o formulário."
          aoTentarNovamente={() => refetch()}
        />
      )}
      {treinos && <FormularioRegistro treinos={treinos} aoSalvar={adicionarRegistro} />}

      {registros.length > 0 && (
        <section className="secao">
          <h2 className="secao__titulo">Últimos registros</h2>
          <ul className="lista-registros">
            {[...registros]
              .reverse()
              .slice(0, 5)
              .map((registro) => {
                const treino = treinos?.find((t) => t.id === registro.treinoId);
                return (
                  <li key={registro.id} className="lista-registros__item">
                    <span>{treino?.titulo ?? 'Treino removido'}</span>
                    <span>{new Date(registro.data).toLocaleDateString('pt-BR')}</span>
                    <span>{registro.duracaoMinutos} min</span>
                    <span>{registro.cargaTotal} kg</span>
                  </li>
                );
              })}
          </ul>
        </section>
      )}
    </div>
  );
}
