import { useMemo, useRef, useState } from "react";

interface PricePoint {
  timestamp: number; // milliseconds
  yesPrice: number;
  noPrice: number;
}

interface PriceChartProps {
  data: PricePoint[];
}

// Fixed logical coordinate space — SVG scales to fit any container via viewBox
const VB_W = 600;
const VB_H = 220;
const PAD = { top: 16, right: 12, bottom: 36, left: 52 };
const INNER_W = VB_W - PAD.left - PAD.right;
const INNER_H = VB_H - PAD.top - PAD.bottom;
const BASE_Y = PAD.top + INNER_H;
const BUCKET_COUNT = 80;

// ─── Data prep ───────────────────────────────────────────────────────────────

function prepareData(raw: PricePoint[]): PricePoint[] {
  if (!raw || raw.length === 0) return [];
  const sorted = [...raw].sort((a, b) => a.timestamp - b.timestamp);
  if (sorted.length <= BUCKET_COUNT) return sorted;

  const minT = sorted[0].timestamp;
  const maxT = sorted[sorted.length - 1].timestamp;
  const bucketSize = (maxT - minT) / BUCKET_COUNT;
  const buckets: Record<number, { yes: number[]; no: number[] }> = {};

  for (const p of sorted) {
    const idx = Math.min(
      Math.floor((p.timestamp - minT) / bucketSize),
      BUCKET_COUNT - 1,
    );
    if (!buckets[idx]) buckets[idx] = { yes: [], no: [] };
    buckets[idx].yes.push(p.yesPrice);
    buckets[idx].no.push(p.noPrice);
  }

  return Object.entries(buckets).map(([idx, b]) => ({
    timestamp: minT + Number(idx) * bucketSize,
    yesPrice: b.yes.reduce((a, c) => a + c, 0) / b.yes.length,
    noPrice: b.no.reduce((a, c) => a + c, 0) / b.no.length,
  }));
}

// ─── SVG path (Catmull-Rom smooth) ───────────────────────────────────────────

