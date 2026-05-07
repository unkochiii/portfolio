"use client";

import Image from "next/image";
import { useActionState, useEffect, useState } from "react";
import { sendContactEmail, type ContactState } from "./actions";

// ────────────────────────────────────────────────────────────────
// Icons
// ────────────────────────────────────────────────────────────────

function GithubIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden
    >
      <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
    </svg>
  );
}

function LinkedinIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden
    >
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

function MailIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      aria-hidden
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
      />
    </svg>
  );
}

function PhoneIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      aria-hidden
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
      />
    </svg>
  );
}

function SunIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      aria-hidden
    >
      <circle cx="12" cy="12" r="5" />
      <line x1="12" y1="1" x2="12" y2="3" />
      <line x1="12" y1="21" x2="12" y2="23" />
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
      <line x1="1" y1="12" x2="3" y2="12" />
      <line x1="21" y1="12" x2="23" y2="12" />
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
      <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
    </svg>
  );
}

function MoonIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  );
}

// ────────────────────────────────────────────────────────────────
// Theme Toggle
// ────────────────────────────────────────────────────────────────

function ThemeToggle({
  dark,
  onToggle,
}: {
  dark: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      onClick={onToggle}
      aria-label={dark ? "Passer en mode clair" : "Passer en mode sombre"}
      className="relative w-8 h-8 flex items-center justify-center rounded-full text-gray-500 hover:bg-gray-100 hover:text-gray-800 dark:text-gray-400 dark:hover:bg-[#1a3a5c] dark:hover:text-gray-100 transition-colors flex-shrink-0"
    >
      {/* Sun — visible in light mode */}
      <span
        className="absolute transition-all duration-300"
        style={{
          opacity: dark ? 0 : 1,
          transform: dark
            ? "rotate(90deg) scale(0.4)"
            : "rotate(0deg) scale(1)",
        }}
      >
        <SunIcon />
      </span>
      {/* Moon — visible in dark mode */}
      <span
        className="absolute transition-all duration-300"
        style={{
          opacity: dark ? 1 : 0,
          transform: dark
            ? "rotate(0deg) scale(1)"
            : "rotate(-90deg) scale(0.4)",
        }}
      >
        <MoonIcon />
      </span>
    </button>
  );
}

// ────────────────────────────────────────────────────────────────
// Lightbox
// ────────────────────────────────────────────────────────────────

type LightboxProps = {
  images: string[];
  startIndex: number;
  title: string;
  onClose: () => void;
};

