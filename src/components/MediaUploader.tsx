import { useState, useRef } from "react";
import { Upload, X, Film, Image as ImageIcon, Loader2 } from "lucide-react";
import { usePinata } from "../hooks/usePinata";
import { toast } from "sonner";

interface MediaUploaderProps {
  onUploadComplete: (ipfsUrl: string) => void;
}

export function MediaUploader({ onUploadComplete }: MediaUploaderProps) {
  const { uploadFile, uploading } = usePinata();

  const [preview, setPreview] = useState<string | null>(null);
  const [fileType, setFileType] = useState<"image" | "video" | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];

      // 1. Validation
      if (file.size > 100 * 1024 * 1024) {
        toast.error("File too large. Max 100MB.");
        return;
      }

      // 2. Set Preview
      const objectUrl = URL.createObjectURL(file);
      setPreview(objectUrl);
      setFileType(file.type.startsWith("video") ? "video" : "image");

      // 3. Auto-Upload
      toast.loading("Uploading to IPFS...");
      const finalUrl = await uploadFile(file);

      toast.dismiss();

      if (finalUrl) {
        toast.success("Media uploaded successfully!");
        onUploadComplete(finalUrl);
      } else {
        toast.error("Upload failed");
        // Clear preview on failure
        setPreview(null);
        setFileType(null);
      }
    }
  };

  const clearMedia = (e: React.MouseEvent) => {
    e.stopPropagation();
    setPreview(null);
    setFileType(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
    onUploadComplete(""); // Clear the URL in parent form
  };

  return (
    <div className="w-full">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileSelect}
        accept="image/*,video/mp4,video/webm"
        className="hidden"
      />

      {/* EMPTY STATE */}
      {!preview && (
        <div
          onClick={() => !uploading && fileInputRef.current?.click()}
          className={`border-2 border-dashed border-gray-700 rounded-xl h-64 flex flex-col items-center justify-center cursor-pointer transition-colors ${
            uploading
              ? "opacity-50 cursor-not-allowed"
              : "hover:border-[#1F87FC] hover:bg-[#1F87FC]/5"
          }`}
        >
          {uploading ? (
            <Loader2 className="w-10 h-10 text-[#1F87FC] animate-spin mb-2" />
          ) : (
            <Upload className="w-10 h-10 text-gray-400 mb-2" />
          )}
          <p className="text-sm text-gray-400 font-medium">
            {uploading ? "Uploading to IPFS..." : "Click to upload Media"}
          </p>
          <p className="text-xs text-gray-600 mt-1">
            MP4, WEBM, PNG, JPG (Max 100MB)
          </p>
        </div>
      )}

      {/* PREVIEW STATE */}
      {preview && (
        <div className="relative rounded-xl overflow-hidden bg-black border border-gray-800 h-64 flex items-center justify-center">
          <button
            onClick={clearMedia}
            className="absolute top-2 right-2 bg-black/50 hover:bg-red-500/80 p-1.5 rounded-full text-white transition-all z-10"
          >
            <X className="w-4 h-4" />
          </button>

          {fileType === "video" ? (
            <video
              src={preview}
              controls
              className="w-full h-full object-contain"
            />
          ) : (
            <img
              src={preview}
              alt="Preview"
              className="w-full h-full object-contain"
            />
          )}

          <div className="absolute bottom-2 left-2 px-2 py-1 bg-black/60 rounded text-xs text-white flex items-center gap-1">
            {fileType === "video" ? (
              <Film className="w-3 h-3" />
            ) : (
              <ImageIcon className="w-3 h-3" />
            )}
            <span className="capitalize">{fileType} Uploaded</span>
          </div>

          {uploading && (
            <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center z-20">
              <Loader2 className="w-8 h-8 text-[#1F87FC] animate-spin mb-2" />
              <span className="text-xs text-white">Finalizing...</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
