"use client";
import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, CornerDownLeft } from "lucide-react";
import { commands, executeCommand } from "@/lib/terminal";
export default function Terminal() {
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [cursor, setCursor] = useState(-1);
  const [draft, setDraft] = useState("");
  const [output, setOutput] = useState([
    {
      command: "",
      text: "blimmy / interactive shell [v.1.0]\nA small window into my work.\nType help to begin, or try a command below.",
    },
  ]);
  const log = useRef<HTMLDivElement>(null);
  const field = useRef<HTMLInputElement>(null);
  const [suggestion, setSuggestion] = useState("");
  useEffect(() => {
    if (log.current) log.current.scrollTop = log.current.scrollHeight;
  }, [output]);
  const run = (command: string) => {
    if (!command.trim()) return;
    setHistory((h) => [...h.slice(-99), command]);
    setCursor(-1);
    setInput("");
    setSuggestion("");
    if (command.trim().toLowerCase() === "clear") setOutput([]);
    else
      setOutput((o) => [
        ...o.slice(-49),
        { command, text: executeCommand(command) },
      ]);
  };
  return (
    <div className="terminal-shell">
      <div className="terminal-top mono">
        <span>
          <i />
          blimmy@portfolio: ~
        </span>
        <span>
          READ / EXPLORE <ArrowUpRight size={14} />
        </span>
      </div>
      <div
        className="terminal-output"
        ref={log}
        data-lenis-prevent
        tabIndex={0}
        aria-label="Terminal output"
        role="log"
        aria-live="polite"
        aria-relevant="additions"
      >
        {output.map((entry, i) => (
          <div className="terminal-entry" key={`${i}-${entry.command}`}>
            {entry.command && (
              <p className="terminal-command">
                <span>visitor@blimmy ~ %</span> {entry.command}
              </p>
            )}
            <pre>{entry.text}</pre>
          </div>
        ))}
      </div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          run(input);
        }}
        className="terminal-input"
      >
        <label htmlFor="terminal-command" className="mono">
          ~ % <span className="sr-only">Terminal command</span>
        </label>
        <input
          ref={field}
          id="terminal-command"
          value={input}
          onChange={(e) => {
            setInput(e.target.value);
            setCursor(-1);
            setSuggestion("");
          }}
          autoComplete="off"
          autoCapitalize="off"
          spellCheck={false}
          maxLength={200}
          placeholder="type a command..."
          aria-describedby="terminal-hint"
          onKeyDown={(e) => {
            if (e.key === "ArrowUp") {
              e.preventDefault();
              if (!history.length) return;
              if (cursor === -1) setDraft(input);
              const next =
                cursor < 0 ? history.length - 1 : Math.max(0, cursor - 1);
              setCursor(next);
              setInput(history[next]);
            }
            if (e.key === "ArrowDown") {
              e.preventDefault();
              if (cursor < 0) return;
              const next = cursor + 1;
              if (next >= history.length) {
                setCursor(-1);
                setInput(draft);
              } else {
                setCursor(next);
                setInput(history[next]);
              }
            }
            if (e.key === "Tab" && !e.shiftKey && input) {
              const matches = commands.filter((c) =>
                c.startsWith(input.toLowerCase()),
              );
              if (matches.length) {
                e.preventDefault();
                if (matches.length === 1) setInput(matches[0]);
                else setSuggestion(matches.join(" · "));
              }
            }
            if (e.ctrlKey && e.key === "l") {
              e.preventDefault();
              setOutput([]);
            }
          }}
        />
        <button aria-label="Run command" type="submit">
          <CornerDownLeft size={19} />
        </button>
      </form>
      <div className="terminal-shortcuts">
        <span className="mono" id="terminal-hint">
          {suggestion || "↑ ↓ HISTORY / TAB COMPLETE"}
        </span>
        <div>
          {["help", "whoami", "achievements", "projects"].map((c) => (
            <button
              key={c}
              onClick={() => {
                run(c);
                field.current?.focus();
              }}
            >
              {c}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
