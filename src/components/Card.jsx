function Card({ title, children, right }) {
  return (
    <section className="rounded-2xl border border-surface-200 bg-white p-5 shadow-sm transition hover:shadow-md">
      {(title || right) && (
        <header className="mb-4 flex items-center justify-between">
          {title ? <h2 className="text-base font-semibold text-slate-800">{title}</h2> : <span />}
          {right}
        </header>
      )}
      {children}
    </section>
  );
}

export default Card;
