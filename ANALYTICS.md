# Measurement before traffic launch

Vercel Web Analytics is integrated with @vercel/analytics 2.0.1. It is intentionally off on previews and local development. It records only production visits when NEXT_PUBLIC_ANALYTICS_ENABLED=true. Enable Web Analytics in the Vercel dashboard before turning on that flag and rebuilding. Dashboard activation is not performed by adding the package. Do not upgrade the account to enable paid features without the owner's approval.

Vercel custom events require an eligible Pro/Enterprise plan. NEXT_PUBLIC_ANALYTICS_CUSTOM_EVENTS defaults to false. Browser events are instrumented and available through the studio:analytics CustomEvent bridge, but are not persisted as custom events on a Hobby plan. This is preparation for event measurement, not a claim that a conversion dashboard is already collecting data.

| Event | Trigger | Meaning |
|---|---|---|
| portfolio_view | Portfolio block enters view | Exposure to work examples |
| case_view | Opening a case page | Interest in a project |
| contact_click | Clicking a contact anchor | Contact intent |
| form_start | First form interaction | Brief started |
| form_error | Failed validation or delivery | Friction |
| telegram_draft_ready | Brief prepared locally | Prepared message, NOT a delivered lead |
| telegram_open | Clicking a Telegram link | Handoff intent, NOT confirmed sending |
| lead_delivered | Server confirms bot delivery | Actual confirmed delivery, only in configured bot mode |

Allowed context: pathname without query/hash, known project name/slug, known service. Names, contact addresses, message text and complete Telegram draft URLs must never enter analytics. Pageview URLs are stripped of query and hash before transmission. No form data is stored in browser persistence.

Primary questions after launch: which sources bring visitors to cases, which cases lead to contact, and which contacts become real conversations. Compare matching observation windows and segment mobile/desktop and traffic sources. With zero traffic, there is no conversion baseline yet. Do not count a Telegram click or draft preparation as a real lead; reconcile real conversations with the recipient.
