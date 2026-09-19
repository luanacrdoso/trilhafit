interface LoadingProps {
  rotulo?: string;
}

export function Loading({ rotulo = 'Carregando...' }: LoadingProps) {
  return (
    <div className="loading" role="status" aria-live="polite">
      <span className="loading__spinner" aria-hidden="true" />
      <span>{rotulo}</span>
    </div>
  );
}
