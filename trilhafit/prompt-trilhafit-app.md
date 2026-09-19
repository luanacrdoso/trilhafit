# Prompt — Gerar o app TrilhaFit (React + TypeScript)

Cole este prompt inteiro na ferramenta de vibe-coding escolhida. Ele descreve o app completo que serve de base prática para um tutorial de React moderno.

---

## Objetivo

Crie um aplicativo web chamado **TrilhaFit**: um catálogo de treinos de academia, com favoritos, tema claro/escuro, cronômetro de treino, registro de treinos concluídos e um dashboard de progresso. O projeto deve ser didático — arquitetura em camadas bem separada, tipada, testada, e comentada onde ajudar no aprendizado.

## Stack obrigatória

- **React 19** + **TypeScript** (modo estrito)
- **Vite 8** como bundler/dev server
- **React Router 7** (`createBrowserRouter`, rotas aninhadas)
- **TanStack Query 5** para dados assíncronos (fetch, cache, loading/error states)
- **Zustand 5** (com middleware `persist`) para o estado de favoritos
- **Context API** nativa do React para o tema claro/escuro (não usar Zustand aqui — é proposital, para efeito didático de contraste)
- **Recharts** para o gráfico do dashboard
- **Vitest** + **@testing-library/react** para testes
- CSS puro com custom properties (design tokens) — **sem Tailwind e sem UI kit**
- Dados servidos como **JSON estático** dentro de `public/api/` (sem backend real)

## Arquitetura em camadas (obrigatória, não pular etapas)

```
JSON (public/api/treinos.json)
    ↓
treinos.service.ts       → fetch + parse, único lugar que chama fetch()
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

Componentes **nunca** chamam `fetch` diretamente — sempre passam pela camada de serviço.

## Estrutura de pastas esperada

```
src/
  api/
    queryClient.ts
  components/
    Header.tsx
    CampoBusca.tsx
    Loading.tsx
    MensagemErro.tsx
    ErrorBoundary.tsx
  contexts/
    TemaContext.tsx
  features/
    treinos/
      types.ts
      treinos.service.ts
      treinos.utils.ts
      hooks/
        useTreinos.ts
        useTreinoPorSlug.ts
        useDebounce.ts
      store/
        favoritos.store.ts
      pages/
        HomePage.tsx
        CatalogoPage.tsx
        CategoriaPage.tsx
        TreinoDetalhePage.tsx
        RegistroPage.tsx
        DashboardPage.tsx
        FavoritosPage.tsx
      components/
        TreinoCard.tsx
        ListaTreinos.tsx
        Cronometro.tsx
        FormularioRegistro.tsx
        GraficoProgresso.tsx (lazy)
  routes/
    router.tsx
  main.tsx
  App.tsx
public/
  api/
    treinos.json
```

## Modelo de dados

```ts
type GrupoMuscular = 'peito' | 'costas' | 'pernas' | 'ombros' | 'bracos' | 'core' | 'cardio';
type Nivel = 'iniciante' | 'intermediario' | 'avancado';
type Categoria = 'forca' | 'cardio' | 'mobilidade';

interface Exercicio {
  id: string;
  nome: string;
  series: number;
  repeticoes: number;
  descansoSegundos: number;
}

interface Treino {
  id: string;
  slug: string;
  titulo: string;
  categoria: Categoria;
  grupoMuscular: GrupoMuscular[];
  nivel: Nivel;
  duracaoMinutos: number;
  descricao: string;
  exercicios: Exercicio[];
  imagemUrl: string;
}

