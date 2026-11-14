import Link from 'next/link';
export function PageHero({
  label,
  title,
  description,
}: {
  label: string;
  title: string;
  description: string;
}) {
  return (
    <section className="page-hero container">
      <div className="breadcrumb">
        <Link href="/">Главная</Link>
        <span>/</span>
        <span>{label}</span>
      </div>
      <span className="eyebrow">
        <i />
        {label}
      </span>
      <h1>{title}</h1>
      <p>{description}</p>
    </section>
  );
}
