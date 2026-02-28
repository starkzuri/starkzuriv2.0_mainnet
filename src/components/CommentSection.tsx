import { useState, useEffect } from "react";
// 🟢 FIX: Import from your custom context, NOT @starknet-react/core
import { useWallet } from "../context/WalletContext";

// Your Render Backend URL
const API_URL = "https://starknet-indexer-apibara-mainnet.onrender.com";

export default function CommentsSection({ marketId }: { marketId: number }) {
  const [comments, setComments] = useState<any[]>([]);
  const [commentText, setCommentText] = useState("");
  const [loading, setLoading] = useState(false);

  // 🟢 FIX: Use your custom hook here
  const { address } = useWallet();

  // 1. Fetch Comments
  useEffect(() => {
    if (!marketId) return;

    const fetchComments = async () => {
      try {
        const res = await fetch(`${API_URL}/comments/${marketId}`);
        const data = await res.json();
        if (Array.isArray(data)) {
          setComments(data);
        }
      } catch (err) {
        console.error("Failed to load comments", err);
      }
    };

    fetchComments();
  }, [marketId]);

  // 2. Post Comment
  const handlePostComment = async () => {
    if (!commentText.trim() || !address) return;

    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          marketId: marketId,
          userAddress: address,
          text: commentText,
        }),
      });

      if (res.ok) {
        const newComment = await res.json();
        setComments([newComment, ...comments]); // Add new comment to top
        setCommentText(""); // Clear input
      }
    } catch (error) {
      console.error("Error posting comment:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#0f0f1a] border border-[#1F87FC]/30 rounded-xl p-4 md:p-6 mt-6">
      <h3 className="text-white mb-4 text-lg font-semibold">
        Comments ({comments.length})
      </h3>

      {/* Input Area */}
      <div className="mb-6">
        <textarea
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          placeholder={
            address ? "Share your thoughts..." : "Connect wallet to comment"
          }
          disabled={!address}
          className="w-full bg-[#1a1a24] border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#1F87FC] transition-colors resize-none"
          rows={3}
        />
        <div className="flex justify-end mt-2">
          <button
            onClick={handlePostComment}
            disabled={!address || !commentText.trim() || loading}
            className="px-6 py-2 bg-[#1F87FC] text-white rounded-lg hover:bg-[#1F87FC]/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-medium"
          >
            {loading ? "Posting..." : "Post Comment"}
          </button>
        </div>
      </div>

      {/* Comments List */}
      <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
        {comments.map((comment) => (
          <div
            key={comment.id}
            className="flex gap-3 p-4 bg-[#1a1a24] border border-gray-800 rounded-lg"
          >
            {/* Avatar Circle */}
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-tr from-[#1F87FC] to-purple-600 flex items-center justify-center text-xs font-bold text-white shadow-lg">
              {comment.userAddress.slice(0, 2).toUpperCase()}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[#1F87FC] text-sm font-mono font-medium truncate">
                  {comment.userAddress.slice(0, 6)}...
                  {comment.userAddress.slice(-4)}
                </span>
                <span className="text-gray-500 text-xs">
                  •{" "}
                  {new Date(comment.timestamp).toLocaleDateString(undefined, {
                    month: "short",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
              <p className="text-gray-300 text-sm leading-relaxed break-words whitespace-pre-wrap">
                {comment.text}
              </p>
            </div>
          </div>
        ))}

        {comments.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500 text-sm">
              No comments yet. Start the conversation!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
