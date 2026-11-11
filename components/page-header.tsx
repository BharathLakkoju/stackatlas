export function PageHeader({
  eyebrow,
  title,
  description,
}: {
  eyebrow?: string;
  title: string;
  description: string;
}) {
  return (
    <header className="mb-8 flex max-w-3xl flex-col gap-3">
      {eyebrow ? (
        <p className="text-xs font-medium tracking-[0.18em] text-muted-foreground uppercase">{eyebrow}</p>
      ) : null}
      <h1 className="font-heading text-3xl font-semibold tracking-tight md:text-4xl">{title}</h1>
      <p className="text-base text-muted-foreground md:text-lg">{description}</p>
    </header>
  );
}
