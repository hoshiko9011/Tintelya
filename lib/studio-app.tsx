"use client";

import { useEffect, useMemo, useState, type CSSProperties } from "react";
import { parseHex, randomHex, bestTextOn, contrastRatio, contrastGrade } from "@/lib/color";
import {
  paletteAsCss,
  paletteAsJson,
  paletteAsLines,
  paletteAsTailwind,
} from "@/lib/export-palette";
import {
  defaultSeeds,
  generatePalette,
  HARMONIES,
  MOODS,
  newSeedId,
  PRESETS,
  SWATCHES,
  type Harmony,
  type Mood,
  type Palette,
  type Seed,
} from "@/lib/palette";

const HISTORY_KEY = "tintelya.history";
const MAX_HISTORY = 12;

type Saved = {
  id: string;
  at: number;
  seeds: string[];
  mood: Mood;
  harmony: Harmony;
};

type Device = "desktop" | "tablet" | "mobile";

const DEVICE_WIDTH: Record<Device, number | string> = {
  desktop: "100%",
  tablet: 720,
  mobile: 390,
};

function readHistory(): Saved[] {
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as Saved[];
    return Array.isArray(parsed) ? parsed.slice(0, MAX_HISTORY) : [];
  } catch {
    return [];
  }
}

function writeHistory(items: Saved[]) {
  localStorage.setItem(HISTORY_KEY, JSON.stringify(items.slice(0, MAX_HISTORY)));
}

async function copyText(label: string, text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}

function previewVars(p: Palette): CSSProperties {
  return {
    "--p": p.primary,
    "--s": p.secondary,
    "--a": p.accent,
    "--bg": p.background,
    "--sf": p.surface,
    "--el": p.elevated,
    "--tx": p.text,
    "--mu": p.muted,
    "--bd": p.border,
    "--ok": p.success,
    "--wn": p.warning,
    "--dn": p.danger,
    "--on-p": p.onPrimary,
    background: p.background,
    color: p.text,
  } as CSSProperties;
}

function Vessel({
  body,
  neck,
  glaze,
}: {
  body: string;
  neck: string;
  glaze: string;
}) {
  return (
    <svg viewBox="0 0 160 180" className="vessel" aria-hidden>
      <ellipse cx="80" cy="158" rx="36" ry="7" fill={glaze} opacity={0.35} />
      <path
        d="M50 72c0-28 60-28 60 0l-8 74c0 12-44 12-44 0z"
        fill={body}
      />
      <rect x="64" y="42" width="32" height="28" rx="3" fill={neck} />
      <ellipse cx="80" cy="42" rx="16" ry="5.5" fill={glaze} />
    </svg>
  );
}

const CONTRAST_PAIRS: { label: string; fg: keyof Palette; bg: keyof Palette }[] = [
  { label: "Body text", fg: "text", bg: "background" },
  { label: "Muted text", fg: "muted", bg: "background" },
  { label: "Text on surface", fg: "text", bg: "surface" },
  { label: "Primary on bg", fg: "primary", bg: "background" },
  { label: "Button label", fg: "onPrimary", bg: "primary" },
  { label: "Accent on bg", fg: "accent", bg: "background" },
];

