export default function CategoryFilter({ categorias, categoriaActiva, onSelect }) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4 sm:mx-0 sm:px-0 sm:flex-wrap">
      <button
        onClick={() => onSelect(null)}
        className={`shrink-0 text-sm font-medium px-4 py-1.5 rounded-full border whitespace-nowrap ${
          !categoriaActiva
            ? 'bg-indigo text-lino border-indigo'
            : 'border-ink/20 text-ink/70 hover:border-ink/40'
        }`}
      >
        Todo
      </button>
      {categorias.map((c) => (
        <button
          key={c.id}
          onClick={() => onSelect(c.slug)}
          className={`shrink-0 text-sm font-medium px-4 py-1.5 rounded-full border whitespace-nowrap ${
            categoriaActiva === c.slug
              ? 'bg-indigo text-lino border-indigo'
              : 'border-ink/20 text-ink/70 hover:border-ink/40'
          }`}
        >
          {c.nombre}
        </button>
      ))}
    </div>
  )
}