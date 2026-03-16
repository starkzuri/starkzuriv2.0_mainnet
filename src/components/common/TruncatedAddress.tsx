import { useState } from "react";

interface TruncatedAddressProps {
  address: string;
  chars?: number;
}

export function TruncatedAddress({
  address,
  chars = 6,
}: TruncatedAddressProps) {
  const [copied, setCopied] = useState(false);

  const truncated = `${address.slice(0, chars)}...${address.slice(-4)}`;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={handleCopy}
      title={address}
      style={{
        background: "var(--bg-hover)",
        border: "1px solid var(--border)",
        borderRadius: "var(--radius-sm)",
        padding: "4px 10px",
        color: "var(--text)",
        fontSize: "13px",
        fontFamily: "monospace",
        cursor: "pointer",
      }}
    >
      {copied ? "Copied!" : truncated}
    </button>
  );
}
