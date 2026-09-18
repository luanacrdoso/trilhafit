import { Link } from 'react-router-dom';
import { Loading } from '../../../components/Loading';
import { MensagemErro } from '../../../components/MensagemErro';
import { useTreinos } from '../hooks/useTreinos';
import { obterTreinosRecentes } from '../treinos.utils';
import { ListaTreinos } from '../components/ListaTreinos';

export function HomePage() {
  const { data: treinos, isLoading, isError, refetch } = useTreinos();

  return (
    <div className="pagina">
      <section className="hero">
        <div className="hero__conteudo">
          <span className="hero__eyebrow">Catálogo de treinos</span>
          <h1 className="hero__titulo">
            Sua próxima <span className="hero__titulo-destaque">trilha</span> até o recorde
            pessoal.
          </h1>
          <p className="hero__subtitulo">
            Explore treinos de força, cardio e mobilidade, cronometre suas séries e acompanhe
            sua evolução — tudo em um só lugar.
          </p>
          <div className="hero__acoes">
            <Link to="/treinos" className="botao botao--primario">
              Explorar catálogo
            </Link>
            <Link to="/dashboard" className="botao botao--fantasma">
              Ver meu progresso
            </Link>
          </div>
        </div>
      </section>

      <section className="secao">
        <h2 className="secao__titulo">Adicionados recentemente</h2>

        {isLoading && <Loading rotulo="Carregando destaques..." />}
        {isError && (
          <MensagemErro
            detalhe="Não foi possível carregar os treinos em destaque."
            aoTentarNovamente={() => refetch()}
          />
        )}
        {treinos && <ListaTreinos treinos={obterTreinosRecentes(treinos)} />}
      </section>
    </div>
  );
}
