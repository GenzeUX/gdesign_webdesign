'use client';
import { useEffect, useRef, useState } from 'react';
import { ArrowRight, Check, Database, FileText, MessageSquare, Pause, Play, ShieldCheck } from 'lucide-react';

const scenarios = [
  { name: 'Входящие заявки', message: 'Хочу обсудить сайт для компании', analysis: 'Запрос на веб-разработку', tags: ['Новый проект', 'Разработка сайта'], route: 'Создать заявку в CRM', detail: 'Запрос и контакты — в одной карточке', response: 'Заявка структурирована. Команда подключается к обсуждению.', benefit: 'Меньше ручного переноса данных' },
  { name: 'Поддержка клиентов', message: 'Где найти документы по заказу?', analysis: 'Запрос клиентской поддержки', tags: ['Документы', 'Действующий клиент'], route: 'Найти ответ в базе знаний', detail: 'Ответ с опорой на материалы компании', response: 'Ответ подготовлен. При сложном вопросе подключается специалист.', benefit: 'Повторяющиеся вопросы — по готовому сценарию' },
  { name: 'Работа с документами', message: 'Выдели условия из договора', analysis: 'Извлечение ключевых условий', tags: ['Договор', 'Ключевые условия'], route: 'Подготовить структурированный черновик', detail: 'Условия собраны для проверки сотрудником', response: 'Черновик собран. Финальная проверка остаётся за человеком.', benefit: 'Меньше времени на первичный разбор' },
];

export function AIFlow() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const scene = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const element = scene.current;
    if (!element) return;
    let visible = false;
    const update = () => { element.dataset.running = String(visible && !document.hidden); };
    const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; update(); }, { threshold: 0.1 });
    observer.observe(element);
    document.addEventListener('visibilitychange', update);
    return () => { observer.disconnect(); document.removeEventListener('visibilitychange', update); };
  }, []);
  const scenario = scenarios[active];
  return (
    <div className="flow-demo" ref={scene} data-running="false" data-paused={paused}>
      <div className="flow-toolbar">
        <span className="flow-caption"><span /> AI / В РАБОТЕ</span>
        <button className="flow-pause" aria-label={paused ? 'Продолжить анимацию AI-сценария' : 'Приостановить анимацию AI-сценария'} aria-pressed={paused} onClick={() => setPaused(!paused)}>
          {paused ? <Play size={15} aria-hidden="true" /> : <Pause size={15} aria-hidden="true" />}<span>{paused ? 'Продолжить' : 'Пауза'}</span>
        </button>
      </div>
      <div className="flow-tabs" role="tablist" aria-label="Примеры AI-сценариев">
        {scenarios.map((s, i) => (
          <button key={s.name} role="tab" id={`scenario-${i}`} aria-controls="flow-panel" aria-selected={i === active} tabIndex={i === active ? 0 : -1}
            onKeyDown={(e) => {
              let next = i;
              if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') next = (i + (e.key === 'ArrowRight' ? 1 : scenarios.length - 1)) % scenarios.length;
              else if (e.key === 'Home') next = 0;
              else if (e.key === 'End') next = scenarios.length - 1;
              else return;
              e.preventDefault(); setActive(next); document.getElementById(`scenario-${next}`)?.focus();
            }} onClick={() => setActive(i)}><span className="flow-tab-index" aria-hidden="true">0{i + 1}</span>{s.name}</button>
        ))}
      </div>
      <div key={active} className="flow-body" role="tabpanel" id="flow-panel" aria-labelledby={`scenario-${active}`} tabIndex={0}>
        <div className="flow-message">
          <div className="flow-node-label"><MessageSquare size={17} aria-hidden="true" /><span>Входящее сообщение</span><i aria-hidden="true" /></div>
          <p>{scenario.message}</p>
          <div className="flow-message-footer"><span>Запрос клиента</span><Check size={14} aria-hidden="true" /></div>
        </div>
        <div className="flow-connect" aria-hidden="true"><span /><ArrowRight size={17} /></div>
        <div className="ai-core">
          <div className="core-orbit" aria-hidden="true">
            <span className="orbit-track orbit-track-one"><i /></span><span className="orbit-track orbit-track-two"><i /></span><span className="orbit-ticks" />
            <div className="core-halo" />
            <div className="core-mark">G<span>.</span></div>
            <span className="core-satellite satellite-one"><FileText size={14} /></span><span className="core-satellite satellite-two"><Database size={14} /></span>
          </div>
          <span>AI-анализ</span><small>{scenario.analysis}</small>
          <div className="flow-tags">{scenario.tags.map(tag => <span key={tag}>{tag}</span>)}</div>
        </div>
        <div className="flow-connect flow-connect-out" aria-hidden="true"><span /><ArrowRight size={17} /></div>
        <div className="flow-output">
          <div className="flow-result-card">
            <div className="flow-node-label"><Database size={17} aria-hidden="true" /><span>Результат обработки</span><Check size={15} aria-hidden="true" /></div>
            <p>{scenario.route}</p><small>{scenario.detail}</small>
            <div className="flow-data-lines" aria-hidden="true"><span /><span /><span /></div>
          </div>
          <div className="flow-human-check"><ShieldCheck size={18} aria-hidden="true" /><p>Контроль остаётся у человека</p></div>
        </div>
        <div className="flow-response"><span className="flow-response-icon"><Check size={18} aria-hidden="true" /></span><div><strong>{scenario.benefit}</strong><span>{scenario.response}</span></div></div>
      </div>
      <p className="flow-note">Пример сценария. Подключения и правила обработки определяем под вашу задачу.</p>
    </div>
  );
}
