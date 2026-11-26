import Link from "next/link";

interface Crumb {
  label: string;
  href?: string;
}

export function Breadcrumbs({ items }: { items: Crumb[] }) {
  return (
    <nav aria-label="Breadcrumb" className="mb-4 text-[15px] text-muted">
      <ol className="flex flex-wrap items-center gap-2">
        {items.map((item, idx) => (
          <li key={item.label} className="inline-flex items-center gap-2">
            {idx > 0 && <span aria-hidden="true">/</span>}
            {item.href ? (
              <Link href={item.href} className="font-semibold text-ink hover:underline underline-offset-4">
                {item.label}
              </Link>
            ) : (
              <span aria-current="page">{item.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
