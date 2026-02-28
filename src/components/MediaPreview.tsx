import { useState, useEffect, useRef } from "react";
import { Play, Pause, Volume2, VolumeX, Loader2, ImageOff } from "lucide-react";

interface MediaPreviewProps {
  src?: string;
  type?: "image" | "video";
  alt: string;
  className?: string;
}

export function MediaPreview({
  src,
  type: initialType,
  alt,
  className = "",
}: MediaPreviewProps) {
  const [detectedType, setDetectedType] = useState<"image" | "video">(
    initialType || "image"
  );
  const [status, setStatus] = useState<"loading" | "loaded" | "error">(
    "loading"
  );

  // Video Control States
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true); // Default to muted for browser autoplay policy
  const videoRef = useRef<HTMLVideoElement>(null);

  // 1. URL Resolver
  // temporarily disabled until the month ends
  // const resolveUrl = (url?: string) => {
  //   if (!url) return "";
  //   if (url.startsWith("ipfs://")) {
  //     return url.replace(
  //       "ipfs://",
  //       import.meta.env.VITE_PINATA_GATEWAY_URL ||
  //         "https://gateway.pinata.cloud/ipfs/"
  //     );
  //   }
  //   return url;
  // };

  const resolveUrl = (url?: string) => {
    if (!url) return "";

    // 1. Extract the CID (hash) regardless of the prefix
    let cid = "";
    if (url.startsWith("ipfs://")) {
      cid = url.replace("ipfs://", "");
    } else if (url.includes("/ipfs/")) {
      cid = url.split("/ipfs/")[1];
    } else {
      return url; // It's a normal image (unsplash, etc.)
    }

    // 2. 🟢 Return a reliable Public Gateway URL
    // Try this specific one:
    return `https://dweb.link/ipfs/${cid}`;
  };
  const url = resolveUrl(src);

  // 2. Type Detection
  useEffect(() => {
    if (!url || initialType) return;
    if (url.match(/\.(mp4|webm|ogg|mov)$/i)) {
      setDetectedType("video");
    }
  }, [url, initialType]);

  // 3. 🟢 AUTOPLAY ON SCROLL (Intersection Observer)
  useEffect(() => {
    if (detectedType !== "video" || !videoRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          // If 50% of the video is visible, try to play
          if (entry.isIntersecting) {
            videoRef.current
              ?.play()
              .then(() => setIsPlaying(true))
              .catch(() => {
                // Autoplay blocked (usually because unmuted), ignore or show play button
                setIsPlaying(false);
              });
          } else {
            // Pause when scrolled out of view
            videoRef.current?.pause();
            setIsPlaying(false);
          }
        });
      },
      { threshold: 0.5 } // Trigger when 50% visible
    );

    observer.observe(videoRef.current);
    return () => observer.disconnect();
  }, [detectedType, status]);

  // 4. Manual Controls Handlers
  const togglePlay = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent clicking the card (navigation)
    if (!videoRef.current) return;

    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!videoRef.current) return;

    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  // --- Render ---

  if (!url) {
    return (
      <div
        className={`w-full aspect-video bg-[#0f0f1a] rounded-xl flex items-center justify-center text-muted-foreground border border-[#1F87FC]/10 ${className}`}
      >
        <ImageOff className="w-6 h-6 opacity-50" />
      </div>
    );
  }

  return (
    <div
      className={`relative w-full aspect-video overflow-hidden rounded-xl bg-black/20 ${className}`}
    >
      {status === "loading" && (
        <div className="absolute inset-0 flex items-center justify-center bg-[#1a1a24] animate-pulse z-10">
          <Loader2 className="w-8 h-8 text-[#1F87FC] animate-spin" />
        </div>
      )}

      {detectedType === "video" ? (
        <div className="relative w-full h-full group">
          <video
            ref={videoRef}
            muted={isMuted} // Controlled by React state
            loop
            playsInline
            onLoadedData={() => setStatus("loaded")}
            onError={() => setStatus("error")}
            className={`w-full h-full object-cover transition-opacity duration-500 ${
              status === "loaded" ? "opacity-100" : "opacity-0"
            }`}
          >
            {/* 🟢 FORCE VIDEO TYPE for Pinata */}
            <source src={url} type="video/mp4" />
            <source src={url} type="video/webm" />
            <source src={url} />
          </video>

          {/* 🟢 CUSTOM CONTROLS OVERLAY */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity z-20">
            <div className="absolute bottom-4 left-4 right-4 flex items-center gap-3">
              {/* Play/Pause Button */}
              <button
                onClick={togglePlay}
                className="bg-[#1F87FC]/80 hover:bg-[#1F87FC] border border-[#1F87FC] rounded-full p-2 transition-all hover:scale-105"
              >
                {isPlaying ? (
                  <Pause className="w-4 h-4 text-white" />
                ) : (
                  <Play className="w-4 h-4 text-white fill-white" />
                )}
              </button>

              {/* Mute/Unmute Button */}
              <button
                onClick={toggleMute}
                className="bg-black/40 hover:bg-black/60 border border-white/20 rounded-full p-2 transition-all backdrop-blur-sm"
              >
                {isMuted ? (
                  <VolumeX className="w-4 h-4 text-white" />
                ) : (
                  <Volume2 className="w-4 h-4 text-white" />
                )}
              </button>
            </div>
          </div>

          {/* Big Play Button (When Paused) */}
          {!isPlaying && status === "loaded" && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="bg-black/30 rounded-full p-4 backdrop-blur-sm border border-white/10">
                <Play className="w-8 h-8 text-white fill-white ml-1" />
              </div>
            </div>
          )}
        </div>
      ) : (
        <img
          src={url}
          alt={alt}
          onLoad={() => setStatus("loaded")}
          onError={() => {
            if (detectedType === "image" && !initialType) {
              setDetectedType("video");
              setStatus("loading");
            } else {
              setStatus("error");
            }
          }}
          className={`w-full h-full object-cover transition-transform duration-700 hover:scale-105 ${
            status === "loaded" ? "opacity-100" : "opacity-0"
          }`}
        />
      )}
    </div>
  );
}
