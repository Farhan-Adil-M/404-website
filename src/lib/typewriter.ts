"use client";

export interface TypeOptions {
  /** Delay before typing starts (ms). */
  delay?: number;
  /** ms per character (jittered). */
  speed?: number;
  /** Hold after the full line is typed (ms). */
  hold?: number;
  /** Extra hold on punctuation. */
  punct?: number;
  /** Called after typing completes and the hold elapses. */
  onDone?: () => void;
  /** Coalesced cancellation token. */
  signal: Signal;
}

export interface Signal {
  cancelled: boolean;
}

export const makeSignal = (): Signal => ({ cancelled: false });

const sleep = (ms: number, signal: Signal) =>
  new Promise<void>((resolve) => {
    if (signal.cancelled) return resolve();
    const id = window.setTimeout(() => {
      window.removeEventListener("t404:cancel", on);
      resolve();
    }, ms);
    const on = () => {
      clearTimeout(id);
      resolve();
    };
    window.addEventListener("t404:cancel", on, { once: true });
  });

/** Global cancel: kills every in-flight typewriter instantly. */
export function cancelAllTyping() {
  window.dispatchEvent(new Event("t404:cancel"));
}

/**
 * Types `text` into `el` letter by letter with a trailing caret.
 * Prefers instant fill for reduced motion.
 */
export async function typewrite(
  el: HTMLElement | null,
  text: string,
  opts: Omit<TypeOptions, "signal"> & { signal?: Signal }
) {
  if (!el) return;
  const signal = opts.signal ?? makeSignal();
  const speed = opts.speed ?? 42;
  const punct = opts.punct ?? 220;

  if (opts.delay) await sleep(opts.delay, signal);
  if (signal.cancelled) return;

  el.textContent = "";
  const caret = document.createElement("span");
  caret.className = "caret";
  el.appendChild(caret);

  for (let i = 0; i < text.length; i++) {
    if (signal.cancelled) return;
    caret.before(document.createTextNode(text[i]));
    const ch = text[i];
    const extra = ch === "." || ch === "," ? punct : 0;
    const jitter = Math.random() * 26;
    await sleep(speed + jitter + extra, signal);
  }

  if (opts.hold) await sleep(opts.hold, signal);
  if (signal.cancelled) return;
  caret.remove();
  opts.onDone?.();
}

/** Instantly complete an in-flight or pending line. */
export function finishLine(el: HTMLElement | null, text: string) {
  if (!el) return;
  cancelAllTyping();
  el.textContent = text;
}

/** Replace caret with a period and stop blinking. */
export function endLine(el: HTMLElement | null, finalText: string) {
  if (!el) return;
  cancelAllTyping();
  el.textContent = finalText;
}
