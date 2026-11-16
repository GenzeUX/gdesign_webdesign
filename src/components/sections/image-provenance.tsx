import { restoredPreviews, type Project } from '@/content/projects';
export function ImageProvenance({ project, compact = false }: { project: Project; compact?: boolean }) {
  if (!restoredPreviews[project.slug]) return null;
  return <p className="image-provenance">
    {compact ? 'AI-реставрация превью. ' : 'Превью восстановлено с помощью AI по исходному скриншоту. Мелкие детали могут отличаться. '}
    <a href={project.images[project.cover].src} target="_blank" rel="noreferrer">Открыть оригинал ↗</a>
  </p>;
}
