import { createBrowserRouter } from 'react-router-dom';
import { App } from '../App';
import { HomePage } from '../features/treinos/pages/HomePage';
import { CatalogoPage } from '../features/treinos/pages/CatalogoPage';
import { CategoriaPage } from '../features/treinos/pages/CategoriaPage';
import { TreinoDetalhePage } from '../features/treinos/pages/TreinoDetalhePage';
import { RegistroPage } from '../features/treinos/pages/RegistroPage';
import { DashboardPage } from '../features/treinos/pages/DashboardPage';
import { FavoritosPage } from '../features/treinos/pages/FavoritosPage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'treinos', element: <CatalogoPage /> },
      { path: 'treinos/categoria/:categoria', element: <CategoriaPage /> },
      { path: 'treinos/:slug', element: <TreinoDetalhePage /> },
      { path: 'registro', element: <RegistroPage /> },
      { path: 'dashboard', element: <DashboardPage /> },
      { path: 'favoritos', element: <FavoritosPage /> },
    ],
  },
]);
