import { Button } from '@/components/ui';
export default function NotFound() {
  return (
    <section className="container not-found">
      <span className="eyebrow">404</span>
      <h1>
        Здесь пока
        <br />
        ничего нет.
      </h1>
      <p>Возможно, адрес изменился. Продолжим с главной?</p>
      <Button href="/">На главную</Button>
    </section>
  );
}
