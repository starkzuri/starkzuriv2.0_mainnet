import { useEffect, useRef, useState } from "react";

// 🟢 UPGRADED to v4.2.1 to support BaselineSeries and improved performance
const LC_CDN =
  "https://unpkg.com/lightweight-charts@4.2.1/dist/lightweight-charts.standalone.production.js";

interface ChartProps {
  symbol?: string;
}

const isValidPoint = (p: any) => {
  return p && typeof p.time === "number" && !isNaN(p.value);
};

export const LiveTradingChart = ({ symbol = "btcusdt" }: ChartProps) => {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const priceRef = useRef<HTMLSpanElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [price, setPrice] = useState("—");
  const [priceChange, setPriceChange] = useState({ text: "+0.00%", up: true });
  const [activeInterval, setActiveInterval] = useState("1m");

  const chartRef = useRef<any>(null);
  const seriesRef = useRef<any>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const openPriceRef = useRef<number | null>(null);
  const lastPointTimeRef = useRef<number>(0);
  const activeIntervalRef = useRef("1m");
  const loadingIdRef = useRef(0);
  const lastChartUpdateRef = useRef<number>(0);
  const fallbackIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const applyTimezone = (ts: number) => ts + 3 * 60 * 60;

  const fmt = (n: number | string) => {
    const val = parseFloat(String(n));
    // 🟢 If the coin is cheap (like STRK), show 4 decimals to see the micro-moves.
    // If it's expensive (like BTC), stick to 2 decimals.
    const decimals = val < 10 ? 4 : 2;

    return val.toLocaleString("en-US", {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    });
  };

  const updatePriceUI = (closePrice: number) => {
    if (priceRef.current) {
      priceRef.current.innerText = "$" + fmt(closePrice);
    }

    if (openPriceRef.current) {
      const isUp = closePrice >= openPriceRef.current;
      if (priceRef.current) {
        priceRef.current.style.color = isUp ? "#22c55e" : "#ef4444";
      }

      const pct =
        ((closePrice - openPriceRef.current) / openPriceRef.current) * 100;
      setPriceChange({
        text: (pct >= 0 ? "+" : "") + pct.toFixed(2) + "%",
        up: isUp,
      });

      // Update the baseline color threshold
      seriesRef.current?.applyOptions({
        baseValue: { type: "price", price: openPriceRef.current },
      });
    }
  };

  const loadData = async (iv: string) => {
    const container = chartContainerRef.current;
    const LC = (window as any).LightweightCharts;
    if (!container || !LC) return;

    // Increment ID to invalidate any previous pending fetches
    const currentId = ++loadingIdRef.current;

    if (wsRef.current) wsRef.current.close();
    setIsLoading(true);

    if (chartRef.current) {
      try {
        chartRef.current.remove();
      } catch (e) {
        /* Already gone */
      }
      chartRef.current = null;
      seriesRef.current = null;
    }

    const chart = LC.createChart(container, {
      layout: {
        background: { type: "solid", color: "transparent" },
        textColor: "rgba(255, 255, 255, 0.5)",
      },
      grid: {
        vertLines: { visible: false },
        horzLines: { color: "rgba(255,255,255,0.03)" },
      },
      width: container.clientWidth,
      height: container.clientHeight || 320,
      timeScale: { timeVisible: true, rightOffset: 10 },
      handleScroll: false,
      handleScale: false,
    });

    chartRef.current = chart;

    const series = chart.addBaselineSeries({
      baseValue: { type: "price", price: 0 },
      topLineColor: "#22c55e",
      topFillColor1: "rgba(34, 197, 94, 0.4)",
      topFillColor2: "rgba(34, 197, 94, 0.0)",
      bottomLineColor: "#ef4444",
      bottomFillColor1: "rgba(239, 68, 68, 0.0)",
      bottomFillColor2: "rgba(239, 68, 68, 0.4)",
      lineWidth: 3,
      priceLineVisible: false,
    });

    try {
      const res = await fetch(
        `https://api.binance.com/api/v3/klines?symbol=${symbol.toUpperCase()}&interval=${iv}&limit=100`,
      );
      const klines = await res.json();

      // 🟢 THE FIX: If a newer load has started, stop this one immediately
      if (currentId !== loadingIdRef.current) return;

      const chartData = klines
        .map((d: any[]) => ({
          time: applyTimezone(d[0] / 1000),
          value: parseFloat(d[4]),
        }))
        .sort((a: any, b: any) => a.time - b.time);

      series.setData(chartData);
      seriesRef.current = series;

      openPriceRef.current = chartData[0]?.value || 0;
      updatePriceUI(chartData[chartData.length - 1].value);

      setIsLoading(false);
      connectWs(iv);
    } catch (e) {
      if (currentId === loadingIdRef.current) setIsLoading(false);
    }
  };

  const connectWs = (iv: string) => {
    if (wsRef.current) wsRef.current.close();
    if (fallbackIntervalRef.current) clearInterval(fallbackIntervalRef.current);

    const currentId = loadingIdRef.current;

    // Define speed limits (in milliseconds) for the chart line
    const speedLimits: Record<string, number> = {
      "1m": 0, // No limit - hyper speed
      "5m": 100, // Very fast
      "15m": 1000, // 1 second updates
      "1h": 5000, // 5 second updates
      "1d": 30000, // 30 second updates
    };

    const limit = speedLimits[iv] || 0;

    const ws = new WebSocket(
      `wss://stream.binance.com:9443/stream?streams=${symbol.toLowerCase()}@kline_${iv}/${symbol.toLowerCase()}@aggTrade`,
    );
    wsRef.current = ws;

    // 🟢 THE FALLBACK TRIGGER: If school proxy blocks WS
    ws.onerror = () => {
      console.warn(
        "WebSocket blocked by network. Switching to REST Fallback mode.",
      );
      startRestFallback(currentId);
    };

    // 🟢 THE SILENT DROP TRIGGER: If internet drops unexpectedly
    ws.onclose = (event) => {
      if (currentId === loadingIdRef.current && event.code !== 1000) {
        console.warn("Live feed dropped. Switching to REST Fallback mode.");
        startRestFallback(currentId);
      }
    };

    ws.onmessage = (event) => {
      if (!seriesRef.current || currentId !== loadingIdRef.current) return;

      const { stream, data } = JSON.parse(event.data);
      const now = Date.now();

      // TOP PRICE NUMBER (Always stays hyper-fast)
      if (stream.includes("aggTrade")) {
        updatePriceUI(parseFloat(data.p));
      }

      // CHART LINE (Speed is throttled based on interval)
      if (stream.includes("aggTrade")) {
        if (now - lastChartUpdateRef.current < limit) return;

        const currentPrice = parseFloat(data.p);
        let tradeTime = applyTimezone(data.T / 1000);

        if (tradeTime <= lastPointTimeRef.current) {
          tradeTime = lastPointTimeRef.current + 0.001;
        }

        lastPointTimeRef.current = tradeTime;
        lastChartUpdateRef.current = now;

        seriesRef.current.update({
          time: tradeTime,
          value: currentPrice,
        });
      } else if (stream.includes("kline")) {
        const k = data.k;
        const klineTime = applyTimezone(k.t / 1000);
        if (klineTime > lastPointTimeRef.current) {
          seriesRef.current.update({
            time: klineTime,
            value: parseFloat(k.c),
          });
          lastPointTimeRef.current = klineTime;
        }
      }
    };
  };

  // 🟢 THE REST POLLER (Runs only if WebSocket is blocked)
  const startRestFallback = (currentId: number) => {
    if (fallbackIntervalRef.current) clearInterval(fallbackIntervalRef.current);

    const fetchLatestPrice = async () => {
      // Self-destruct if the user switched intervals while this was pending
      if (currentId !== loadingIdRef.current) {
        if (fallbackIntervalRef.current)
          clearInterval(fallbackIntervalRef.current);
        return;
      }

      try {
        const res = await fetch(
          `https://api.binance.com/api/v3/ticker/24hr?symbol=${symbol.toUpperCase()}`,
        );
        const data = await res.json();

        const currentPrice = parseFloat(data.lastPrice);
        updatePriceUI(currentPrice);

        // Append a new point to the chart timeline
        let tradeTime = applyTimezone(Date.now() / 1000);
        if (tradeTime <= lastPointTimeRef.current) {
          tradeTime = lastPointTimeRef.current + 0.001;
        }

        if (seriesRef.current) {
          seriesRef.current.update({
            time: tradeTime,
            value: currentPrice,
          });
          lastPointTimeRef.current = tradeTime;
        }
      } catch (e) {
        console.error("Fallback fetch failed", e);
      }
    };

    // Fetch immediately, then loop every 3 seconds
    fetchLatestPrice();
    fallbackIntervalRef.current = setInterval(fetchLatestPrice, 3000);
  };

  useEffect(() => {
    if ((window as any).LightweightCharts) {
      loadData(activeIntervalRef.current);
    } else {
      const script = document.createElement("script");
      script.src = LC_CDN;
      script.onload = () => loadData(activeIntervalRef.current);
      document.head.appendChild(script);
    }
    return () => {
      wsRef.current?.close();
      chartRef.current?.remove();
    };
  }, [symbol]);

  const intervals = ["1m", "5m", "15m", "1h", "1d"];

  return (
    <div
      style={{
        background: "#0a0b0f",
        color: "#fff",
        borderRadius: 12,
        display: "flex",
        flexDirection: "column",
        height: "100%",
        border: "1px solid #1e222d",
        fontFamily: "'IBM Plex Mono', monospace",
      }}
    >
      <div
        style={{
          padding: "12px 20px",
          borderBottom: "1px solid #1e222d",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <div
            style={{
              background: "#22c55e",
              width: 8,
              height: 8,
              borderRadius: "50%",
            }}
          />
          <span style={{ fontWeight: 600, fontSize: 14 }}>
            {symbol.toUpperCase().replace("USDT", " / USDT")}
          </span>
        </div>
        <div style={{ display: "flex", gap: 5 }}>
          {intervals.map((i) => (
            <button
              key={i}
              onClick={() => {
                setActiveInterval(i);
                activeIntervalRef.current = i;
                loadData(i);
              }}
              style={{
                background: activeInterval === i ? "#1e222d" : "transparent",
                border: "none",
                color: activeInterval === i ? "#22c55e" : "#555",
                fontSize: 10,
                cursor: "pointer",
                padding: "4px 8px",
                borderRadius: 4,
              }}
            >
              {i.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      <div
        style={{
          padding: "15px 20px",
          display: "flex",
          gap: 20,
          alignItems: "baseline",
        }}
      >
        <span ref={priceRef} style={{ fontSize: 24, fontWeight: 700 }}>
          {price}
        </span>
        <span
          style={{
            color: priceChange.up ? "#22c55e" : "#ef4444",
            fontSize: 12,
          }}
        >
          {priceChange.text}
        </span>
      </div>

      <div style={{ flex: 1, position: "relative" }}>
        {isLoading && (
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: "#0a0b0f",
              zIndex: 5,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 12,
              color: "#444",
            }}
          >
            LOADING...
          </div>
        )}
        <div
          ref={chartContainerRef}
          style={{ width: "100%", height: "100%" }}
        />
      </div>
    </div>
  );
};
