# TrilhaFit

Catálogo de treinos de academia com favoritos, tema claro/escuro, cronômetro
de treino, registro de treinos concluídos e dashboard de progresso.

Projeto didático construído com **React 19 + TypeScript**, servindo de base
prática para um tutorial de React moderno.

## Stack

- React 19 + TypeScript (modo estrito)
- Vite 8
- React Router 7 (`createBrowserRouter`, rotas aninhadas)
- TanStack Query 5
- Zustand 5 (com `persist`) para favoritos e registros
- Context API nativa para o tema claro/escuro
- Recharts (carregado via `React.lazy`)
- Vitest + Testing Library
- CSS puro com custom properties (design tokens) — sem Tailwind/UI kit

## Como rodar

```bash
npm install
npm run dev       # servidor de desenvolvimento
npm run build     # build de produção (tsc -b && vite build)
npm run test      # roda a suíte de testes (vitest)
npm run preview   # serve o build de produção localmente
```

## Estrutura

Veja `prompt-trilhafit-app.md` (na raiz, se presente) para a especificação
completa. Resumo da arquitetura em camadas:

```
public/api/treinos.json
    ↓
treinos.service.ts       → único lugar que chama fetch()
    ↓
useTreinos.ts             → hook React Query (cache)
    ↓
CatalogoPage               → página consumidora
    ↓
ListaTreinos → TreinoCard   → componentes visuais (TreinoCard com React.memo)
    ↓
useFavoritosStore (Zustand) → estado global persistido
useTema (Context)           → preferência de UI local
```

## Variáveis de ambiente

Veja `.env.example`. `VITE_API_BASE_URL` define a origem da API estática
(vazio = caminhos relativos, usado em dev/produção com `public/api/`).
