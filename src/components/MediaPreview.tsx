import { useState, useEffect, useRef } from "react";
import { Play, Pause, Volume2, VolumeX, Loader2, ImageOff } from "lucide-react";

interface MediaPreviewProps {
  src?: string;
  type?: "image" | "video";
  alt: string;
  className?: string;
  /** Applied to the root element. Callers (PredictionCard, Profile) pass sizing here. */
  style?: React.CSSProperties;
}

export function MediaPreview({
  src,
  type: initialType,
  alt,
  className = "",
  style,
}: MediaPreviewProps) {
  const [detectedType, setDetectedType] = useState<"image" | "video">(
    initialType || "image"
  );
  const [status, setStatus] = useState<"loading" | "loaded" | "error">(
    "loading"
  );
  // Guards the image -> video fallback so a failure can never loop forever.
  const [triedVideoFallback, setTriedVideoFallback] = useState(false);

  // Video Control States
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true); // Default to muted for browser autoplay policy
  const videoRef = useRef<HTMLVideoElement>(null);

  // 1. URL Resolver
  //
  // This used to rewrite every /ipfs/ URL to https://dweb.link/ipfs/<cid> to
  // save Pinata bandwidth. That silently broke all market media: dweb.link
  // 301s to a per-CID subdomain and frequently answers 504 with an HTML error
  // body, and an <img> that receives text/html is killed by Chrome's opaque
  // response blocking (net::ERR_BLOCKED_BY_RESPONSE.NotSameOrigin). Pasting
  // the link in a tab still worked, which made it look like a gateway that was
  // fine — top-level navigation isn't subject to that blocking, <img> is.
  //
  // So: never rewrite a URL that already resolves. Only map bare ipfs:// refs.
  const PINATA_GATEWAY =
    import.meta.env.VITE_PINATA_GATEWAY_URL || "gateway.pinata.cloud";

  const resolveUrl = (url?: string) => {
    if (!url) return "";
    if (url.startsWith("ipfs://")) {
      const cid = url.replace("ipfs://", "");
      const host = PINATA_GATEWAY.replace(/^https?:\/\//, "").replace(/\/+$/, "");
      return `https://${host}/ipfs/${cid}`;
    }
    // Already an http(s) URL (or a data: URI) — serve it as stored.
    return url;
  };

  /**
   * Pinata dedicated gateways support on-the-fly image resizing. Serving a
   * card-sized WebP instead of the full-resolution original cuts transfer by
   * ~88% (1.0 MB -> 119 KB across the current markets), which is a far bigger
   * saving than switching gateways ever was — and it still renders.
   * Only applied to Pinata hosts; img-* params are a Pinata feature, not IPFS.
   */
  const withImageOptimization = (url: string) => {
    if (!url.includes("mypinata.cloud") || detectedType === "video") return url;
    if (url.includes("img-width")) return url;
    const sep = url.includes("?") ? "&" : "?";
    return `${url}${sep}img-width=800&img-format=webp&img-quality=80`;
  };

  const resolved = resolveUrl(src);
  const url = resolved;

  // 2. Type Detection
  // Reset on every new url so state from a previous market can't leak into this
  // one (a stale "error"/"video" would otherwise blank an unrelated card).
  useEffect(() => {
    setStatus("loading");
    setTriedVideoFallback(false);
    setDetectedType(
      initialType || (url.match(/\.(mp4|webm|ogg|mov)$/i) ? "video" : "image")
    );
  }, [url, initialType]);

  /**
   * Called when the <img> fails to load.
   *
   * A failed <img> means one of two very different things: the file is actually
   * a video, or the request just failed. The old code assumed "video" and
   * swapped in a <video> element, which never fires onLoadedData for a JPEG —
   * so a single slow response left the card stuck at opacity-0 forever.
   *
   * Ask the gateway what the file really is instead of guessing. IPFS gateways
   * send `access-control-allow-origin: *`, so this HEAD is allowed from the
   * browser. If the probe itself fails we surface the error state rather than
   * silently blanking.
   */
  const handleImageError = async () => {
    if (triedVideoFallback) {
      setStatus("error");
      return;
    }
    setTriedVideoFallback(true);

    try {
      const res = await fetch(url, { method: "HEAD" });
      const contentType = res.headers.get("content-type") || "";

      if (contentType.startsWith("video/")) {
        setDetectedType("video");
        setStatus("loading");
        return;
      }
      if (res.ok && contentType.startsWith("image/")) {
        // It really is an image — the <img> load was a transient failure.
        setStatus("loading");
        setDetectedType("image");
        return;
      }
      setStatus("error");
    } catch {
      // HEAD blocked or gateway unreachable: fall back to the old behaviour of
      // trying <video>, which is still right for genuine video uploads.
      setDetectedType("video");
      setStatus("loading");
    }
  };

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

  if (!url || status === "error") {
    return (
      <div
        className={`w-full aspect-video bg-[#0f0f1a] rounded-xl flex items-center justify-center text-muted-foreground border border-[#1F87FC]/10 ${className}`}
        style={style}
      >
        <ImageOff className="w-6 h-6 opacity-50" />
      </div>
    );
  }

  return (
    <div
      className={`relative w-full aspect-video overflow-hidden rounded-xl bg-black/20 ${className}`}
      style={style}
    >
      {status === "loading" && (
        <div className="absolute inset-0 flex items-center justify-center bg-[#1a1a24] animate-pulse z-10">
          <Loader2 className="w-8 h-8 text-[#1F87FC] animate-spin" />
        </div>
      )}

      {detectedType === "video" ? (
        <div className="relative w-full h-full group">
          {/*
            src is set directly rather than via <source> children: with <source>
            children the error event fires on the <source>, not the <video>, so
            onError never ran and a failed load sat at opacity-0 forever.
          */}
          <video
            ref={videoRef}
            src={url}
            muted={isMuted} // Controlled by React state
            loop
            playsInline
            onLoadedData={() => setStatus("loaded")}
            onError={() => setStatus("error")}
            className={`w-full h-full object-cover transition-opacity duration-500 ${
              status === "loaded" ? "opacity-100" : "opacity-0"
            }`}
          />

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
          src={withImageOptimization(url)}
          alt={alt}
          onLoad={() => setStatus("loaded")}
          onError={handleImageError}
          className={`w-full h-full object-cover transition-transform duration-700 hover:scale-105 ${
            status === "loaded" ? "opacity-100" : "opacity-0"
          }`}
        />
      )}
    </div>
  );
}