function buildLinePath(pts: { x: number; y: number }[]): string {
  if (pts.length < 2) return "";
  let d = `M ${pts[0].x.toFixed(1)} ${pts[0].y.toFixed(1)}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[Math.max(i - 1, 0)];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[Math.min(i + 2, pts.length - 1)];
    const cp1x = p1.x + (p2.x - p0.x) / 6;
    const cp1y = p1.y + (p2.y - p0.y) / 6;
    const cp2x = p2.x - (p3.x - p1.x) / 6;
    const cp2y = p2.y - (p3.y - p1.y) / 6;
    d += ` C ${cp1x.toFixed(1)} ${cp1y.toFixed(1)}, ${cp2x.toFixed(1)} ${cp2y.toFixed(1)}, ${p2.x.toFixed(1)} ${p2.y.toFixed(1)}`;
  }
  return d;
}

function buildAreaPath(pts: { x: number; y: number }[]): string {
  if (pts.length < 2) return "";
  return `${buildLinePath(pts)} L ${pts[pts.length - 1].x.toFixed(1)} ${BASE_Y} L ${pts[0].x.toFixed(1)} ${BASE_Y} Z`;
}

// ─── Component ───────────────────────────────────────────────────────────────

export function PriceChart({ data }: PriceChartProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [activeLines, setActiveLines] = useState({ yes: true, no: true });
  const [tooltip, setTooltip] = useState<{
    svgX: number; // position in viewBox coords
    yes: number;
    no: number;
    time: string;
    flip: boolean; // true = show tooltip to the left
  } | null>(null);

  const prepared = useMemo(() => prepareData(data), [data]);

  const { minPrice, maxPrice, yesPoints, noPoints, xTicks, yTicks } =
    useMemo(() => {
      if (!prepared.length)
        return {
          minPrice: 0,
          maxPrice: 1,
          yesPoints: [],
          noPoints: [],
          xTicks: [],
          yTicks: [],
        };

      const allPrices = prepared.flatMap((p) => [p.yesPrice, p.noPrice]);
      const rawMin = Math.min(...allPrices);
      const rawMax = Math.max(...allPrices);
      const pad = Math.max((rawMax - rawMin) * 0.15, 0.005);
      const minPrice = Math.max(0, rawMin - pad);
      const maxPrice = Math.min(1, rawMax + pad);
      const range = maxPrice - minPrice;
      const n = Math.max(prepared.length - 1, 1);

      const toX = (i: number) => PAD.left + (i / n) * INNER_W;
      const toY = (p: number) =>
        PAD.top + INNER_H - ((p - minPrice) / range) * INNER_H;

      const yesPoints = prepared.map((p, i) => ({
        x: toX(i),
        y: toY(p.yesPrice),
      }));
      const noPoints = prepared.map((p, i) => ({
        x: toX(i),
        y: toY(p.noPrice),
      }));

      const tickCount = 5;
      const xTicks = Array.from({ length: tickCount }, (_, i) => {
        const idx = Math.round((i / (tickCount - 1)) * (prepared.length - 1));
        return {
          x: toX(idx),
          label: new Date(prepared[idx].timestamp).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
        };
      });

      const yTicks = Array.from({ length: 4 }, (_, i) => {
        const price = minPrice + (i / 3) * range;
        return { y: toY(price), label: `$${price.toFixed(3)}` };
      });

      return { minPrice, maxPrice, yesPoints, noPoints, xTicks, yTicks };
    }, [prepared]);

  // Convert a pointer clientX into viewBox X, then find nearest data point
  const updateTooltip = (clientX: number) => {
    if (!svgRef.current || !prepared.length) return;
    const rect = svgRef.current.getBoundingClientRect();
    // Scale from screen pixels → viewBox coords
    const scaleX = VB_W / rect.width;
    const vbX = (clientX - rect.left) * scaleX;
    const mx = vbX - PAD.left;
    const frac = Math.max(0, Math.min(1, mx / INNER_W));
    const idx = Math.round(frac * (prepared.length - 1));
    const p = prepared[idx];
    if (!p) return;
    const svgX = PAD.left + (idx / Math.max(prepared.length - 1, 1)) * INNER_W;
    setTooltip({
      svgX,
      yes: p.yesPrice,
      no: p.noPrice,
      time: new Date(p.timestamp).toLocaleString([], {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }),
      flip: svgX > VB_W * 0.6,
    });
  };

  if (!data || data.length === 0) {
    return (
      <div
        style={{
          height: 160,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#4a4a6a",
          fontSize: 13,
          background: "#0b0b14",
          borderRadius: 12,
          border: "1px solid rgba(31,135,252,0.15)",
        }}
      >
        No price history yet
      </div>
    );
  }

  return (
    <div style={{ width: "100%", userSelect: "none" }}>
      {/* Toggle buttons */}
      <div
        style={{
          display: "flex",
          gap: 8,
          marginBottom: 10,
          justifyContent: "flex-end",
        }}
      >
        {(["yes", "no"] as const).map((side) => {
          const color = side === "yes" ? "#00ff88" : "#ff3366";
          const active = activeLines[side];
          return (
            <button
              key={side}
              onClick={() =>
                setActiveLines((prev) => ({ ...prev, [side]: !prev[side] }))
              }
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                background: "none",
                border: `1px solid ${active ? color + "55" : "#333"}`,
                borderRadius: 6,
                padding: "3px 10px",
                cursor: "pointer",
                color: active ? color : "#555",
                fontSize: 12,
                fontWeight: 600,
                opacity: active ? 1 : 0.45,
                transition: "all 0.15s",
              }}
            >
              <span
                style={{
                  width: 7,
                  height: 7,
                  borderRadius: "50%",
                  background: active ? color : "#444",
                }}
              />
              {side.toUpperCase()}
            </button>
          );
        })}
      </div>

      {/* SVG — viewBox makes it scale to any width automatically */}
      <div
        style={{
          background: "#0b0b14",
          borderRadius: 12,
          border: "1px solid rgba(31,135,252,0.15)",
          overflow: "hidden",
        }}
      >
        <svg
          ref={svgRef}
          viewBox={`0 0 ${VB_W} ${VB_H}`}
          style={{
            display: "block",
            width: "100%",
            height: "auto",
            cursor: "crosshair",
          }}
          onMouseMove={(e) => updateTooltip(e.clientX)}
          onMouseLeave={() => setTooltip(null)}
          onTouchMove={(e) => {
            e.preventDefault();
            updateTooltip(e.touches[0].clientX);
          }}
          onTouchEnd={() => setTooltip(null)}
        >
          <defs>
            <linearGradient id="gradYes" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#00ff88" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#00ff88" stopOpacity="0" />
            </linearGradient>
            <linearGradient id="gradNo" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#ff3366" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#ff3366" stopOpacity="0" />
            </linearGradient>
            <clipPath id="chartClip">
              <rect x={PAD.left} y={PAD.top} width={INNER_W} height={INNER_H} />
            </clipPath>
          </defs>

          {/* Grid */}
          {yTicks.map((t, i) => (
            <line
              key={i}
              x1={PAD.left}
              x2={PAD.left + INNER_W}
              y1={t.y}
              y2={t.y}
              stroke="rgba(255,255,255,0.04)"
              strokeWidth={1}
            />
          ))}

          {/* Y labels */}
          {yTicks.map((t, i) => (
            <text
              key={i}
              x={PAD.left - 5}
              y={t.y + 4}
              textAnchor="end"
              fill="#4a4a6a"
              fontSize={9}
              fontFamily="monospace"
            >
              {t.label}
            </text>
          ))}

          {/* X labels */}
          {xTicks.map((t, i) => (
            <text
              key={i}
              x={t.x}
              y={PAD.top + INNER_H + 20}
              textAnchor="middle"
              fill="#4a4a6a"
              fontSize={9}
              fontFamily="monospace"
            >
              {t.label}
            </text>
          ))}

          {/* YES */}
          {activeLines.yes && yesPoints.length > 1 && (
            <g clipPath="url(#chartClip)">
              <path d={buildAreaPath(yesPoints)} fill="url(#gradYes)" />
              <path
                d={buildLinePath(yesPoints)}
                fill="none"
                stroke="#00ff88"
                strokeWidth={1.5}
                strokeLinejoin="round"
                strokeLinecap="round"
              />
            </g>
          )}

          {/* NO */}
          {activeLines.no && noPoints.length > 1 && (
            <g clipPath="url(#chartClip)">
              <path d={buildAreaPath(noPoints)} fill="url(#gradNo)" />
              <path
                d={buildLinePath(noPoints)}
                fill="none"
                stroke="#ff3366"
                strokeWidth={1.5}
                strokeLinejoin="round"
                strokeLinecap="round"
              />
            </g>
          )}

          {/* Crosshair + dots */}
          {tooltip && (
            <>
              <line
                x1={tooltip.svgX}
                x2={tooltip.svgX}
                y1={PAD.top}
                y2={PAD.top + INNER_H}
                stroke="rgba(255,255,255,0.12)"
                strokeWidth={1}
                strokeDasharray="4 3"
              />
              {activeLines.yes && (
                <circle
                  cx={tooltip.svgX}
                  cy={
                    PAD.top +
                    INNER_H -
                    ((tooltip.yes - minPrice) / (maxPrice - minPrice)) * INNER_H
                  }
                  r={3.5}
                  fill="#00ff88"
                  stroke="#0b0b14"
                  strokeWidth={1.5}
                />
              )}
              {activeLines.no && (
                <circle
                  cx={tooltip.svgX}
                  cy={
                    PAD.top +
                    INNER_H -
                    ((tooltip.no - minPrice) / (maxPrice - minPrice)) * INNER_H
                  }
                  r={3.5}
                  fill="#ff3366"
                  stroke="#0b0b14"
                  strokeWidth={1.5}
                />
              )}

              {/* Inline SVG tooltip — lives in viewBox coords so it scales with the chart */}
              <g
                transform={`translate(${tooltip.flip ? tooltip.svgX - 115 : tooltip.svgX + 8}, 8)`}
              >
                <rect
                  x={0}
                  y={0}
                  width={107}
                  height={activeLines.yes && activeLines.no ? 52 : 38}
                  rx={5}
                  fill="#13131f"
                  stroke="rgba(31,135,252,0.3)"
                  strokeWidth={0.8}
                />
                <text
                  x={6}
                  y={14}
                  fill="#555"
                  fontSize={8}
                  fontFamily="monospace"
                >
                  {tooltip.time}
                </text>
                {activeLines.yes && (
                  <>
                    <text
                      x={6}
                      y={27}
                      fill="#00ff88"
                      fontSize={9}
                      fontWeight="bold"
                    >
                      YES
                    </text>
                    <text
                      x={28}
                      y={27}
                      fill="#fff"
                      fontSize={9}
                      fontFamily="monospace"
                    >
                      ${tooltip.yes.toFixed(4)}
                    </text>
                  </>
                )}
                {activeLines.no && (
                  <>
                    <text
                      x={6}
                      y={activeLines.yes ? 41 : 27}
                      fill="#ff3366"
                      fontSize={9}
                      fontWeight="bold"
                    >
                      NO
                    </text>
                    <text
                      x={28}
                      y={activeLines.yes ? 41 : 27}
                      fill="#fff"
                      fontSize={9}
                      fontFamily="monospace"
                    >
                      ${tooltip.no.toFixed(4)}
                    </text>
                  </>
                )}
              </g>
            </>
          )}
        </svg>
      </div>
    </div>
  );
}
