// HealthDock テーマ定数（配色・フォント）。色を変えるときはここだけ編集する。
// 白い文字を載せる色（main）は、読みやすさのためこの濃さを下回らないこと。
window.HD_THEME = {
  people: {
    kenta: { name: 'Kenta', main: '#B85410', soft: '#FBEBDD', border: '#E5C5A8', field: '#FEF6EE' },
    saori: { name: 'Saori', main: '#2E7D4F', soft: '#E1F1E7', border: '#B5D3C0', field: '#F2FAF5' },
  },
  app: { bg: '#F6F3EE', card: '#FFFFFF', ink: '#1F2A33', inkSoft: '#5E6A73' },
  aya: { accent: '#2F6FB0', done: '#2E8B57' },
  // タオル取り替えカード：通常（1〜2日目）／注意（3日目）／警告（4日目以降）
  towel: {
    normal: { bg: '#FFFFFF', border: '#CFC7BA', ink: '#1F2A33' },
    warn: { bg: '#FFF3C4', border: '#D9A400', ink: '#4A3800' },
    alert: { bg: '#FDE3DF', border: '#C0392B', ink: '#5E1A12' },
  },
  font: "'Zen Maru Gothic', -apple-system, BlinkMacSystemFont, 'Hiragino Sans', 'Noto Sans JP', sans-serif",
};

(function applyTheme(t) {
  const s = document.documentElement.style;
  for (const [key, p] of Object.entries(t.people)) {
    s.setProperty(`--${key}`, p.main);
    s.setProperty(`--${key}-soft`, p.soft);
    s.setProperty(`--${key}-border`, p.border);
    s.setProperty(`--${key}-field`, p.field);
  }
  s.setProperty('--bg', t.app.bg);
  s.setProperty('--card', t.app.card);
  s.setProperty('--ink', t.app.ink);
  s.setProperty('--ink-soft', t.app.inkSoft);
  s.setProperty('--aya', t.aya.accent);
  s.setProperty('--aya-done', t.aya.done);
  for (const [level, c] of Object.entries(t.towel)) {
    s.setProperty(`--towel-${level}-bg`, c.bg);
    s.setProperty(`--towel-${level}-border`, c.border);
    s.setProperty(`--towel-${level}-ink`, c.ink);
  }
  s.setProperty('--font', t.font);
})(window.HD_THEME);
