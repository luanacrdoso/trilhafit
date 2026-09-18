import { Outlet } from 'react-router-dom';
import { Header } from './components/Header';

export function App() {
  return (
    <div className="app-shell">
      <Header />
      <main className="app-shell__main" id="conteudo-principal">
        <Outlet />
      </main>
      <footer className="rodape">
        <p>TrilhaFit — projeto didático construído com React 19 + TypeScript.</p>
      </footer>
    </div>
  );
}
