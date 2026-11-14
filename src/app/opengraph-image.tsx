import { ImageResponse } from 'next/og';
export const alt = 'G. DESIGN — Digital & AI Studio';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';
export default function Image() {
  return new ImageResponse(
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: 70,
        background: '#050507',
        color: '#F7F5FA',
        fontFamily: 'sans-serif',
      }}
    >
      <div style={{ display: 'flex', fontSize: 38 }}>
        G. DESIGN
      </div>
      <div style={{ display: 'flex', fontSize: 76, lineHeight: 1.1, maxWidth: 950 }}>
        Технологии, которые работают на ваш бизнес.
      </div>
      <div style={{ display: 'flex', fontSize: 20, color: '#C5A6FF' }}>DIGITAL × AI STUDIO</div>
    </div>,
    size,
  );
}