function Lightbox({ images, startIndex, title, onClose }: LightboxProps) {
  const [current, setCurrent] = useState(startIndex);

  const prev = () => setCurrent((c) => (c - 1 + images.length) % images.length);
  const next = () => setCurrent((c) => (c + 1) % images.length);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative flex flex-col items-center gap-4 max-w-[90vw] max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          aria-label="Fermer"
          className="absolute -top-10 right-0 text-white/70 hover:text-white transition-colors text-3xl leading-none"
        >
          ×
        </button>

        <div
          className={`relative rounded-2xl overflow-hidden shadow-2xl ${
            images.length === 1
              ? "w-[min(800px,90vw)] h-[min(600px,80vh)]"
              : "w-[min(320px,80vw)] h-[min(580px,75vh)]"
          }`}
        >
          <Image
            src={images[current]}
            alt={`${title} screenshot ${current + 1}`}
            fill
            className="object-contain"
          />
        </div>

        {images.length > 1 && (
          <div className="flex items-center gap-6">
            <button
              onClick={prev}
              className="text-white/70 hover:text-white transition-colors text-2xl px-2"
              aria-label="Précédent"
            >
              ‹
            </button>
            <div className="flex gap-2">
              {images.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrent(i)}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    i === current ? "bg-white" : "bg-white/40 hover:bg-white/70"
                  }`}
                  aria-label={`Image ${i + 1}`}
                />
              ))}
            </div>
            <button
              onClick={next}
              className="text-white/70 hover:text-white transition-colors text-2xl px-2"
              aria-label="Suivant"
            >
              ›
            </button>
          </div>
        )}

        <p className="text-white/50 text-xs">
          {current + 1} / {images.length}
        </p>
      </div>
    </div>
  );
}

// ────────────────────────────────────────────────────────────────
// Sub-components
// ────────────────────────────────────────────────────────────────

function Tag({ label }: { label: string }) {
  return (
    <span className="px-3 py-1 text-xs rounded-full bg-blue-100 text-blue-600 dark:bg-[#1e3a5f] dark:text-[#7ab3e0] font-medium">
      {label}
    </span>
  );
}

type MainProjectCardProps = {
  title: string;
  description: string;
  tags: string[];
  images?: string[];
  label?: string;
  labelUrl?: string;
};

function MainProjectCard({
  title,
  description,
  tags,
  images,
  label = "Votre texte ici",
  labelUrl,
}: MainProjectCardProps) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  return (
    <>
      <div className="bg-white dark:bg-[#1a2a3e] rounded-2xl p-6 flex flex-col gap-4 shadow-sm">
        <div className="flex justify-between items-start">
          <h3 className="text-[#4a7aa8] font-semibold text-lg leading-snug">
            {title}
          </h3>
          {labelUrl ? (
            <a
              href={labelUrl}
              target="_blank"
              rel="noreferrer"
              className="group relative"
              aria-label={label}
            >
              <span className="text-[#4a7aa8] hover:text-[#2d5f8a] transition-colors text-xs font-medium flex items-center justify-center w-5 h-5 rounded-full border border-[#4a7aa8]">
                i
              </span>
              <div className="absolute right-0 top-7 bg-[#4a7aa8] text-white text-xs px-2 py-1 rounded whitespace-normal w-48 hidden group-hover:block z-10 pointer-events-none">
                {label}
              </div>
            </a>
          ) : (
            <div className="group relative">
              <span className="text-[#4a7aa8] text-xs font-medium flex items-center justify-center w-5 h-5 rounded-full border border-[#4a7aa8] cursor-help">
                i
              </span>
              <div className="absolute right-0 top-7 bg-[#4a7aa8] text-white text-xs px-2 py-1 rounded whitespace-normal w-48 hidden group-hover:block z-10 pointer-events-none">
                {label}
              </div>
            </div>
          )}
        </div>
        {images && images.length > 0 && (
          <div className="flex gap-2 justify-center">
            {images.map((src, i) => (
              <button
                key={i}
                onClick={() => setLightboxIndex(i)}
                className="relative w-20 h-36 rounded-lg overflow-hidden flex-shrink-0 cursor-zoom-in group focus:outline-none focus-visible:ring-2 focus-visible:ring-[#4a7aa8]"
                aria-label={`Agrandir screenshot ${i + 1}`}
              >
                <Image
                  src={src}
                  alt={`${title} screenshot ${i + 1}`}
                  fill
                  className="object-cover transition-transform duration-200 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-200 flex items-center justify-center">
                  <span className="text-white text-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    ⊕
                  </span>
                </div>
              </button>
            ))}
          </div>
        )}
        <p className="text-gray-600 dark:text-[#94aac5] text-sm leading-relaxed">
          {description}
        </p>
        <div className="flex flex-wrap gap-2 mt-auto">
          {tags.map((t) => (
            <Tag key={t} label={t} />
          ))}
        </div>
      </div>

      {lightboxIndex !== null && images && (
        <Lightbox
          images={images}
          startIndex={lightboxIndex}
          title={title}
          onClose={() => setLightboxIndex(null)}
        />
      )}
    </>
  );
}

type SmallProjectCardProps = {
  title: string;
  description: string;
  tech: string;
  image?: string;
  githubUrl?: string;
};

function SmallProjectCard({
  title,
  description,
  tech,
  image,
  githubUrl,
}: SmallProjectCardProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div className="bg-white dark:bg-[#1a2a3e] rounded-2xl p-5 flex flex-col gap-3 shadow-sm">
        <div className="flex justify-between items-start">
          <h3 className="text-[#4a7aa8] font-semibold text-base">{title}</h3>
          <a
            href={githubUrl ?? "#"}
            target="_blank"
            rel="noreferrer"
            aria-label="GitHub"
            className="text-[#7a9cbf] hover:text-[#4a7aa8] dark:text-[#4a7aa8] dark:hover:text-[#7ab3e0] transition-colors"
          >
            <GithubIcon className="w-4 h-4" />
          </a>
        </div>
        {image && (
          <button
            onClick={() => setOpen(true)}
            className="relative w-full h-24 rounded-lg overflow-hidden cursor-zoom-in group focus:outline-none focus-visible:ring-2 focus-visible:ring-[#4a7aa8]"
            aria-label="Agrandir l'image"
          >
            <Image
              src={image}
              alt={`${title} screenshot`}
              fill
              className="object-cover object-top transition-transform duration-200 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-200 flex items-center justify-center">
              <span className="text-white text-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                ⊕
              </span>
            </div>
          </button>
        )}
        <p className="text-gray-600 dark:text-[#94aac5] text-sm">
          {description}
        </p>
        <span className="text-[#4a7aa8] text-sm">{tech}</span>
      </div>

      {open && image && (
        <Lightbox
          images={[image]}
          startIndex={0}
          title={title}
          onClose={() => setOpen(false)}
        />
      )}
    </>
  );
}

// ────────────────────────────────────────────────────────────────
// TerminalCard
// ────────────────────────────────────────────────────────────────

type SkillItem = { name: string; level?: number };

function TerminalCard({ title, items }: { title: string; items: SkillItem[] }) {
  const [cardHovered, setCardHovered] = useState(false);
  const hasLevels = items.some((item) => item.level !== undefined);

  const slug = title
    .toLowerCase()
    .replace(/ & /g, "-")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

  return (
    <div
      className="rounded-xl overflow-hidden border border-gray-200 dark:border-[#1a3a5c] shadow-sm font-mono flex flex-col"
      onMouseEnter={() => hasLevels && setCardHovered(true)}
      onMouseLeave={() => hasLevels && setCardHovered(false)}
    >
      {/* title bar */}
      <div className="flex items-center gap-1.5 px-3 py-2 bg-gray-100 dark:bg-[#071018] border-b border-gray-200 dark:border-[#1a3a5c]">
        <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f56]" />
        <span className="w-2.5 h-2.5 rounded-full bg-[#febc2e]" />
        <span className="w-2.5 h-2.5 rounded-full bg-[#28c840]" />
        <span className="mx-auto text-[13px] text-gray-400 dark:text-[#2a4a6a]">
          bash — {slug}
        </span>
      </div>
      {/* body */}
      <div className="bg-white dark:bg-[#0a1525] px-4 py-3 flex-1">
        <p className="text-[13px] mb-2 select-none leading-relaxed">
          <span className="text-[#28c840]">anaïs</span>
          <span className="text-gray-400 dark:text-[#2a4a6a]">@portfolio</span>
          <span className="text-gray-400 dark:text-[#2a4a6a]">:</span>
          <span className="text-[#4a7aa8]">~/{slug}</span>
          <span className="text-gray-400 dark:text-[#2a4a6a]">$ </span>
          <span className="text-gray-700 dark:text-gray-300">ls -1</span>
        </p>
        <ul className="space-y-0.5 text-[14px]">
          {items.map((item, i) => (
            <li
              key={item.name}
              className={`flex items-baseline gap-1.5 ${hasLevels ? "justify-between" : ""}`}
            >
              <span className="flex items-baseline gap-1.5">
                <span className="text-gray-300 dark:text-[#1e3a5c] select-none">
                  {i === items.length - 1 ? "└─" : "├─"}
                </span>
                <span className="text-gray-700 dark:text-[#7ab3e0]">
                  {item.name}
                </span>
              </span>
              {item.level !== undefined && (
                <span
                  className="text-[#4a7aa8] text-[12px] transition-opacity duration-200 select-none"
                  style={{ opacity: cardHovered ? 1 : 0 }}
                >
                  {item.level}%
                </span>
              )}
            </li>
          ))}
        </ul>
        <p className="text-[13px] mt-2 select-none flex items-center leading-relaxed">
          <span className="text-[#28c840]">anaïs</span>
          <span className="text-gray-400 dark:text-[#2a4a6a]">@portfolio</span>
          <span className="text-gray-400 dark:text-[#2a4a6a]">:</span>
          <span className="text-[#4a7aa8]">~/{slug}</span>
          <span className="text-gray-400 dark:text-[#2a4a6a]">$ </span>
          <span className="inline-block w-[7px] h-[13px] bg-gray-600 dark:bg-[#7ab3e0] animate-pulse ml-0.5 align-text-bottom" />
        </p>
      </div>
    </div>
  );
}

// ────────────────────────────────────────────────────────────────
// Page
// ────────────────────────────────────────────────────────────────

// ────────────────────────────────────────────────────────────────
// ContactForm
// ────────────────────────────────────────────────────────────────

function ContactForm() {
  const [state, formAction, pending] = useActionState<ContactState, FormData>(
    sendContactEmail,
    {},
  );

  if (state.success) {
    return (
      <div className="py-6 text-center">
        <p className="text-[#28c840] text-lg font-medium">✓ Message envoyé !</p>
        <p className="text-[#7a9cbf] text-sm mt-1">
          Je vous répondrai dès que possible.
        </p>
      </div>
    );
  }

  return (
    <form action={formAction} className="space-y-4 text-left w-full">
      <div>
        <label
          htmlFor="cf-name"
          className="block text-[#7a9cbf] text-xs mb-1.5"
        >
          Nom
        </label>
        <input
          id="cf-name"
          name="name"
          type="text"
          required
          autoComplete="name"
          placeholder="Votre nom"
          className="w-full bg-[#152535] dark:bg-[#050e17] border border-[#2d4a6a] rounded-lg px-4 py-2.5 text-sm text-white placeholder-[#3a5a7a] focus:outline-none focus:border-[#4a7aa8] transition-colors"
        />
      </div>
      <div>
        <label
          htmlFor="cf-email"
          className="block text-[#7a9cbf] text-xs mb-1.5"
        >
          Email
        </label>
        <input
          id="cf-email"
          name="email"
          type="email"
          required
          autoComplete="email"
          placeholder="votre@email.com"
          className="w-full bg-[#152535] dark:bg-[#050e17] border border-[#2d4a6a] rounded-lg px-4 py-2.5 text-sm text-white placeholder-[#3a5a7a] focus:outline-none focus:border-[#4a7aa8] transition-colors"
        />
      </div>
      <div>
        <label
          htmlFor="cf-message"
          className="block text-[#7a9cbf] text-xs mb-1.5"
        >
          Message
        </label>
        <textarea
          id="cf-message"
          name="message"
          required
          rows={4}
          placeholder="Votre message..."
          className="w-full bg-[#152535] dark:bg-[#050e17] border border-[#2d4a6a] rounded-lg px-4 py-2.5 text-sm text-white placeholder-[#3a5a7a] focus:outline-none focus:border-[#4a7aa8] transition-colors resize-none"
        />
      </div>

      {state.error && <p className="text-red-400 text-xs">{state.error}</p>}

      <button
        type="submit"
        disabled={pending}
        className="w-full flex items-center justify-center gap-2 bg-[#2d4a6a] hover:bg-[#3a5a80] disabled:opacity-60 disabled:cursor-not-allowed transition-colors rounded-lg px-5 py-3 text-sm text-white"
      >
        {pending ? "Envoi en cours…" : "Envoyer →"}
      </button>
    </form>
  );
}

// ────────────────────────────────────────────────────────────────
// Page
// ────────────────────────────────────────────────────────────────

export default function Home() {
  const [dark, setDark] = useState(false);

  // Sync state with the class already set by the anti-flash script
  useEffect(() => {
    setDark(document.documentElement.classList.contains("dark"));
  }, []);

  const toggleDark = () => {
    const html = document.documentElement;
    html.classList.add("theme-transitioning");
    const next = !dark;
    if (next) {
      html.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      html.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
    setDark(next);
    setTimeout(() => html.classList.remove("theme-transitioning"), 400);
  };

  return (
    <div className="min-h-screen font-[family-name:var(--font-geist-sans)]">
      {/* ── Navbar ─────────────────────────────────────────────── */}
      <nav className="nav">
        <div className="nav-container">
          <div className="nav-brand">
            <span className="font-semibold text-gray-800 dark:text-gray-100">
              Anaïs Picaut
            </span>
            <a
              href="https://github.com/unkochiii"
              aria-label="GitHub"
              className="text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-100 transition-colors"
            >
              <GithubIcon className="w-5 h-5" />
            </a>
            <a
              href="https://www.linkedin.com/in/anais-picaut-68ba8435a/"
              aria-label="LinkedIn"
              className="text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-100 transition-colors"
            >
              <LinkedinIcon className="w-5 h-5" />
            </a>
          </div>
          <div className="flex items-center gap-4">
            <ul className="nav-links">
              <li>
                <a
                  href="#projets"
                  className="hover:text-gray-900 dark:hover:text-white transition-colors"
                >
                  Projets
                </a>
              </li>
              <li>
                <a
                  href="#apropos"
                  className="hover:text-gray-900 dark:hover:text-white transition-colors"
                >
                  À propos
                </a>
              </li>
              <li>
                <a
                  href="#competences"
                  className="hover:text-gray-900 dark:hover:text-white transition-colors"
                >
                  Compétences
                </a>
              </li>
              <li>
                <a
                  href="#contact"
                  className="hover:text-gray-900 dark:hover:text-white transition-colors"
                >
                  Contact
                </a>
              </li>
            </ul>
            <ThemeToggle dark={dark} onToggle={toggleDark} />
          </div>
        </div>
      </nav>

      {/* ── Hero ───────────────────────────────────────────────── */}
      <section className="hero section-bg">
        {/* Lumières d'ambiance */}
        <div className="hero-light hero-light-1" />
        <div className="hero-light hero-light-2" />
        <div className="hero-light hero-light-3" />
        <div className="hero-light hero-light-4" />
        <div
          className="hero-bg"
          style={{
            background:
              "radial-gradient(circle, rgba(255,255,255,0.18) 0%, transparent 70%)",
          }}
        />
        <div className="hero-text">
          <h1 className="hero-title">Anaïs Picaut</h1>
          <div className="hero-badge">Étudiante Full-Stack</div>
          <p className="hero-desc">Apps Personnalisées + Sites Tout-en-Un</p>
          <blockquote className="hero-quote">
            &ldquo;De l&apos;idée à l&apos;app
            <br />
            qui vous{" "}
            <span className="underline underline-offset-4">ressemble</span>
            .&rdquo;
          </blockquote>
          <a href="#projets" className="hero-btn">
            Voir mes projets →
          </a>
        </div>
      </section>

      {/* ── Projects ───────────────────────────────────────────── */}
      <section id="projets" className="section section-bg">
        <div className="container">
          <h2 className="title">Projets</h2>

          <h3 className="subtitle">Projets Principaux</h3>
          <div className="grid-main">
            <MainProjectCard
              title="TanjaTips"
              description="Application mobile complète pour la communauté francophone de Tanger. Fil d'actualité sans algorithme, marketplace, annuaire de commerces, immobilier et agenda culturel. Une solution tout-en-un pour simplifier la vie des Tangérois."
              tags={[
                "React Native",
                "Node.js",
                "MongoDB",
                "API REST",
                "En test",
              ]}
              images={[
                "/images/tanjatips-1.png",
                "/images/tanjatips-2.png",
                "/images/tanjatips-3.png",
                "/images/tanjatips-4.png",
              ]}
              label="Cette application a été développée pour un usage privé ; le dépôt de code ne peut donc pas être partagé publiquement."
            />
            <MainProjectCard
              title="Templates pour Riads (En cours)"
              description="Projet freelance de création de templates web personnalisés pour les entreprises marocaines, avec un focus initial sur les Riads. Solutions clé-en-main adaptées au marché local."
              tags={["React", "Figma", "Tailwind CSS", "En developpement"]}
              label="Cette application a été développée pour un usage privé ; le dépôt de code ne peut donc pas être partagé publiquement."
            />
            <MainProjectCard
              title="Brainflow"
              description="Application pour l'organisation qui inclura de l'IA pour aider avec les tâches."
              tags={["En developpement"]}
              label="Cette application est actuellement en cours de développement. Le code source sera rendu public prochainement."
            />
          </div>

          <h3 className="subtitle">Autres Projets &amp; Réalisations</h3>
          <div className="grid-small">
            <SmallProjectCard
              title="Deliveroo Backend"
              description="Projet bootcamp : clone backend Deliveroo pour apprendre l'architecture et la maintenance des grandes applications."
              tech="Node.js + Express"
              githubUrl="https://github.com/unkochiii/Deliveroo---Backend"
            />
            <SmallProjectCard
              title="Frontend Vinted"
              description="Projet bootcamp : clone frontend Vinted pour comprendre l'UX des grandes apps et comment elles sont maintenues."
              tech="React + JavaScript"
              image="/images/vinted.png"
              githubUrl="https://github.com/unkochiii/frontend_vinted"
            />
            <SmallProjectCard
              title="Marvel Backend"
              description="Projet bootcamp : API Marvel avec intégration externe pour apprendre les bonnes pratiques backend et la maintenance."
              tech="Node.js + API REST"
              githubUrl="https://github.com/unkochiii/marvelBackend"
            />
            <SmallProjectCard
              title="Marvel Frontend"
              description="Projet bootcamp : frontend React Marvel pour étudier la structure d'une app et reproduire des solutions qui fonctionnent."
              tech="React + JavaScript"
              image="/images/marvel-frontend.png"
              githubUrl="https://github.com/unkochiii/marvelFrontend"
            />
            <SmallProjectCard
              title="Outil Suivi Dev Backend"
              description="Backend de suivi développeur pour expérimenter la logique métier et la maintenance d'une application."
              tech="Node.js + MongoDB"
              githubUrl="https://github.com/unkochiii/Outil-Suivi-Dev-Backend"
            />
            <SmallProjectCard
              title="Outil Suivi Frontend"
              description="Frontend de suivi développeur pour pratiquer l'UI maintenable et ma propre réflexion technique."
              tech="React + JavaScript"
              image="/images/outil-suivi.png"
              githubUrl="https://github.com/unkochiii/OutilSuiviFrontend"
            />
          </div>
        </div>
      </section>

      {/* ── About ──────────────────────────────────────────────── */}
      <section id="apropos" className="about">
        <div className="about-container">
          <h2 className="about-title">À propos de moi</h2>
          <div className="about-card">
            <p>
              Passionnée par le développement web et mobile, je crée des
              solutions digitales sur mesure qui allient design moderne et
              fonctionnalités robustes.
            </p>
            <p>
              Actuellement en fin de formation au Bootcamp Le Reacteur, je
              finalise l'obtention du titre de Concepteur Développeur
              d'Applications (niveau bac+4), avec une spécialisation en
              développement web et mobile.
            </p>
            <p>
              Mon parcours international entre Caen et Tanger m&apos;a permis de
              développer une intelligence émotionnelle et une curiosité qui
              enrichissent ma pratique du développement.
            </p>
            <p>
              Mon approche&nbsp;: comprendre vos besoins, proposer des solutions
              créatives et livrer des produits qui font la différence.
            </p>
          </div>
        </div>
      </section>

      {/* ── Skills ─────────────────────────────────────────────── */}
      <section id="competences" className="skills section-bg">
        <div className="skills-container">
          <h2 className="skills-title">Compétences</h2>
          <div className="skills-grid">
            <TerminalCard
              title="Frontend"
              items={[
                { name: "React.js" },
                { name: "React Native" },
                { name: "HTML/CSS" },
                { name: "JavaScript" },
              ]}
            />
            <TerminalCard
              title="Backend & BDD"
              items={[
                { name: "Node.js" },
                { name: "JavaScript" },
                { name: "MongoDB" },
                { name: "Express" },
              ]}
            />
            <TerminalCard
              title="Mobile"
              items={[
                { name: "React Native" },
                { name: "Applications iOS" },
                { name: "Applications Android" },
                { name: "Expo" },
              ]}
            />
            <TerminalCard
              title="Design & UX"
              items={[
                { name: "Figma" },
                { name: "Web Design" },
                { name: "UI/UX" },
              ]}
            />
            <TerminalCard
              title="Langues"
              items={[
                { name: "Français (natif)", level: 100 },
                { name: "Anglais", level: 90 },
                { name: "Espagnol (DELE A2)", level: 50 },
                { name: "Arabe", level: 30 },
                { name: "Italien", level: 20 },
              ]}
            />
            <TerminalCard
              title="Soft Skills"
              items={[
                { name: "Organisation" },
                { name: "Esprit d'analyse" },
                { name: "Curiosité" },
                { name: "Intelligence émotionnelle" },
              ]}
            />
          </div>
        </div>
      </section>

      {/* ── Contact ────────────────────────────────────────────── */}
      <section id="contact" className="contact contact-bg">
        <div className="contact-container">
          <h2 className="contact-title">Contact</h2>
          <p className="contact-desc">Un projet en tête ? Discutons-en !</p>

          <ContactForm />

          <div className="mt-8 pt-6 border-t border-[#2d4a6a] space-y-4">
            <a href="tel:+33623871470" className="contact-link w-fit mx-auto">
              <PhoneIcon className="w-4 h-4" />
              +33 6 23 87 14 70
            </a>
            <p className="contact-location">
              Caen, France — Tanger, Maroc — A distance
            </p>
            <div className="contact-social">
              <a
                href="https://github.com/unkochiii"
                aria-label="GitHub"
                className="text-[#7a9cbf] hover:text-white transition-colors"
              >
                <GithubIcon className="w-7 h-7" />
              </a>
              <a
                href="https://www.linkedin.com/in/anais-picaut-68ba8435a/"
                aria-label="LinkedIn"
                className="text-[#7a9cbf] hover:text-white transition-colors"
              >
                <LinkedinIcon className="w-7 h-7" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer ─────────────────────────────────────────────── */}
      <footer className="footer footer-bg">
        © 2026 Anaïs Picaut. Tous droits réservés.
      </footer>
    </div>
  );
}