interface RegistroTreino {
  id: string;
  treinoId: string;
  data: string; // ISO
  duracaoMinutos: number;
  cargaTotal: number; // kg
  observacoes?: string;
}
```

Popule `public/api/treinos.json` com pelo menos **20 treinos** variados entre as 3 categorias, com nomes, grupos musculares e níveis plausíveis (em português).

## Páginas e funcionalidades

**HomePage** — hero + destaques (últimos treinos adicionados), consumindo `useTreinos()`, tratando `isLoading`/`isError`.

**CatalogoPage** — busca em tempo real por título, grupo muscular e nível, com `useMemo` para o filtro e `useDebounce` (300ms) no termo de busca.

**CategoriaPage** — lista treinos filtrados por categoria (`forca` | `cardio` | `mobilidade`), rota `/treinos/categoria/:categoria`.

**TreinoDetalhePage** (rota `/treinos/:slug`) — mostra todos os exercícios do treino e um **Cronômetro** funcional:
- Botões iniciar / pausar / zerar
- Implementado com `useEffect` + `setInterval`, com **cleanup obrigatório** no `return` do efeito
- Contagem em `mm:ss`

**RegistroPage** — formulário **controlado** para registrar um treino concluído (data, duração, carga total, observações):
- Validação client-side (campos obrigatórios, duração > 0, carga ≥ 0)
- Mensagens de erro acessíveis via `aria-describedby`
- Ao salvar, persiste em memória/localStorage simples (pode ser um segundo store Zustand `registros.store.ts`)

**DashboardPage** — gráfico de evolução (carga total por semana) usando Recharts:
- O componente `GraficoProgresso` deve ser carregado com `React.lazy` + `Suspense` (fallback = `Loading`)
- Envolvido por um `ErrorBoundary` que mostra uma mensagem amigável se o componente do gráfico quebrar (ex: dados malformados)

**FavoritosPage** — lista treinos favoritados (Zustand + `persist`, sem prop drilling — acessado no Header, no TreinoCard e aqui).

**Header** — navegação com `NavLink` ativo, contador de favoritos, e um toggle de tema claro/escuro consumindo o `TemaContext`.

## Requisitos técnicos específicos (não pular)

1. **`useEffect` genuíno** no Cronômetro — não usar apenas React Query como desculpa para nunca mostrar `useEffect`.
2. **Context API real** para tema — `TemaContext.tsx` com provider no topo da árvore, hook `useTema()`, aplicando uma classe/atributo no `<html>` ou `<body>` para trocar as variáveis CSS.
3. **`React.memo`** no `TreinoCard` e **`useCallback`** na função de favoritar passada como prop, para evitar re-render desnecessário da lista inteira.
4. **Code-splitting real**: pelo menos o `GraficoProgresso` (e idealmente as páginas de rota) carregado com `React.lazy` + `Suspense`.
5. **Error Boundary** de verdade (classe ou biblioteca leve), diferenciando erro de dados (`isError` do React Query) de erro de renderização.
6. **Formulário controlado** com validação — não usar bibliotecas de formulário, para fins didáticos (o objetivo é ensinar o padrão manual).
7. **Testes desde o início**, não só ao final: pelo menos
   - um teste de função pura em `treinos.utils.ts`
   - um teste de componente (`CampoBusca` ou `TreinoCard`)
   - um teste do store Zustand de favoritos
   - um teste do `useDebounce` com fake timers
8. **Acessibilidade**: `useId` nos campos de formulário, `aria-pressed` no botão de favoritar, `alt` descritivo em imagens, `aria-describedby` nos erros de validação.
9. **Variáveis de ambiente**: usar `import.meta.env` para pelo menos uma configuração (ex: URL base da API estática), com `.env.example` documentado.

## Estilo visual

- Paleta com tema claro e escuro, controlada por CSS custom properties (`:root` e um seletor `[data-tema="claro"]` ou `.tema-claro`)
- Tipografia: Inter (texto) + JetBrains Mono (código/números do cronômetro)
- Visual limpo, cards com sombra sutil, bordas arredondadas — mesma linguagem visual de um design system esportivo/energético (verde ou laranja como cor de destaque)

## Critérios de aceite

- `npm run dev` sobe o app sem erros de TypeScript
- `npm run build` gera build de produção sem warnings críticos
- `npm run test` roda a suíte de testes com sucesso
- Todas as rotas navegáveis pelo Header
- Favoritos persistem após reload da página
- Tema persiste após reload (pode usar localStorage também, separado do Zustand)
- Cronômetro conta corretamente e não vaza memória ao sair da página (cleanup funcionando)

---

*Este app serve de base prática para um tutorial de React moderno — mantenha o código didático, com nomes claros em português para o domínio (treino, exercicio, registro) e em inglês apenas para termos técnicos convencionais (hooks, props, state).*
