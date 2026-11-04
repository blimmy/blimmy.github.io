"use client";
import { useRef, useState, type ReactNode } from "react";
import { Copy, Check } from "lucide-react";
export default function CodeBlock({
  children,
  ...props
}: {
  children?: ReactNode;
}) {
  const ref = useRef<HTMLPreElement>(null);
  const [state, setState] = useState("Copy");
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(ref.current?.textContent ?? "");
      setState("Copied");
      setTimeout(() => setState("Copy"), 2000);
    } catch {
      setState("Select text to copy");
    }
  };
  return (
    <div className="code-block">
      <button onClick={copy} className="mono" aria-label="Copy code">
        {state === "Copied" ? <Check size={14} /> : <Copy size={14} />}
        <span role="status">{state}</span>
      </button>
      <pre ref={ref} {...props}>
        {children}
      </pre>
    </div>
  );
}
