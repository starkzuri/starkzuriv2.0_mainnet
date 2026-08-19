import { useState, useRef } from "react";
import {
  Upload,
  X,
  Film,
  Image as ImageIcon,
  Loader2,
  CheckCircle2,
} from "lucide-react";
import { usePinata } from "../hooks/usePinata";
import { toast } from "sonner";

interface MediaUploaderProps {
  onUploadComplete: (ipfsUrl: string) => void;
}

export function MediaUploader({ onUploadComplete }: MediaUploaderProps) {
  const { uploadFile, uploading } = usePinata();

  const [preview, setPreview] = useState<string | null>(null);
  const [fileType, setFileType] = useState<"image" | "video" | null>(null);
  const [uploaded, setUploaded] = useState(false);
  const [dragging, setDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processFile = async (file: File) => {
    if (file.size > 100 * 1024 * 1024) {
      toast.error("File too large. Max 100MB.");
      return;
    }

    const objectUrl = URL.createObjectURL(file);
    setPreview(objectUrl);
    setFileType(file.type.startsWith("video") ? "video" : "image");
    setUploaded(false);

    toast.loading("Uploading to IPFS…");
    const finalUrl = await uploadFile(file);
    toast.dismiss();

    if (finalUrl) {
      setUploaded(true);
      toast.success("Media uploaded successfully!");
      onUploadComplete(finalUrl);
    } else {
      toast.error("Upload failed");
      setPreview(null);
      setFileType(null);
    }
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) await processFile(e.target.files[0]);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    if (e.dataTransfer.files?.[0]) await processFile(e.dataTransfer.files[0]);
  };

  const clearMedia = (e: React.MouseEvent) => {
    e.stopPropagation();
    setPreview(null);
    setFileType(null);
    setUploaded(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
    onUploadComplete("");
  };

  return (
    <div style={{ width: "100%", fontFamily: "inherit" }}>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileSelect}
        accept="image/*,video/mp4,video/webm"
        style={{ display: "none" }}
      />

      {/* ── Empty / drag state ── */}
      {!preview && (
        <div
          onClick={() => !uploading && fileInputRef.current?.click()}
          onDragOver={(e) => {
            e.preventDefault();
            if (!uploading) setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
          style={{
            height: 200,
            borderRadius: 12,
            border: `1.5px dashed ${dragging ? "#1F87FC" : "rgba(255,255,255,0.1)"}`,
            background: dragging ? "rgba(31,135,252,0.05)" : "rgba(0,0,0,0.15)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 10,
            cursor: uploading ? "not-allowed" : "pointer",
            opacity: uploading ? 0.6 : 1,
            transition: "border-color 0.2s, background 0.2s",
          }}
          onMouseEnter={(e) => {
            if (!uploading && !dragging) {
              (e.currentTarget as HTMLDivElement).style.borderColor =
                "rgba(31,135,252,0.5)";
              (e.currentTarget as HTMLDivElement).style.background =
                "rgba(31,135,252,0.04)";
            }
          }}
          onMouseLeave={(e) => {
            if (!dragging) {
              (e.currentTarget as HTMLDivElement).style.borderColor =
                "rgba(255,255,255,0.1)";
              (e.currentTarget as HTMLDivElement).style.background =
                "rgba(0,0,0,0.15)";
            }
          }}
        >
          {uploading ? (
            <>
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: "50%",
                  background: "rgba(31,135,252,0.1)",
                  border: "1px solid rgba(31,135,252,0.2)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Loader2
                  style={{
                    width: 20,
                    height: 20,
                    color: "#1F87FC",
                    animation: "spin 0.8s linear infinite",
                  }}
                />
              </div>
              <div style={{ textAlign: "center" }}>
                <p
                  style={{
                    fontSize: 13,
                    fontWeight: 500,
                    color: "#64748b",
                    margin: 0,
                  }}
                >
                  Uploading to IPFS…
                </p>
              </div>
            </>
          ) : (
            <>
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: "50%",
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  transition: "background 0.2s",
                }}
              >
                <Upload style={{ width: 18, height: 18, color: "#64748b" }} />
              </div>
              <div style={{ textAlign: "center" }}>
                <p
                  style={{
                    fontSize: 13,
                    fontWeight: 500,
                    color: "#64748b",
                    margin: "0 0 4px",
                  }}
                >
                  {dragging ? "Drop to upload" : "Click or drag to upload"}
                </p>
                <p style={{ fontSize: 11, color: "#3a4a5e", margin: 0 }}>
                  PNG, JPG, MP4, WEBM · Max 100MB
                </p>
              </div>
            </>
          )}
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      )}

      {/* ── Preview state ── */}
      {preview && (
        <div
          style={{
            position: "relative",
            borderRadius: 12,
            overflow: "hidden",
            background: "#0d0d18",
            border: `1px solid ${uploaded ? "rgba(0,255,136,0.25)" : "rgba(31,135,252,0.2)"}`,
            height: 200,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "border-color 0.3s",
          }}
        >
          {/* Media */}
          {fileType === "video" ? (
            <video
              src={preview}
              controls
              style={{ width: "100%", height: "100%", objectFit: "contain" }}
            />
          ) : (
            <img
              src={preview}
              alt="Preview"
              style={{ width: "100%", height: "100%", objectFit: "contain" }}
            />
          )}

          {/* Dark overlay at bottom */}
          <div
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              height: 48,
              background:
                "linear-gradient(to top, rgba(0,0,0,0.75), transparent)",
              pointerEvents: "none",
            }}
          />

          {/* File type badge */}
          <div
            style={{
              position: "absolute",
              bottom: 10,
              left: 10,
              display: "flex",
              alignItems: "center",
              gap: 5,
              background: "rgba(0,0,0,0.55)",
              borderRadius: 6,
              padding: "3px 8px",
            }}
          >
            {fileType === "video" ? (
              <Film style={{ width: 11, height: 11, color: "#94a3b8" }} />
            ) : (
              <ImageIcon style={{ width: 11, height: 11, color: "#94a3b8" }} />
            )}
            <span
              style={{
                fontSize: 10,
                color: "#94a3b8",
                textTransform: "capitalize",
              }}
            >
              {fileType}
            </span>
          </div>

          {/* Status badge */}
          {uploaded && !uploading && (
            <div
              style={{
                position: "absolute",
                bottom: 10,
                right: 42,
                display: "flex",
                alignItems: "center",
                gap: 4,
                background: "rgba(0,255,136,0.12)",
                border: "1px solid rgba(0,255,136,0.25)",
                borderRadius: 6,
                padding: "3px 8px",
              }}
            >
              <CheckCircle2
                style={{ width: 11, height: 11, color: "#00ff88" }}
              />
              <span style={{ fontSize: 10, color: "#00ff88" }}>Uploaded</span>
            </div>
          )}

          {/* Clear button */}
          <button
            onClick={clearMedia}
            style={{
              position: "absolute",
              top: 10,
              right: 10,
              width: 28,
              height: 28,
              borderRadius: "50%",
              background: "rgba(0,0,0,0.6)",
              border: "1px solid rgba(255,255,255,0.1)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              color: "#94a3b8",
              transition: "background 0.15s, color 0.15s",
              zIndex: 10,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "rgba(255,51,102,0.8)";
              e.currentTarget.style.color = "#fff";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "rgba(0,0,0,0.6)";
              e.currentTarget.style.color = "#94a3b8";
            }}
          >
            <X style={{ width: 13, height: 13 }} />
          </button>

          {/* Uploading overlay */}
          {uploading && (
            <div
              style={{
                position: "absolute",
                inset: 0,
                background: "rgba(0,0,0,0.72)",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: 10,
                zIndex: 20,
              }}
            >
              <Loader2
                style={{
                  width: 24,
                  height: 24,
                  color: "#1F87FC",
                  animation: "spin 0.8s linear infinite",
                }}
              />
              <span style={{ fontSize: 12, color: "#64748b" }}>
                Finalizing…
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
