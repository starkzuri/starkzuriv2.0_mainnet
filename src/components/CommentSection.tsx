// import { useState, useEffect } from "react";

// import { useAuth } from "../hooks/useAuth";

// // Your Render Backend URL
// const API_URL = import.meta.env.VITE_INDEXER_SERVER_URL;

// export default function CommentsSection({ marketId }: { marketId: number }) {
//   const [comments, setComments] = useState<any[]>([]);
//   const [commentText, setCommentText] = useState("");
//   const [loading, setLoading] = useState(false);

//   // 🟢 FIX: Use your custom hook here
//   const { address } = useAuth();

//   // 1. Fetch Comments
//   useEffect(() => {
//     if (!marketId) return;

//     const fetchComments = async () => {
//       try {
//         const res = await fetch(`${API_URL}/comments/${marketId}`);
//         const data = await res.json();
//         if (Array.isArray(data)) {
//           setComments(data);
//         }
//       } catch (err) {
//         console.error("Failed to load comments", err);
//       }
//     };

//     fetchComments();
//   }, [marketId]);

//   // 2. Post Comment
//   const handlePostComment = async () => {
//     if (!commentText.trim() || !address) return;

//     setLoading(true);
//     try {
//       const res = await fetch(`${API_URL}/comments`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           marketId: marketId,
//           userAddress: address,
//           text: commentText,
//         }),
//       });

//       if (res.ok) {
//         const newComment = await res.json();
//         setComments([newComment, ...comments]); // Add new comment to top
//         setCommentText(""); // Clear input
//       }
//     } catch (error) {
//       console.error("Error posting comment:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="bg-[#0f0f1a] border border-[#1F87FC]/30 rounded-xl p-4 md:p-6 mt-6">
//       <h3 className="text-white mb-4 text-lg font-semibold">
//         Comments ({comments.length})
//       </h3>

//       {/* Input Area */}
//       <div className="mb-6">
//         <textarea
//           value={commentText}
//           onChange={(e) => setCommentText(e.target.value)}
//           placeholder={
//             address ? "Share your thoughts..." : "Connect wallet to comment"
//           }
//           disabled={!address}
//           className="w-full bg-[#1a1a24] border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#1F87FC] transition-colors resize-none"
//           rows={3}
//         />
//         <div className="flex justify-end mt-2">
//           <button
//             onClick={handlePostComment}
//             disabled={!address || !commentText.trim() || loading}
//             className="px-6 py-2 bg-[#1F87FC] text-white rounded-lg hover:bg-[#1F87FC]/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-medium"
//           >
//             {loading ? "Posting..." : "Post Comment"}
//           </button>
//         </div>
//       </div>

//       {/* Comments List */}
//       <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
//         {comments.map((comment) => (
//           <div
//             key={comment.id}
//             className="flex gap-3 p-4 bg-[#1a1a24] border border-gray-800 rounded-lg"
//           >
//             {/* Avatar Circle */}
//             <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-tr from-[#1F87FC] to-purple-600 flex items-center justify-center text-xs font-bold text-white shadow-lg">
//               {comment.userAddress.slice(0, 2).toUpperCase()}
//             </div>

//             <div className="flex-1 min-w-0">
//               <div className="flex items-center gap-2 mb-1">
//                 <span className="text-[#1F87FC] text-sm font-mono font-medium truncate">
//                   {comment.userAddress.slice(0, 6)}...
//                   {comment.userAddress.slice(-4)}
//                 </span>
//                 <span className="text-gray-500 text-xs">
//                   •{" "}
//                   {new Date(comment.timestamp).toLocaleDateString(undefined, {
//                     month: "short",
//                     day: "numeric",
//                     hour: "2-digit",
//                     minute: "2-digit",
//                   })}
//                 </span>
//               </div>
//               <p className="text-gray-300 text-sm leading-relaxed break-words whitespace-pre-wrap">
//                 {comment.text}
//               </p>
//             </div>
//           </div>
//         ))}

//         {comments.length === 0 && (
//           <div className="text-center py-8">
//             <p className="text-gray-500 text-sm">
//               No comments yet. Start the conversation!
//             </p>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

import { useState, useEffect } from "react";
import { MessageCircle, Send } from "lucide-react";
import { useAuth } from "../hooks/useAuth";

const API_URL = import.meta.env.VITE_INDEXER_SERVER_URL;

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
