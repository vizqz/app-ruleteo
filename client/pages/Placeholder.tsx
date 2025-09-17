export default function Placeholder({ title }: { title: string }) {
  return (
    <div className="rounded-xl bg-card shadow-card border border-border/60 p-10 text-center">
      <h1 className="font-heading text-2xl mb-3">{title}</h1>
      <p className="text-muted-foreground">
        Esta página es un marcador de posición. Pide generar su contenido cuando estés listo.
      </p>
    </div>
  );
}
