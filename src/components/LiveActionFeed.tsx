
import { useState, useEffect } from "react";
import {
  TrendingUp,
  Trophy,
  Zap,
  Sparkles,
  Flame,
  Coins,
  ArrowRight,
  Clock,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

// 🟢 MOCK DATA with gamification attributes
const MOCK_ACTIVITY = [
  {
    type: "bet",
    user: "0x4a...e21",
    action: "bought YES",
    amount: "$50",
    market: "Bitcoin $100k",
    color: "text-[#00ff88]",
    bg: "bg-[#00ff88]/20",
    multiplier: "2.4x",
    streak: 3,
    hot: true,
    volume: "$12.4k",
  },
  {
    type: "win",
    user: "Felix",
    action: "won",
    amount: "$124.50",
    market: "Man Utd vs City",
    color: "text-[#ffd700]",
    bg: "bg-[#ffd700]/20",
    multiplier: "3.1x",
    streak: 5,
    hot: false,
    volume: "$8.2k",
  },
  {
    type: "new",
    user: "System",
    action: "created market",
    amount: "",
    market: "Will Trump visit Kenya?",
    color: "text-[#1F87FC]",
    bg: "bg-[#1F87FC]/20",
    multiplier: "1.8x",
    streak: 0,
    hot: true,
    volume: "$0",
    urgent: "LAST 2 HOURS!",
  },
  {
    type: "bet",
    user: "0x99...a1b",
    action: "bought NO",
    amount: "$20",
    market: "ETH ETF Approval",
    color: "text-[#ff3366]",
    bg: "bg-[#ff3366]/20",
    multiplier: "1.5x",
    streak: 1,
    hot: false,
    volume: "$45k",
  },
  {
    type: "whale",
    user: "🐋 Whale Alert",
    action: "dumped",
    amount: "$500",
    market: "Starknet TPS",
    color: "text-purple-500",
    bg: "bg-purple-500/20",
    multiplier: "5.2x",
    streak: 8,
    hot: true,
    volume: "$156k",
    urgent: "ENDING SOON",
  },
];

export function LiveActionFeed() {
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(true);
  const [isExpanded, setIsExpanded] = useState(false);
  const [shake, setShake] = useState(false);
  const [particles, setParticles] = useState<
    { id: number; x: number; y: number }[]
  >([]);

  useEffect(() => {
    setVisible(true);
    setShake(true);

    // Generate particles for dramatic effect
    const newParticles = Array.from({ length: 8 }, (_, i) => ({
      id: Date.now() + i,
      x: Math.random() * 100 - 50,
      y: Math.random() * 100 - 50,
    }));
    setParticles(newParticles);

    const shakeTimer = setTimeout(() => setShake(false), 500);
    const hideTimer = setTimeout(() => setVisible(false), 5000);
    const loopTimer = setTimeout(() => {
      setIndex((prev) => (prev + 1) % MOCK_ACTIVITY.length);
      setIsExpanded(false);
    }, 6000);

    return () => {
      clearTimeout(shakeTimer);
      clearTimeout(hideTimer);
      clearTimeout(loopTimer);
    };
  }, [index]);

  const item = MOCK_ACTIVITY[index];

  const getIcon = () => {
    switch (item.type) {
      case "win":
        return <Trophy className="w-4 h-4 text-[#ffd700]" />;
      case "whale":
        return <Zap className="w-4 h-4 text-purple-500" />;
      case "new":
        return <Sparkles className="w-4 h-4 text-[#1F87FC]" />;
      default:
        return <TrendingUp className={`w-4 h-4 ${item.color}`} />;
    }
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ x: 400, opacity: 0, scale: 0.8 }}
          animate={{
            x: 0,
            opacity: 1,
            scale: 1,
            rotate: shake ? [0, -2, 2, -2, 2, 0] : 0,
          }}
          exit={{ x: 400, opacity: 0, scale: 0.8 }}
          transition={{
            type: "spring",
            damping: 15,
            stiffness: 300,
            rotate: { duration: 0.5 },
          }}
          className="fixed z-50 bottom-24 right-4 md:bottom-8 md:right-8 cursor-pointer"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          {/* 🎮 PARTICLE EFFECTS */}
          {particles.map((particle) => (
            <motion.div
              key={particle.id}
              initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
              animate={{
                x: particle.x,
                y: particle.y,
                opacity: 0,
                scale: 0,
              }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className={`absolute w-2 h-2 rounded-full ${item.bg} top-1/2 left-1/2 pointer-events-none`}
            />
          ))}

          <div className="relative group">
            {/* 🌟 ENHANCED GLOW - Pulsing */}
            <motion.div
              animate={{
                opacity: [0.3, 0.6, 0.3],
                scale: [1, 1.05, 1],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="absolute -inset-1 bg-gradient-to-r from-[#1F87FC] via-[#00ff88] to-[#ffd700] rounded-2xl blur-lg"
            />

            {/* 🔥 HOT MARKET INDICATOR */}
            {item.hot && (
              <motion.div
                animate={{
                  y: [-2, 2, -2],
                  rotate: [0, 5, -5, 0],
                }}
                transition={{ duration: 1, repeat: Infinity }}
                className="absolute -top-3 -left-3 z-10"
              >
                <div className="relative">
                  <div className="absolute inset-0 bg-orange-500 rounded-full blur-md opacity-60" />
                  <div className="relative bg-gradient-to-br from-orange-400 to-red-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full flex items-center gap-1 shadow-lg">
                    <Flame className="w-3 h-3" />
                    HOT
                  </div>
                </div>
              </motion.div>
            )}

            {/* 🎯 MAIN CARD */}
            <motion.div
              animate={{
                boxShadow: isExpanded
                  ? "0 20px 60px rgba(31, 135, 252, 0.5)"
                  : "0 10px 40px rgba(0, 0, 0, 0.8)",
              }}
              className={`relative flex items-center gap-3 bg-gradient-to-br from-[#0a0a0a] to-[#1a1a2e] backdrop-blur-xl border-2 ${
                item.hot ? "border-orange-400/50" : "border-white/10"
              } p-3 pr-5 rounded-2xl transition-all duration-300 ${
                isExpanded ? "scale-105" : ""
              }`}
            >
              {/* 💎 Avatar with Streak Badge */}
              <div className="relative">
                <motion.div
                  animate={{
                    rotate: [0, 360],
                    scale: [1, 1.1, 1],
                  }}
                  transition={{
                    rotate: { duration: 3, repeat: Infinity, ease: "linear" },
                    scale: { duration: 2, repeat: Infinity },
                  }}
                  className={`w-12 h-12 rounded-full flex items-center justify-center bg-gradient-to-br ${
                    item.type === "win"
                      ? "from-[#ffd700] to-[#ff8800]"
                      : item.type === "whale"
                        ? "from-purple-500 to-pink-500"
                        : "from-[#1F87FC] to-[#00ff88]"
                  } p-0.5`}
                >
                  <div className="w-full h-full rounded-full bg-[#0a0a0a] flex items-center justify-center">
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 1, repeat: Infinity }}
                    >
                      {getIcon()}
                    </motion.div>
                  </div>
                </motion.div>

                {/* 🔥 STREAK INDICATOR */}
                {item.streak > 0 && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -bottom-1 -right-1 bg-gradient-to-r from-orange-500 to-red-500 text-white text-[9px] font-black px-1.5 py-0.5 rounded-full border-2 border-[#0a0a0a] flex items-center gap-0.5"
                  >
                    <Flame className="w-2.5 h-2.5" />
                    {item.streak}
                  </motion.div>
                )}
              </div>

              {/* 📊 Content */}
              <div className="flex flex-col gap-0.5 flex-1 min-w-0">
                <div className="text-xs text-gray-300 flex items-center gap-1.5 flex-wrap">
                  <span className="font-bold text-white tracking-wide">
                    {item.user}
                  </span>
                  <span className="opacity-80">{item.action}</span>
                  {item.amount && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: [1, 1.15, 1] }}
                      transition={{ duration: 0.5 }}
                      className={`font-mono font-black text-sm ${
                        item.type === "whale"
                          ? "text-purple-400"
                          : "text-[#00ff88]"
                      } drop-shadow-[0_0_8px_rgba(0,255,136,0.8)]`}
                    >
                      {item.amount}
                    </motion.span>
                  )}
                </div>

                <div className="text-[11px] text-[#1F87FC] font-medium truncate max-w-[180px]">
                  {item.market}
                </div>

                {/* 🎲 MULTIPLIER & VOLUME */}
                <div className="flex items-center gap-2 mt-0.5">
                  <motion.div
                    animate={{
                      boxShadow: [
                        "0 0 0px rgba(0,255,136,0.5)",
                        "0 0 12px rgba(0,255,136,0.8)",
                        "0 0 0px rgba(0,255,136,0.5)",
                      ],
                    }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    className="bg-[#00ff88]/20 text-[#00ff88] text-[10px] font-black px-2 py-0.5 rounded-md border border-[#00ff88]/30"
                  >
                    {item.multiplier}
                  </motion.div>

                  <div className="flex items-center gap-1 text-[10px] text-gray-400">
                    <Coins className="w-3 h-3" />
                    <span className="font-mono">{item.volume}</span>
                  </div>
                </div>

                {/* ⏰ URGENT FOMO TAG */}
                {item.urgent && (
                  <motion.div
                    animate={{
                      opacity: [1, 0.5, 1],
                    }}
                    transition={{ duration: 0.8, repeat: Infinity }}
                    className="flex items-center gap-1 bg-red-500/20 text-red-400 text-[9px] font-black px-2 py-0.5 rounded border border-red-500/30 mt-1 w-fit"
                  >
                    <Clock className="w-2.5 h-2.5" />
                    {item.urgent}
                  </motion.div>
                )}
              </div>

              {/* 👉 CLICK TO EXPAND ARROW */}
              <motion.div
                animate={{ x: [0, 4, 0] }}
                transition={{ duration: 1, repeat: Infinity }}
                className="text-[#1F87FC]"
              >
                <ArrowRight className="w-5 h-5" />
              </motion.div>

              {/* 🔴 LIVE PULSE */}
              <div className="absolute -top-2 -right-2 flex h-4 w-4">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00ff88] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-4 w-4 bg-[#00ff88] shadow-[0_0_12px_rgba(0,255,136,1)]"></span>
              </div>
            </motion.div>

            {/* 🎊 EXPANDED STATE TOOLTIP */}
            <AnimatePresence>
              {isExpanded && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute -bottom-14 right-0 bg-gradient-to-br from-[#1F87FC] to-[#00ff88] text-white text-xs font-bold px-4 py-2 rounded-xl shadow-2xl whitespace-nowrap"
                >
                  🎮 Click to join this market!
                  <div className="absolute -top-1 right-6 w-2 h-2 bg-[#1F87FC] rotate-45" />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