export default function StudioApp() {
  const [seeds, setSeeds] = useState<Seed[]>(defaultSeeds);
  const [mood, setMood] = useState<Mood>("modern");
  const [harmony, setHarmony] = useState<Harmony>("custom");
  const [device, setDevice] = useState<Device>("desktop");
  const [history, setHistory] = useState<Saved[]>([]);
  const [hexDrafts, setHexDrafts] = useState<Record<string, string>>({});
  const [copied, setCopied] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    setHistory(readHistory());
  }, []);

  useEffect(() => {
    if (!toast) return;
    const t = window.setTimeout(() => setToast(null), 1800);
    return () => window.clearTimeout(t);
  }, [toast]);

  const palette = useMemo(
    () => generatePalette(
      seeds.map((s) => s.hex),
      mood,
      harmony,
    ),
    [seeds, mood, harmony],
  );

  function showToast(msg: string) {
    setToast(msg);
  }

  async function doCopy(label: string, text: string) {
    const ok = await copyText(label, text);
    if (ok) {
      showToast(`Copied ${label}`);
      setCopied(label);
      window.setTimeout(() => setCopied((c) => (c === label ? null : c)), 1400);
    } else {
      showToast("Clipboard unavailable");
    }
  }

  function updateSeed(id: string, hex: string) {
    setSeeds((prev) => prev.map((s) => (s.id === id ? { ...s, hex } : s)));
  }

  function onHexChange(id: string, value: string) {
    setHexDrafts((d) => ({ ...d, [id]: value }));
    const parsed = parseHex(value);
    if (parsed) updateSeed(id, parsed);
  }

  function onHexBlur(id: string, current: string) {
    setHexDrafts((d) => {
      const next = { ...d };
      delete next[id];
      return next;
    });
    const parsed = parseHex(hexDrafts[id] ?? current);
    if (parsed) updateSeed(id, parsed);
  }

  function addSeed() {
    if (seeds.length >= 5) return;
    setSeeds((prev) => [
      ...prev,
      { id: newSeedId(), hex: randomHex(), locked: false },
    ]);
  }

  function removeSeed(id: string) {
    if (seeds.length <= 1) return;
    setSeeds((prev) => prev.filter((s) => s.id !== id));
  }

  function toggleLock(id: string) {
    setSeeds((prev) =>
      prev.map((s) => (s.id === id ? { ...s, locked: !s.locked } : s)),
    );
  }

  function shuffle() {
    setSeeds((prev) =>
      prev.map((s) => (s.locked ? s : { ...s, hex: randomHex() })),
    );
  }

  function applyPreset(name: string) {
    const preset = PRESETS.find((p) => p.name === name);
    if (!preset) return;
    setSeeds(
      preset.seeds.map((hex) => ({ id: newSeedId(), hex, locked: false })),
    );
    setMood(preset.mood);
    setHarmony("custom");
  }

  function savePalette() {
    const item: Saved = {
      id: `h_${Date.now()}`,
      at: Date.now(),
      seeds: seeds.map((s) => s.hex),
      mood,
      harmony,
    };
    const next = [item, ...history.filter((h) => h.id !== item.id)].slice(
      0,
      MAX_HISTORY,
    );
    setHistory(next);
    writeHistory(next);
    showToast("Saved to this browser");
  }

  function restore(item: Saved) {
    setSeeds(item.seeds.map((hex) => ({ id: newSeedId(), hex, locked: false })));
    setMood(item.mood);
    setHarmony(item.harmony);
  }

  function removeHistory(id: string) {
    const next = history.filter((h) => h.id !== id);
    setHistory(next);
    writeHistory(next);
  }

  const seedHexes = seeds.map((s) => s.hex);
  const compact = device === "mobile";

  return (
    <div className="studio">
      {toast && <div className="toast" role="status">{toast}</div>}

      <header className="studio-header">
        <div className="studio-header-inner">
          <div className="brand">
            <div className="logo" aria-hidden>
              T
            </div>
            <div>
              <p className="eyebrow">Color studio</p>
              <h1>Tintelya</h1>
            </div>
          </div>
          <p className="tagline">
            Build website palettes from colors you already love. Live preview,
            WCAG contrast, and export-ready tokens.
          </p>
        </div>
      </header>

      <div className="studio-grid">
        <aside className="controls">
          <section>
            <div className="section-head">
              <h2>Seed colors</h2>
              <button
                type="button"
                className="btn ghost sm"
                onClick={addSeed}
                disabled={seeds.length >= 5}
              >
                + Add
              </button>
            </div>
            <div className="seed-list">
              {seeds.map((seed, index) => (
                <div key={seed.id} className="seed-row">
                  <label
                    className="seed-swatch"
                    style={{ backgroundColor: seed.hex }}
                  >
                    <span className="sr-only">Color {index + 1} picker</span>
                    <input
                      type="color"
                      value={seed.hex.toLowerCase()}
                      onChange={(e) =>
                        updateSeed(seed.id, e.target.value.toUpperCase())
                      }
                    />
                  </label>
                  <input
                    className="hex-input"
                    value={hexDrafts[seed.id] ?? seed.hex}
                    onChange={(e) => onHexChange(seed.id, e.target.value)}
                    onBlur={() => onHexBlur(seed.id, seed.hex)}
                    maxLength={7}
                    spellCheck={false}
                    aria-label={`Hex for color ${index + 1}`}
                  />
                  <button
                    type="button"
                    className="btn icon"
                    aria-label={seed.locked ? "Unlock color" : "Lock color"}
                    onClick={() => toggleLock(seed.id)}
                  >
                    {seed.locked ? "L" : "U"}
                  </button>
                  <button
                    type="button"
                    className="btn icon"
                    aria-label="Remove color"
                    disabled={seeds.length <= 1}
                    onClick={() => removeSeed(seed.id)}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2>Mood</h2>
            <div className="chip-row">
              {MOODS.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  title={item.hint}
                  className={mood === item.id ? "chip active" : "chip"}
                  onClick={() => setMood(item.id)}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </section>

          <section>
            <h2>Harmony</h2>
            <div className="chip-row">
              {HARMONIES.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  className={harmony === item.id ? "chip active" : "chip"}
                  onClick={() => setHarmony(item.id)}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </section>

          <section>
            <h2>Presets</h2>
            <div className="chip-row">
              {PRESETS.map((preset) => (
                <button
                  key={preset.name}
                  type="button"
                  className="chip preset"
                  onClick={() => applyPreset(preset.name)}
                >
                  <span className="preset-dots">
                    {preset.seeds.map((hex) => (
                      <span key={hex} style={{ backgroundColor: hex }} />
                    ))}
                  </span>
                  {preset.name}
                </button>
              ))}
            </div>
          </section>

          <div className="action-row">
            <button type="button" className="btn secondary" onClick={shuffle}>
              Shuffle
            </button>
            <button type="button" className="btn primary" onClick={savePalette}>
              Save
            </button>
          </div>

          <div className="action-row">
            <button
              type="button"
              className="btn outline"
              onClick={() => doCopy("HEX list", paletteAsLines(palette))}
            >
              HEX
            </button>
            <button
              type="button"
              className="btn outline"
              onClick={() => doCopy("CSS variables", paletteAsCss(palette))}
            >
              CSS
            </button>
            <button
              type="button"
              className="btn outline"
              onClick={() =>
                doCopy("Tailwind theme", paletteAsTailwind(palette))
              }
            >
              Tailwind
            </button>
            <button
              type="button"
              className="btn outline"
              onClick={() =>
                doCopy(
                  "JSON",
                  paletteAsJson(palette, {
                    mood,
                    harmony,
                    seeds: seedHexes,
                  }),
                )
              }
            >
              JSON
            </button>
          </div>

          {history.length > 0 && (
            <section>
              <h2>Saved</h2>
              <ul className="history-list">
                {history.map((item) => (
                  <li key={item.id}>
                    <button
                      type="button"
                      className="history-item"
                      onClick={() => restore(item)}
                    >
                      <span className="preset-dots">
                        {item.seeds.slice(0, 3).map((hex) => (
                          <span key={hex} style={{ backgroundColor: hex }} />
                        ))}
                      </span>
                      <span>
                        {item.mood} · {item.harmony}
                      </span>
                    </button>
                    <button
                      type="button"
                      className="btn icon"
                      aria-label="Remove saved palette"
                      onClick={() => removeHistory(item.id)}
                    >
                      ×
                    </button>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </aside>

        <div className="main-col">
          <section className="preview-section">
            <div className="section-head">
              <div>
                <p className="eyebrow">Live site</p>
                <h2 className="display">Website preview</h2>
              </div>
              <div className="device-toggle">
                {(
                  [
                    ["desktop", "Desktop"],
                    ["tablet", "Tablet"],
                    ["mobile", "Mobile"],
                  ] as const
                ).map(([id, label]) => (
                  <button
                    key={id}
                    type="button"
                    className={device === id ? "chip active" : "chip"}
                    onClick={() => setDevice(id)}
                    aria-pressed={device === id}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            <div className="preview-frame-wrap">
              <div
                className="preview-frame"
                style={{ maxWidth: DEVICE_WIDTH[device] }}
              >
                <div className="browser-chrome" aria-hidden>
                  <span className="dot" />
                  <span className="dot" />
                  <span className="dot" />
                  <span className="url">orchard.studio</span>
                </div>

                <div className="site-preview" style={previewVars(palette)}>
                  <nav className="site-nav">
                    <strong className="site-logo">Orchard</strong>
                    {!compact && (
                      <div className="site-links">
                        <span>Shop</span>
                        <span>Stories</span>
                        <span>Atelier</span>
                      </div>
                    )}
                    <button type="button" className="site-cta">
                      Shop collection
                    </button>
                  </nav>

                  <div className="site-hero">
                    <p className="site-kicker">Small-batch ceramics</p>
                    <h3>Forms for quieter rooms.</h3>
                    <p className="site-desc">
                      Handmade vessels glazed for daily use. A simple preview of
                      how your palette holds up in a real layout.
                    </p>
                    <div className="site-actions">
                      <button type="button" className="site-cta">
                        View work
                      </button>
                      <button type="button" className="site-secondary">
                        Our process
                      </button>
                    </div>
                  </div>

                  <div className="site-cards">
                    {(
                      [
                        [
                          "Stoneware",
                          palette.secondary,
                          palette.primary,
                          palette.accent,
                        ],
                        [
                          "Porcelain",
                          palette.accent,
                          palette.secondary,
                          palette.primary,
                        ],
                        [
                          "Ash glaze",
                          palette.primary,
                          palette.accent,
                          palette.secondary,
                        ],
                      ] as const
                    ).map(([title, body, neck, glaze]) => (
                      <article key={title} className="site-card">
                        <Vessel body={body} neck={neck} glaze={glaze} />
                        <h4>{title}</h4>
                        <p>Thrown on the wheel, fired twice, made to last.</p>
                      </article>
                    ))}
                  </div>

                  <div className="site-quote">
                    <p>
                      “They made our shelves feel like a place, not a catalog.”
                    </p>
                    <span>Mira Chen, interior studio</span>
                  </div>

                  <div className="site-band">
                    <p>New drop every first Friday.</p>
                    <span
                      className="site-band-badge"
                      style={{
                        background: "var(--a)",
                        color: palette.onAccent,
                      }}
                    >
                      Join the list
                    </span>
                  </div>

                  <footer className="site-footer">
                    <span>Orchard, est. 2019</span>
                    <span className="status-dots">
                      <span style={{ background: "var(--ok)" }} />
                      <span style={{ background: "var(--wn)" }} />
                      <span style={{ background: "var(--dn)" }} />
                    </span>
                  </footer>
                </div>
              </div>
            </div>
          </section>

          <section>
            <p className="eyebrow">Tokens</p>
            <h2 className="display">Your palette</h2>
            <div className="swatch-grid">
              {SWATCHES.map(({ key, name }) => {
                const hex = palette[key];
                const on = bestTextOn(hex);
                const isCopied = copied === name;
                return (
                  <button
                    key={key}
                    type="button"
                    className="swatch-card"
                    onClick={() => doCopy(name, hex)}
                  >
                    <div
                      className="swatch-color"
                      style={{ backgroundColor: hex, color: on }}
                    >
                      <span>{hex}</span>
                      {isCopied && <span>✓</span>}
                    </div>
                    <div className="swatch-meta">
                      <strong>{name}</strong>
                      <span>{isCopied ? "Copied" : "Copy"}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </section>

          <section>
            <p className="eyebrow">Accessibility</p>
            <h2 className="display">Contrast</h2>
            <ul className="contrast-list">
              {CONTRAST_PAIRS.map((pair) => {
                const fg = palette[pair.fg];
                const bg = palette[pair.bg];
                const ratio = contrastRatio(fg, bg);
                const grade = contrastGrade(ratio);
                return (
                  <li key={pair.label}>
                    <span
                      className="contrast-sample"
                      style={{ backgroundColor: bg, color: fg }}
                      aria-hidden
                    >
                      Aa
                    </span>
                    <span className="contrast-label">{pair.label}</span>
                    <span className="contrast-ratio">
                      {ratio.toFixed(1)}:1
                    </span>
                    <span className={`grade grade-${grade}`}>{grade}</span>
                  </li>
                );
              })}
            </ul>
          </section>
        </div>
      </div>

      <footer className="studio-footer">
        <strong>Tintelya</strong>
        <span>Website palettes, generated in the browser.</span>
      </footer>
    </div>
  );
}
