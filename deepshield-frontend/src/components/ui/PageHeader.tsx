import type { ReactNode } from "react";

export function PageHeader({
  title,
  subtitle,
  badge,
  children,
}: {
  title: string;
  subtitle?: string;
  badge?: string;
  children?: ReactNode;
}) {
  return (
    <header className="page-header mb-10">
      {badge && <p className="page-badge">{badge}</p>}
      <h1 className="font-display text-3xl font-semibold text-espresso md:text-4xl">
        {title}
      </h1>
      {subtitle && (
        <p className="mt-3 max-w-2xl text-base leading-relaxed text-espresso/75">
          {subtitle}
        </p>
      )}
      {children && <div className="mt-6">{children}</div>}
    </header>
  );
}
