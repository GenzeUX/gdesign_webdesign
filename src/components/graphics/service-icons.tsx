import type { ReactNode } from 'react';

function IconFrame({ children, kind }: { children: ReactNode; kind: string }) {
  return (
    <svg
      className="service-icon"
      data-icon={kind}
      viewBox="0 0 240 200"
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      {children}
    </svg>
  );
}

export function WebDevelopmentIcon() {
  return (
    <IconFrame kind="web">
      <g className="icon-layer icon-layer-back icon-muted">
        <rect x="25" y="29" width="143" height="104" rx="3" />
        <path d="M25 48h143M38 39h2m7 0h2m7 0h2" />
      </g>
      <g className="icon-layer icon-layer-middle">
        <rect className="icon-surface" x="45" y="48" width="157" height="109" rx="3" />
        <path d="M45 69h157M59 59h28" />
      </g>
      <g className="icon-layer icon-layer-front">
        <rect className="icon-surface" x="65" y="68" width="151" height="106" rx="3" />
        <path d="M65 90h151M78 79h3m7 0h3M80 108h51m-51 10h36m-36 23h30m-30 10h40" />
        <rect x="149" y="106" width="51" height="50" rx="1" />
        <path className="icon-trace" d="M150 68h63a3 3 0 0 1 3 3v49" />
        <path className="icon-accent" d="m161 143 10-11 10 5 9-15" />
        <circle className="icon-beacon" cx="190" cy="122" r="2.5" />
      </g>
    </IconFrame>
  );
}

export function DigitalProductsIcon() {
  return (
    <IconFrame kind="digital">
      <g className="icon-layer icon-layer-back icon-muted">
        <path d="m120 22 77 44v88l-77 44-77-44V66zM43 66l77 44 77-44M120 110v88" />
        <path strokeDasharray="3 6" d="m43 154 77-44 77 44M120 22v88" />
      </g>
      <g className="icon-layer icon-layer-front">
        <path className="icon-surface" d="m120 42 60 35v69l-60 35-60-35V77z" />
        <path d="m60 77 60 35 60-35M120 112v69M90 60l60 35v69M150 60 90 95v69M60 112l60 35 60-35" />
        <path className="icon-active-face" d="m120 112 60-35v69l-60 35z" />
        <path className="icon-trace" d="m60 77 60-35 60 35-60 35v69" />
        <circle className="icon-beacon" cx="120" cy="112" r="3" />
      </g>
    </IconFrame>
  );
}

export function TelegramContentIcon() {
  return (
    <IconFrame kind="telegram">
      <g className="icon-layer icon-layer-back icon-muted">
        <path d="M36 99c0-42 38-73 84-73s84 31 84 73-38 73-84 73-84-31-84-73Z" />
        <path d="M58 99c0-31 28-54 62-54s62 23 62 54-28 54-62 54-62-23-62-54Z" />
      </g>
      <g className="icon-layer icon-layer-front">
        <path d="M41 100h42m74 0h42M120 31v35m0 68v35" />
        <path className="icon-surface" d="m120 68 29 16v32l-29 16-29-16V84z" />
        <path d="m91 84 29 16 29-16m-29 16v32" />
        <circle cx="35" cy="100" r="5" />
        <circle cx="205" cy="100" r="5" />
        <circle cx="120" cy="25" r="5" />
        <circle cx="120" cy="175" r="5" />
        <path className="icon-trace" d="M41 100h42m74 0h42M120 31v35m0 68v35" />
        <circle className="icon-beacon" cx="120" cy="100" r="3" />
        <path className="icon-accent" d="M63 53c15-14 35-21 57-21m57 116c-15 14-35 21-57 21" />
      </g>
    </IconFrame>
  );
}

export function AIAutomationIcon() {
  return (
    <IconFrame kind="ai">
      <g className="icon-layer icon-layer-back icon-muted">
        <path d="m120 25 66 38v74l-66 38-66-38V63zM54 63l132 74M186 63 54 137M120 25v150" />
        <path strokeDasharray="3 6" d="m87 44 66 112M153 44 87 156M54 100h132" />
      </g>
      <g className="icon-layer icon-layer-front">
        <path d="m120 25 0 58m66-20-51 29m51 45-51-29m-15 67v-58m-66 20 51-29M54 63l51 29" />
        <circle className="icon-surface" cx="120" cy="100" r="18" />
        <circle cx="120" cy="25" r="5" />
        <circle cx="186" cy="63" r="5" />
        <circle cx="186" cy="137" r="5" />
        <circle cx="120" cy="175" r="5" />
        <circle cx="54" cy="137" r="5" />
        <circle cx="54" cy="63" r="5" />
        <circle className="icon-accent" cx="120" cy="100" r="9" />
        <circle className="icon-beacon" cx="120" cy="100" r="3.5" />
        <path className="icon-trace" d="m120 25 0 58m15 25 51 29m-81-29-51 29" />
      </g>
    </IconFrame>
  );
}

export function ServiceIcon({ kind }: { kind: string }) {
  switch (kind) {
    case 'web':
      return <WebDevelopmentIcon />;
    case 'digital':
      return <DigitalProductsIcon />;
    case 'telegram':
      return <TelegramContentIcon />;
    case 'ai':
      return <AIAutomationIcon />;
    default:
      return null;
  }
}
