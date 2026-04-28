import Button from './Button';

const CAPTCHA_CHARS = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';

function randomFrom(list) {
  return list[Math.floor(Math.random() * list.length)];
}

function createCaptchaCode(length = 6) {
  return Array.from({ length }, () => randomFrom(CAPTCHA_CHARS)).join('');
}

function createLine(index) {
  const colors = ['#0f766e', '#1d4ed8', '#7c3aed', '#b45309', '#be123c'];

  return {
    x1: 12 + index * 24 + Math.floor(Math.random() * 20),
    y1: 12 + Math.floor(Math.random() * 44),
    x2: 48 + index * 26 + Math.floor(Math.random() * 24),
    y2: 24 + Math.floor(Math.random() * 40),
    color: randomFrom(colors),
  };
}

function createDot() {
  return {
    cx: 10 + Math.floor(Math.random() * 220),
    cy: 8 + Math.floor(Math.random() * 52),
    r: 1 + Math.floor(Math.random() * 3),
    opacity: (0.18 + Math.random() * 0.24).toFixed(2),
  };
}

export function createCaptchaChallenge() {
  const code = createCaptchaCode();

  return {
    answer: code,
    chars: code.split('').map((char, index) => ({
      char,
      x: 18 + index * 34,
      y: 38 + Math.floor(Math.random() * 10),
      rotate: -16 + Math.floor(Math.random() * 33),
      color: randomFrom(['#0f172a', '#1e3a8a', '#0f766e', '#7c2d12', '#4c1d95']),
      size: 26 + Math.floor(Math.random() * 7),
    })),
    lines: Array.from({ length: 5 }, (_, index) => createLine(index)),
    dots: Array.from({ length: 22 }, () => createDot()),
  };
}

function buildCaptchaImage(challenge) {
  const dotMarkup = challenge.dots
    .map(
      (dot) =>
        `<circle cx="${dot.cx}" cy="${dot.cy}" r="${dot.r}" fill="#94a3b8" fill-opacity="${dot.opacity}" />`,
    )
    .join('');

  const lineMarkup = challenge.lines
    .map(
      (line) =>
        `<line x1="${line.x1}" y1="${line.y1}" x2="${line.x2}" y2="${line.y2}" stroke="${line.color}" stroke-width="2" stroke-linecap="round" stroke-opacity="0.45" />`,
    )
    .join('');

  const textMarkup = challenge.chars
    .map(
      (item) =>
        `<text x="${item.x}" y="${item.y}" fill="${item.color}" font-family="Verdana, Arial, sans-serif" font-size="${item.size}" font-weight="700" transform="rotate(${item.rotate} ${item.x} ${item.y})">${item.char}</text>`,
    )
    .join('');

  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="240" height="64" viewBox="0 0 240 64" role="img" aria-label="Captcha image">
      <defs>
        <linearGradient id="captcha-bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#f8fafc" />
          <stop offset="100%" stop-color="#e2e8f0" />
        </linearGradient>
      </defs>
      <rect x="1" y="1" width="238" height="62" rx="14" fill="url(#captcha-bg)" stroke="#cbd5e1" />
      ${dotMarkup}
      ${lineMarkup}
      ${textMarkup}
    </svg>
  `;

  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}

function CaptchaField({ value, onChange, challenge, onRefresh, error }) {
  const captchaImage = buildCaptchaImage(challenge);

  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Captcha</p>
          <p className="mt-1 text-sm text-slate-700">Type the characters shown in the image.</p>
        </div>
        <Button type="button" onClick={onRefresh} className="bg-slate-700 px-3 py-2 hover:bg-slate-800">
          Refresh
        </Button>
      </div>

      <div className="mt-4 overflow-hidden rounded-2xl border border-slate-300 bg-white p-2 shadow-inner">
        <img src={captchaImage} alt="Captcha challenge" className="h-16 w-full object-cover" />
      </div>

      <label htmlFor="captcha" className="mb-1 mt-4 block text-sm font-medium text-slate-700">
        Enter captcha text
      </label>
      <input
        id="captcha"
        name="captcha"
        autoComplete="off"
        required
        value={value}
        onChange={onChange}
        className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm uppercase outline-none ring-brand-500 transition focus:ring"
        placeholder="Type the text from the image"
      />

      {error ? <p className="mt-2 text-sm text-red-600">{error}</p> : null}
    </div>
  );
}

export default CaptchaField;
