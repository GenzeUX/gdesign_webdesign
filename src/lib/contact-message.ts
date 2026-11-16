export interface ContactDetails {
  name: string;
  contact: string;
  description: string;
  service: string;
  project?: string;
}
export function isContactAddress(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ||
    /^@?[a-zA-Z][a-zA-Z0-9_]{4,31}$/.test(value) ||
    /^https:\/\/t\.me\/[a-zA-Z][a-zA-Z0-9_]{4,31}$/.test(value) ||
    /^\+?[\d ()-]{10,25}$/.test(value);
}
export function contactMessage(details: ContactDetails) {
  return [
    'Здравствуйте! Хочу обсудить проект с G. DESIGN.',
    `Имя: ${details.name.trim()}`,
    `Контакт: ${details.contact.trim()}`,
    `Направление: ${details.service}`,
    details.project ? `Заинтересовал кейс: ${details.project}` : '',
    details.description.trim() ? `О проекте: ${details.description.trim()}` : '',
  ].filter(Boolean).join('\n');
}
export function telegramDraft(details: ContactDetails) {
  const url = new URL('https://t.me/gen_design');
  url.searchParams.set('text', contactMessage(details));
  return url.href;
}
