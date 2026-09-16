"use client";

import { useState } from "react";

type Color = {
  name: string;
  hex: string;
};

const defaultColors = ["#8B5CF6", "#C084FC", "#E9D5FF"];

function hexToRgb(hex: string) {
  const cleanHex = hex.replace("#", "");

  const r = parseInt(cleanHex.substring(0, 2), 16);
  const g = parseInt(cleanHex.substring(2, 4), 16);
  const b = parseInt(cleanHex.substring(4, 6), 16);

  return { r, g, b };
}

function rgbToHsl(r: number, g: number, b: number) {
  r /= 255;
  g /= 255;
  b /= 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);

  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;

    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }

    h /= 6;
  }

  return {
    h: h * 360,
    s: s * 100,
    l: l * 100,
  };
}

function hslToHex(h: number, s: number, l: number) {
  s /= 100;
  l /= 100;

  const k = (n: number) => (n + h / 30) % 12;
  const a = s * Math.min(l, 1 - l);

  const f = (n: number) =>
    l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));

  const r = Math.round(255 * f(0));
  const g = Math.round(255 * f(8));
  const b = Math.round(255 * f(4));

  return `#${[r, g, b]
    .map((value) => value.toString(16).padStart(2, "0"))
    .join("")
    .toUpperCase()}`;
}

function changeColor(hex: string, lightness: number, saturation: number) {
  const { r, g, b } = hexToRgb(hex);
  const { h, s, l } = rgbToHsl(r, g, b);

  return hslToHex(
    h,
    Math.max(0, Math.min(100, s + saturation)),
    Math.max(0, Math.min(100, l + lightness))
  );
}

function getTextColor(hex: string) {
  const { r, g, b } = hexToRgb(hex);

  const brightness = (r * 299 + g * 587 + b * 114) / 1000;

  return brightness > 160 ? "#17131f" : "#ffffff";
}

