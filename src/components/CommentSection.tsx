import { useState, useEffect } from "react";
import { MessageCircle, Send } from "lucide-react";
import { useAuth } from "../hooks/useAuth";

import { INDEXER_URL as API_URL } from "../constants";

export default function CommentsSection({ marketId }: { marketId: number }) {
  const [comments, setComments] = useState<any[]>([]);
  const [commentText, setCommentText] = useState("");
  const [loading, setLoading] = useState(false);
  const { address } = useAuth();

  useEffect(() => {
    if (!marketId) return;
    const fetchComments = async () => {
      try {
        const res = await fetch(`${API_URL}/comments/${marketId}`);
        const data = await res.json();
        if (Array.isArray(data)) setComments(data);
      } catch (err) {
        console.error("Failed to load comments", err);
      }
    };
    fetchComments();
  }, [marketId]);

  const handlePostComment = async () => {
    if (!commentText.trim() || !address) return;
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          marketId,
          userAddress: address,
          text: commentText,
        }),
      });
      if (res.ok) {
        const newComment = await res.json();
        setComments([newComment, ...comments]);
        setCommentText("");
      }
    } catch (error) {
      console.error("Error posting comment:", error);
    } finally {
      setLoading(false);
    }
  };

  const shortAddr = (addr: string) => `${addr.slice(0, 6)}…${addr.slice(-4)}`;

  const formatDate = (ts: string) =>
    new Date(ts).toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  // generate a stable hue from address for avatar colour
  const addrHue = (addr: string) => {
    let hash = 0;
    for (let i = 0; i < addr.length; i++)
      hash = addr.charCodeAt(i) + ((hash << 5) - hash);
    return Math.abs(hash) % 360;
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 16,
        fontFamily: "inherit",
      }}
    >
      {/* Section label */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 6,
          fontSize: 12,
          fontWeight: 500,
          color: "#64748b",
          letterSpacing: "0.04em",
        }}
      >
        <MessageCircle style={{ width: 12, height: 12 }} />
        Comments · {comments.length}
      </div>

      {/* Input area */}
      <div
        style={{
          background: "rgba(255,255,255,0.02)",
          border: "1px solid rgba(255,255,255,0.07)",
          borderRadius: 12,
          overflow: "hidden",
        }}
      >
        <textarea
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          placeholder={
            address ? "Share your thoughts…" : "Connect wallet to comment"
          }
          disabled={!address}
          rows={3}
          style={{
            width: "100%",
            boxSizing: "border-box",
            background: "transparent",
            border: "none",
            outline: "none",
            resize: "none",
            padding: "12px 14px",
            fontSize: 13,
            color: "#e2e8f0",
            fontFamily: "inherit",
            lineHeight: 1.6,
          }}
          onFocus={(e) => {
            (
              e.currentTarget.parentElement as HTMLDivElement
            ).style.borderColor = "rgba(31,135,252,0.4)";
          }}
          onBlur={(e) => {
            (
              e.currentTarget.parentElement as HTMLDivElement
            ).style.borderColor = "rgba(255,255,255,0.07)";
          }}
        />
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end",
            padding: "8px 10px",
            borderTop: "1px solid rgba(255,255,255,0.05)",
            background: "rgba(0,0,0,0.15)",
          }}
        >
          <button
            onClick={handlePostComment}
            disabled={!address || !commentText.trim() || loading}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              padding: "7px 14px",
              background:
                address && commentText.trim() && !loading
                  ? "#1F87FC"
                  : "rgba(255,255,255,0.05)",
              color:
                address && commentText.trim() && !loading ? "#fff" : "#3a4a5e",
              border: "none",
              borderRadius: 8,
              fontSize: 12,
              fontWeight: 600,
              cursor:
                address && commentText.trim() && !loading
                  ? "pointer"
                  : "not-allowed",
              fontFamily: "inherit",
              transition: "background 0.15s, color 0.15s",
            }}
            onMouseEnter={(e) => {
              if (address && commentText.trim() && !loading)
                e.currentTarget.style.opacity = "0.85";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.opacity = "1";
            }}
          >
            <Send style={{ width: 11, height: 11 }} />
            {loading ? "Posting…" : "Post"}
          </button>
        </div>
      </div>

      {/* Comments list */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 8,
          maxHeight: 480,
          overflowY: "auto",
          paddingRight: 2,
        }}
      >
        {comments.length === 0 ? (
          <div
            style={{
              textAlign: "center",
              padding: "32px 0",
              fontSize: 12,
              color: "#3a4a5e",
            }}
          >
            No comments yet — start the conversation
          </div>
        ) : (
          comments.map((comment) => {
            const hue = addrHue(comment.userAddress);
            return (
              <div
                key={comment.id}
                style={{
                  display: "flex",
                  gap: 10,
                  padding: "12px 13px",
                  background: "rgba(255,255,255,0.02)",
                  border: "1px solid rgba(255,255,255,0.05)",
                  borderRadius: 12,
                }}
              >
                {/* Avatar */}
                <div
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: "50%",
                    background: `hsl(${hue}, 60%, 30%)`,
                    border: `1.5px solid hsl(${hue}, 60%, 45%)`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 11,
                    fontWeight: 700,
                    color: `hsl(${hue}, 80%, 80%)`,
                    flexShrink: 0,
                  }}
                >
                  {comment.userAddress.slice(2, 4).toUpperCase()}
                </div>

                <div style={{ flex: 1, minWidth: 0 }}>
                  {/* Address + timestamp */}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      marginBottom: 5,
                      flexWrap: "wrap",
                    }}
                  >
                    <span
                      style={{
                        fontSize: 11,
                        fontWeight: 600,
                        color: `hsl(${hue}, 70%, 70%)`,
                        fontVariantNumeric: "tabular-nums",
                      }}
                    >
                      {shortAddr(comment.userAddress)}
                    </span>
                    <span style={{ fontSize: 10, color: "#3a4a5e" }}>
                      {formatDate(comment.timestamp)}
                    </span>
                  </div>
                  {/* Text */}
                  <p
                    style={{
                      fontSize: 13,
                      color: "#94a3b8",
                      lineHeight: 1.6,
                      margin: 0,
                      wordBreak: "break-word",
                      whiteSpace: "pre-wrap",
                    }}
                  >
                    {comment.text}
                  </p>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
