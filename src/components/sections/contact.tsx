import { ContactForm } from './contact-form';
export function Contact({ project, service }: { project?: string; service?: string }) {
  const deliveryReady = process.env.CONTACT_DELIVERY === 'bot' && Boolean(
    process.env.TELEGRAM_BOT_TOKEN && process.env.TELEGRAM_CHAT_ID,
  );
  return <ContactForm project={project} service={service} deliveryReady={deliveryReady} />;
}
