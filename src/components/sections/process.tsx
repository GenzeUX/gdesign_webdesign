import { process } from '@/content/studio';
import { SectionIntro } from '../ui';
export function Process() {
  return (
    <section className="section process container">
      <SectionIntro label="Как мы работаем" title="Понятный процесс. Продуманный результат." />
      <div className="process-list">
        <div className="process-line">
          <span />
        </div>
        {process.map(([title, text], i) => (
          <div className="process-step" key={title}>
            <span className="step-number">0{i + 1}</span>
            <h3>{title}</h3>
            <p>{text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
