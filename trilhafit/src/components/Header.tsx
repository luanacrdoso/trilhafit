import { NavLink } from 'react-router-dom';
import { useTema } from '../contexts/TemaContext';
import { useFavoritosStore } from '../features/treinos/store/favoritos.store';

const LINKS_NAV = [
  { para: '/', rotulo: 'Início', fim: true },
  { para: '/treinos', rotulo: 'Catálogo' },
  { para: '/registro', rotulo: 'Registrar' },
  { para: '/dashboard', rotulo: 'Dashboard' },
  { para: '/favoritos', rotulo: 'Favoritos' },
];

export function Header() {
  const { tema, alternarTema } = useTema();
  const totalFavoritos = useFavoritosStore((estado) => estado.favoritosIds.length);

  return (
    <header className="cabecalho">
      <div className="cabecalho__conteudo">
        <NavLink to="/" className="cabecalho__marca">
          <span className="cabecalho__marca-icone" aria-hidden="true">
            ⚡
          </span>
          TrilhaFit
        </NavLink>

        <nav className="cabecalho__nav" aria-label="Navegação principal">
          {LINKS_NAV.map((link) => (
            <NavLink
              key={link.para}
              to={link.para}
              end={link.fim}
              className={({ isActive }) =>
                isActive ? 'cabecalho__link cabecalho__link--ativo' : 'cabecalho__link'
              }
            >
              {link.rotulo}
              {link.para === '/favoritos' && totalFavoritos > 0 && (
                <span className="cabecalho__contador">{totalFavoritos}</span>
              )}
            </NavLink>
          ))}
        </nav>

        <button
          type="button"
          className="botao-tema"
          onClick={alternarTema}
          aria-pressed={tema === 'escuro'}
          aria-label={tema === 'claro' ? 'Ativar tema escuro' : 'Ativar tema claro'}
        >
          {tema === 'claro' ? '🌙' : '☀️'}
        </button>
      </div>
    </header>
  );
}
