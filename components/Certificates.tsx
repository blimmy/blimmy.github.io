"use client";
import { useRef, useState, useEffect } from "react";
import {
  ArrowUpRight,
  FileImage,
  X,
  ZoomIn,
  ZoomOut,
  RotateCcw,
} from "lucide-react";
import { certificates, type Certificate } from "@/data/certificates";
import { visible } from "@/lib/content";
export function CertificateCard({
  certificate,
  onOpen,
}: {
  certificate: Certificate;
  onOpen: (c: Certificate) => void;
}) {
  const [failed, setFailed] = useState(false);
  return (
    <button
      className="certificate-card"
      onClick={() => onOpen(certificate)}
      aria-label={`View ${certificate.title}`}
    >
      <div className="certificate-frame">
        {certificate.image && !failed ? (
          <img
            src={certificate.image}
            alt={`${certificate.title} certificate`}
            loading="lazy"
            onError={() => setFailed(true)}
          />
        ) : (
          <div className="certificate-placeholder">
            <span className="frame-corner tl" />
            <span className="frame-corner tr" />
            <span className="frame-corner bl" />
            <span className="frame-corner br" />
            <FileImage size={28} strokeWidth={1} />
            <span className="mono">
              CERTIFICATE IMAGE
              <br />— PENDING —
            </span>
          </div>
        )}
        <span className="certificate-index mono">
          CREDENTIAL / {String(certificate.order).padStart(2, "0")}
        </span>
        <span className="certificate-expand">
          <ArrowUpRight size={19} />
        </span>
      </div>
      <div className="certificate-meta">
        <span className="mono">{certificate.issuer}</span>
        <h3>{certificate.title}</h3>
        <span className="mono muted">{certificate.date ?? "DATE PENDING"}</span>
      </div>
    </button>
  );
}
export default function Certificates() {
  const [category, setCategory] = useState("All");
  const [selected, setSelected] = useState<Certificate | null>(null);
  const [zoom, setZoom] = useState(1);
  const [failed, setFailed] = useState(false);
  const dialog = useRef<HTMLDialogElement>(null);
  const records = visible(certificates);
  const categories = ["All", ...new Set(records.map((c) => c.category))];
  const open = (c: Certificate) => {
    setSelected(c);
    setZoom(1);
    setFailed(false);
    dialog.current?.showModal();
  };
  useEffect(() => {
    if (!selected) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [selected]);
  return (
    <>
      <div className="filter-bar" aria-label="Filter credentials">
        {categories.map((c) => (
          <button
            key={c}
            aria-pressed={c === category}
            onClick={() => setCategory(c)}
          >
            {c}
          </button>
        ))}
      </div>
      <div className="certificate-grid">
        {records
          .filter((c) => category === "All" || c.category === category)
          .map((c) => (
            <CertificateCard key={c.id} certificate={c} onOpen={open} />
          ))}
      </div>
      <dialog
        className="certificate-dialog"
        ref={dialog}
        aria-labelledby="certificate-title"
        onClose={() => setSelected(null)}
        onClick={(e) => {
          if (e.target === dialog.current) dialog.current.close();
        }}
      >
        <div className="dialog-inner" data-lenis-prevent>
          {selected && (
            <>
              <header>
                <div>
                  <span className="eyebrow">CREDENTIAL RECORD</span>
                  <h3 id="certificate-title">{selected.title}</h3>
                </div>
                <button
                  className="icon-button"
                  aria-label="Close certificate"
                  onClick={() => dialog.current?.close()}
                >
                  <X />
                </button>
              </header>
              <div className="lightbox-image">
                {selected.image && !failed ? (
                  <img
                    src={selected.image}
                    alt={selected.title}
                    style={{ width: `${zoom * 100}%`, maxWidth: "none" }}
                    onError={() => setFailed(true)}
                  />
                ) : (
                  <div className="lightbox-pending">
                    <FileImage size={50} strokeWidth={1} />
                    <p className="mono">[ CERTIFICATE IMAGE — PENDING ]</p>
                    <p>
                      The training is listed in my resume.
                      <br />
                      The certificate image has not been added yet.
                    </p>
                  </div>
                )}
              </div>
              <footer>
                <div className="zoom-controls">
                  <button
                    className="icon-button"
                    disabled={!selected.image || failed || zoom <= 1}
                    aria-label="Zoom out"
                    onClick={() => setZoom((z) => Math.max(1, z - 0.25))}
                  >
                    <ZoomOut />
                  </button>
                  <span className="mono">{Math.round(zoom * 100)}%</span>
                  <button
                    className="icon-button"
                    disabled={!selected.image || failed || zoom >= 3}
                    aria-label="Zoom in"
                    onClick={() => setZoom((z) => Math.min(3, z + 0.25))}
                  >
                    <ZoomIn />
                  </button>
                  <button
                    className="icon-button"
                    disabled={!selected.image || failed}
                    aria-label="Reset zoom"
                    onClick={() => setZoom(1)}
                  >
                    <RotateCcw size={16} />
                  </button>
                </div>
                <span className="mono">
                  {selected.issuer} / {selected.date ?? "Date pending"}
                </span>
              </footer>
              <p>{selected.related}</p>
              <p className="mono muted">
                Credential ID: {selected.credentialId ?? "Pending"}
              </p>
              {selected.verificationUrl && (
                <a
                  className="text-link"
                  href={selected.verificationUrl}
                  target="_blank"
                  rel="noreferrer"
                >
                  Verify credential <ArrowUpRight size={16} />
                </a>
              )}
            </>
          )}
        </div>
      </dialog>
    </>
  );
}