export default function Home() {
  const [inputColors, setInputColors] = useState(defaultColors);
  const [mood, setMood] = useState("Modern");
  const [palette, setPalette] = useState<Color[]>([]);
  const [copied, setCopied] = useState(false);

  function updateColor(index: number, value: string) {
    const newColors = [...inputColors];
    newColors[index] = value;
    setInputColors(newColors);
  }

  function addColor() {
    if (inputColors.length < 5) {
      setInputColors([...inputColors, "#FFFFFF"]);
    }
  }

  function removeColor(index: number) {
    if (inputColors.length > 1) {
      setInputColors(inputColors.filter((_, i) => i !== index));
    }
  }

  function generatePalette() {
    const mainColor = inputColors[0] || "#8B5CF6";
    const secondColor = inputColors[1] || mainColor;
    const thirdColor = inputColors[2] || secondColor;

    let background = "#F8F7FA";
    let surface = "#FFFFFF";
    let text = "#17131F";
    let muted = "#756D7E";
    let border = "#DDD7E5";

    if (mood === "Dark") {
      background = changeColor(mainColor, -35, -10);
      surface = changeColor(mainColor, -25, -5);
      text = "#FFFFFF";
      muted = "#BDB5C8";
      border = changeColor(mainColor, -5, -10);
    }

    if (mood === "Soft") {
      background = changeColor(mainColor, 45, -20);
      surface = "#FFFFFF";
      text = "#3A3045";
      muted = "#81778B";
      border = changeColor(mainColor, 30, -15);
    }

    if (mood === "Pastel") {
      background = changeColor(mainColor, 50, -25);
      surface = changeColor(secondColor, 45, -20);
      text = "#332B3B";
      muted = "#807587";
      border = changeColor(thirdColor, 25, -20);
    }

    if (mood === "Vibrant") {
      background = "#FFF8FF";
      surface = "#FFFFFF";
      text = "#211526";
      muted = "#75617C";
      border = changeColor(mainColor, 15, 5);
    }

    if (mood === "Minimal") {
      background = "#FAFAFA";
      surface = "#FFFFFF";
      text = "#181818";
      muted = "#777777";
      border = "#E5E5E5";
    }

    const generated: Color[] = [
      {
        name: "Primary",
        hex: mainColor.toUpperCase(),
      },
      {
        name: "Secondary",
        hex: secondColor.toUpperCase(),
      },
      {
        name: "Accent",
        hex: thirdColor.toUpperCase(),
      },
      {
        name: "Background",
        hex: background.toUpperCase(),
      },
      {
        name: "Surface",
        hex: surface.toUpperCase(),
      },
      {
        name: "Text",
        hex: text.toUpperCase(),
      },
      {
        name: "Muted Text",
        hex: muted.toUpperCase(),
      },
      {
        name: "Border",
        hex: border.toUpperCase(),
      },
      {
        name: "Success",
        hex: "#22C55E",
      },
      {
        name: "Warning",
        hex: "#F59E0B",
      },
      {
        name: "Error",
        hex: "#EF4444",
      },
    ];

    setPalette(generated);
    setCopied(false);
  }

  function copyPalette() {
    const text = palette
      .map((color) => `${color.name}: ${color.hex}`)
      .join("\n");

    navigator.clipboard.writeText(text);
    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 2000);
  }

  return (
    <main>
      <header className="hero">
        <div className="logo">T</div>

        <div>
          <p className="small-title">COLOR TOOL</p>
          <h1>Tintelya</h1>
          <p className="hero-text">
            Create beautiful website color palettes from the colors you love.
          </p>
        </div>
      </header>

      <section className="container">
        <div className="panel">
          <div className="section-title">
            <div>
              <span className="number">01</span>
              <h2>Your colors</h2>
            </div>

            <button className="add-button" onClick={addColor}>
              + Add color
            </button>
          </div>

          <p className="description">
            Add one or more colors that you want to use in your website.
          </p>

          <div className="color-inputs">
            {inputColors.map((color, index) => (
              <div className="color-input" key={index}>
                <input
                  type="color"
                  value={color}
                  onChange={(e) => updateColor(index, e.target.value)}
                />

                <input
                  className="hex-input"
                  value={color}
                  onChange={(e) => updateColor(index, e.target.value)}
                  maxLength={7}
                />

                {inputColors.length > 1 && (
                  <button
                    className="remove-button"
                    onClick={() => removeColor(index)}
                  >
                    ×
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="panel">
          <div className="section-title">
            <div>
              <span className="number">02</span>
              <h2>Choose a mood</h2>
            </div>
          </div>

          <div className="moods">
            {[
              "Modern",
              "Soft",
              "Pastel",
              "Vibrant",
              "Minimal",
              "Dark",
            ].map((item) => (
              <button
                key={item}
                className={mood === item ? "mood active" : "mood"}
                onClick={() => setMood(item)}
              >
                {item}
              </button>
            ))}
          </div>

          <button className="generate-button" onClick={generatePalette}>
            Generate Palette ✦
          </button>
        </div>

        {palette.length > 0 && (
          <>
            <div className="panel">
              <div className="section-title">
                <div>
                  <span className="number">03</span>
                  <h2>Your palette</h2>
                </div>

                <button className="copy-button" onClick={copyPalette}>
                  {copied ? "Copied ✓" : "Copy HEX"}
                </button>
              </div>

              <div className="palette-grid">
                {palette.map((color) => (
                  <div className="palette-card" key={color.name}>
                    <div
                      className="color-box"
                      style={{
                        backgroundColor: color.hex,
                        color: getTextColor(color.hex),
                      }}
                    >
                      {color.hex}
                    </div>

                    <div className="palette-info">
                      <strong>{color.name}</strong>
                      <span>{color.hex}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="panel">
              <div className="section-title">
                <div>
                  <span className="number">04</span>
                  <h2>Website preview</h2>
                </div>
              </div>

              <div
                className="preview"
                style={{
                  backgroundColor:
                    palette.find((item) => item.name === "Background")
                      ?.hex || "#F8F7FA",
                  color:
                    palette.find((item) => item.name === "Text")?.hex ||
                    "#17131F",
                }}
              >
                <nav
                  className="preview-nav"
                  style={{
                    backgroundColor:
                      palette.find((item) => item.name === "Surface")?.hex ||
                      "#FFFFFF",
                    borderBottomColor:
                      palette.find((item) => item.name === "Border")?.hex ||
                      "#DDD7E5",
                  }}
                >
                  <strong>Tintelya</strong>

                  <div className="preview-links">
                    <span>Home</span>
                    <span>About</span>
                    <span>Contact</span>
                  </div>
                </nav>

                <div className="preview-content">
                  <p
                    className="preview-label"
                    style={{
                      color:
                        palette.find((item) => item.name === "Primary")
                          ?.hex || "#8B5CF6",
                    }}
                  >
                    DESIGN YOUR STYLE
                  </p>

                  <h3>Create something beautiful.</h3>

                  <p className="preview-description">
                    A simple preview showing how your generated colors can
                    work together in a real website.
                  </p>

                  <button
                    className="preview-button"
                    style={{
                      backgroundColor:
                        palette.find((item) => item.name === "Primary")
                          ?.hex || "#8B5CF6",
                      color: getTextColor(
                        palette.find((item) => item.name === "Primary")
                          ?.hex || "#8B5CF6"
                      ),
                    }}
                  >
                    Get Started
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
      </section>

      <footer>
        <strong>Tintelya</strong>
        <span>Color palettes made simple.</span>
      </footer>
    </main>
  );
}