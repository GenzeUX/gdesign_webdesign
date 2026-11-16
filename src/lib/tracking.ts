export type StudioEvent = 'portfolio_view' | 'case_view' | 'contact_click' | 'form_start' | 'form_error' | 'lead_delivered' | 'telegram_draft_ready' | 'telegram_open';
export interface EventContext { page?: string; project?: string; service?: string; }
export function trackStudioEvent(name: StudioEvent, context: EventContext = {}) {
  if (typeof window === 'undefined') return;
  // Only allow known contextual fields. Never pass form values or URL query strings.
  window.dispatchEvent(new CustomEvent('studio:analytics', { detail: { name, context: {
    page: window.location.pathname,
    ...(context.project ? { project: context.project } : {}),
    ...(context.service ? { service: context.service } : {}),
  } } }));
}
