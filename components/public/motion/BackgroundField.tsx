"use client";

import { InteractiveField } from "./InteractiveField";

/**
 * Full-page background layer of connected moving dots. Fixed behind all
 * content, low opacity so text stays readable. Cursor-reactive.
 * Disabled on mobile (hidden below lg) to save performance on touch devices.
 */
export function BackgroundField() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-auto fixed inset-0 z-0 hidden lg:block"
    >
      <InteractiveField className="opacity-60" />
    </div>
  );
}
