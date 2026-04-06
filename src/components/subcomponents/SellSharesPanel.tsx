// components/SellSharesPanel.tsx
import { useState, useMemo } from "react";
import { TrendingDown, TrendingUp, Loader2, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { useTrade } from "../../hooks/useTrade";

interface SellSharesPanelProps {
  marketId: string;
  myShares: { yes: number; no: number };
  yesPrice: number;
  noPrice: number;
}

export function SellSharesPanel({
  marketId,
  myShares,
  yesPrice,
  noPrice,
}: SellSharesPanelProps) {
  const { sellShares } = useTrade();

  const [yesAmount, setYesAmount] = useState("");
  const [noAmount, setNoAmount] = useState("");
  const [isSelling, setIsSelling] = useState<"yes" | "no" | null>(null);

  const estimatePayout = (shareAmount: string, price: number) => {
    const val = parseFloat(shareAmount);
    if (!val || isNaN(val) || val <= 0) return null;
    return {
      payout: (val * price).toFixed(4),
      perShare: price.toFixed(4),
    };
  };

  const yesEstimate = useMemo(
    () => estimatePayout(yesAmount, yesPrice),
    [yesAmount, yesPrice],
  );
  const noEstimate = useMemo(
    () => estimatePayout(noAmount, noPrice),
    [noAmount, noPrice],
  );

  const handleSell = async (isYes: boolean) => {
    const rawAmount = isYes ? yesAmount : noAmount;
    const maxShares = isYes ? myShares.yes : myShares.no;
    const val = parseFloat(rawAmount);
    const side = isYes ? "YES" : "NO";

    if (!val || isNaN(val) || val <= 0) {
      toast.error("Enter a valid share amount");
      return;
    }
    if (val > maxShares) {
      toast.error(`You only have ${maxShares.toFixed(4)} ${side} shares`);
      return;
    }

    // ✅ convert display float → raw contract integer (6 decimals)
    const rawToSell =
      val >= maxShares * 0.999
        ? BigInt(Math.round(maxShares * 1e6))
        : BigInt(Math.floor(val * 1e6));

    setIsSelling(isYes ? "yes" : "no");
    try {
      await sellShares(marketId, isYes, rawToSell.toString());
      isYes ? setYesAmount("") : setNoAmount("");
    } catch (err: any) {
      toast.error(err?.message || "Transaction failed");
    } finally {
      setIsSelling(null);
    }
  };

  const hasYes = myShares.yes > 0;
  const hasNo = myShares.no > 0;

  if (!hasYes && !hasNo) return null;

  const renderCard = (isYes: boolean) => {
    const color = isYes ? "#00ff88" : "#ff3366";
    const label = isYes ? "YES" : "NO";
    const price = isYes ? yesPrice : noPrice;
    const shares = isYes ? myShares.yes : myShares.no;
    const amount = isYes ? yesAmount : noAmount;
    const setAmount = isYes ? setYesAmount : setNoAmount;
    const estimate = isYes ? yesEstimate : noEstimate;
    const loading = isSelling === (isYes ? "yes" : "no");
    const Icon = isYes ? TrendingUp : TrendingDown;

    const isLargeSell = !!estimate && parseFloat(amount) > shares * 0.5;

    return (
      <div
        key={label}
        className="bg-[#1a1a24] rounded-lg p-4 flex flex-col gap-3"
        style={{ border: `1px solid ${color}30` }}
      >
        {/* Title row */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Icon className="w-4 h-4" style={{ color }} />
            <span className="font-bold text-sm" style={{ color }}>
              {label} Shares
            </span>
          </div>
          <span
            className="text-xs text-muted-foreground px-2 py-0.5 rounded-full"
            style={{
              background: `${color}15`,
              border: `1px solid ${color}25`,
            }}
          >
            {shares.toFixed(4)} owned
          </span>
        </div>

        {/* Price row */}
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>Current price</span>
          <span className="text-white font-mono">${price.toFixed(4)}</span>
        </div>

        {/* Input + MAX */}
        <div className="relative">
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Shares to sell"
            max={shares}
            className="w-full bg-black/50 rounded-lg py-2.5 pl-3 pr-14 text-white text-sm
               focus:outline-none transition-colors px-2"
            style={{ border: `1px solid ${color}30` }}
            onFocus={(e) => (e.currentTarget.style.borderColor = color)}
            onBlur={(e) => (e.currentTarget.style.borderColor = `${color}30`)}
          />
          <div
            className="absolute right-0 top-0 bottom-0 flex items-center pr-1"
            style={{ borderLeft: `1px solid ${color}20` }}
          >
            <button
              onClick={() => setAmount(shares.toString())}
              className="text-[10px] font-bold px-2 py-1 rounded transition-colors h-full"
              style={{ color, background: `${color}15` }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.background = `${color}25`)
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.background = `${color}15`)
              }
            >
              MAX
            </button>
          </div>
        </div>

        {/* Payout estimate */}
        <div className="min-h-[44px]">
          {estimate ? (
            <div
              className="flex justify-between items-center rounded-lg p-2.5 text-sm px-2"
              style={{
                background: `${color}10`,
                border: `1px solid ${color}20`,
              }}
            >
              <span className="text-muted-foreground text-xs">Est. payout</span>
              <div className="text-right">
                <span className="text-white font-mono block">
                  {`$${(estimate.payout * 1).toFixed(4)}`}
                </span>
                <span className="text-[10px]" style={{ color }}>
                  @ ${estimate.perShare} / share
                </span>
              </div>
            </div>
          ) : (
            <div className="text-xs text-muted-foreground/50 p-2 text-center">
              Enter amount to see payout
            </div>
          )}
        </div>

        {/* Slippage warning */}
        {isLargeSell && (
          <div
            className="flex items-start gap-1.5 text-yellow-400/80 text-xs
                          bg-yellow-400/5 border border-yellow-400/20 rounded-lg p-2"
          >
            <AlertCircle className="w-3 h-3 mt-0.5 shrink-0" />
            <span>
              Large sell may move price. Actual payout may differ slightly.
            </span>
          </div>
        )}

        {/* Sell button */}
        <button
          onClick={() => handleSell(isYes)}
          disabled={!!isSelling || !amount || parseFloat(amount) <= 0}
          className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg
                     font-bold text-sm transition-all disabled:opacity-40 disabled:cursor-not-allowed"
          style={{
            color,
            background: `${color}10`,
            border: `1px solid ${color}40`,
          }}
          onMouseEnter={(e) => {
            if (!isSelling) e.currentTarget.style.background = `${color}20`;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = `${color}10`;
          }}
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" /> Selling...
            </>
          ) : (
            `Sell ${label} Shares`
          )}
        </button>
      </div>
    );
  };

  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="flex items-center gap-2">
        <TrendingDown className="w-4 h-4 text-yellow-400" />
        <h3 className="text-sm font-semibold text-yellow-400 uppercase tracking-wider">
          Sell Your Shares
        </h3>
      </div>

      {/* Single card or both — always same grid width as buy cards above */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {hasYes && renderCard(true)}
        {hasNo && renderCard(false)}
      </div>
    </div>
  );
}
