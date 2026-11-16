import { restoredPreviews, type Project } from '@/content/projects';
export function ImageProvenance({ project }: { project: Project; compact?: boolean }) {
  if (!restoredPreviews[project.slug]) return null;
  return <p className="image-provenance">
    <a href={project.images[project.cover].src} target="_blank" rel="noreferrer">Открыть оригинал ↗</a>
  </p>;
}
