'use client';
import { useState } from 'react';
import { ArrowRight, Check, Database, MessageSquare, Workflow } from 'lucide-react';
const scenarios = [
  {
    name: 'Входящие заявки',
    message: 'Хочу обсудить сайт для компании',
    analysis: 'Запрос на веб-разработку',
    route: 'Создать заявку в CRM',
    response: 'Передаём задачу команде и уточняем детали.',
  },
  {
    name: 'Поддержка клиентов',
    message: 'Где найти документы по заказу?',
    analysis: 'Запрос клиентской поддержки',
    route: 'Найти ответ в базе знаний',
    response: 'Помогаем найти документ или подключаем специалиста.',
  },
  {
    name: 'Работа с документами',
    message: 'Выдели условия из договора',
    analysis: 'Извлечение ключевых условий',
    route: 'Подготовить структурированный черновик',
    response: 'Передаём результат сотруднику для проверки.',
  },
];
export function AIFlow() {
  const [active, setActive] = useState(0);
  const scenario = scenarios[active];
  return (
    <div className="flow-demo">
      <div className="flow-tabs" role="tablist" aria-label="Примеры AI-сценариев">
        {scenarios.map((s, i) => (
          <button
            key={s.name}
            role="tab"
            id={`scenario-${i}`}
            aria-controls="flow-panel"
            aria-selected={i === active}
            tabIndex={i === active ? 0 : -1}
            onKeyDown={(e) => {
              if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
                const next = (i + (e.key === 'ArrowRight' ? 1 : 2)) % 3;
                setActive(next);
                document.getElementById(`scenario-${next}`)?.focus();
              }
            }}
            onClick={() => setActive(i)}
          >
            {s.name}
          </button>
        ))}
      </div>
      <div
        className="flow-body"
        role="tabpanel"
        id="flow-panel"
        aria-labelledby={`scenario-${active}`}
      >
        <div className="flow-message">
          <MessageSquare size={18} />
          <span>Входящее сообщение</span>
          <p>{scenario.message}</p>
        </div>
        <div className="flow-connect">
          <span />
          <ArrowRight size={18} />
        </div>
        <div className="ai-core">
          <div className="core-mark">
            G<span>.</span>
          </div>
          <span>AI-анализ</span>
          <small>{scenario.analysis}</small>
        </div>
        <div className="flow-connect">
          <span />
          <ArrowRight size={18} />
        </div>
        <div className="flow-output">
          <div>
            <Database size={19} />
            <p>{scenario.route}</p>
            <Check size={15} />
          </div>
          <div>
            <Workflow size={19} />
            <p>Проверка и маршрутизация</p>
          </div>
        </div>
        <div key={active} className="flow-response">
          <span className="status-dot" />
          {scenario.response}
        </div>
      </div>
      <p className="flow-note">
        Иллюстрация возможного сценария. Конкретная логика зависит от задачи и подключённых систем.
      </p>
    </div>
  );
}
