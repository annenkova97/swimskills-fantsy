"use client";

import { useEffect } from "react";

export type TelegramUser = {
  id?: number;
  username?: string;
  first_name?: string;
  last_name?: string;
  photo_url?: string;
  language_code?: string;
};

export type TelegramMainButton = {
  text?: string;
  isVisible?: boolean;
  isActive?: boolean;
  setText?: (text: string) => void;
  setParams?: (params: { text?: string; color?: string; text_color?: string; is_active?: boolean; is_visible?: boolean }) => void;
  show?: () => void;
  hide?: () => void;
  enable?: () => void;
  disable?: () => void;
  onClick?: (cb: () => void) => void;
  offClick?: (cb: () => void) => void;
};

export type TelegramBackButton = {
  isVisible?: boolean;
  show?: () => void;
  hide?: () => void;
  onClick?: (cb: () => void) => void;
  offClick?: (cb: () => void) => void;
};

export type TelegramWebApp = {
  ready?: () => void;
  expand?: () => void;
  initData?: string;
  initDataUnsafe?: { user?: TelegramUser };
  HapticFeedback?: { impactOccurred?: (style: string) => void; notificationOccurred?: (style: string) => void };
  openTelegramLink?: (url: string) => void;
  shareToStory?: (mediaUrl: string, params?: Record<string, unknown>) => void;
  MainButton?: TelegramMainButton;
  BackButton?: TelegramBackButton;
  themeParams?: Record<string, string>;
  colorScheme?: "light" | "dark";
  setHeaderColor?: (color: string) => void;
  setBackgroundColor?: (color: string) => void;
};

declare global {
  interface Window {
    Telegram?: { WebApp?: TelegramWebApp };
  }
}

export function getTelegram(): TelegramWebApp | null {
  if (typeof window === "undefined") return null;
  return window.Telegram?.WebApp ?? null;
}

export function initTelegram(): TelegramUser | null {
  const tg = getTelegram();
  if (!tg) return null;
  tg.ready?.();
  tg.expand?.();
  tg.setHeaderColor?.("#000000");
  tg.setBackgroundColor?.("#000000");
  return tg.initDataUnsafe?.user ?? null;
}

export function haptic(style: "light" | "medium" | "heavy" = "light"): void {
  getTelegram()?.HapticFeedback?.impactOccurred?.(style);
}

export function hapticNotify(style: "success" | "warning" | "error"): void {
  getTelegram()?.HapticFeedback?.notificationOccurred?.(style);
}

/**
 * Wires the Telegram MainButton (the native fixed-bottom CTA) for the lifetime
 * of the host component. Pass `null` for `onClick` to hide the button.
 */
export function useTelegramMainButton(
  text: string,
  onClick: (() => void) | null,
  options: { active?: boolean; visible?: boolean } = {}
): void {
  const active = options.active ?? true;
  const visible = options.visible ?? true;

  useEffect(() => {
    const mb = getTelegram()?.MainButton;
    if (!mb) return;

    if (!visible || !onClick) {
      mb.hide?.();
      return;
    }

    mb.setText?.(text);
    if (active) mb.enable?.();
    else mb.disable?.();
    mb.show?.();

    const handler = () => onClick();
    mb.onClick?.(handler);

    return () => {
      mb.offClick?.(handler);
      mb.hide?.();
    };
  }, [text, onClick, active, visible]);
}

/**
 * Wires the Telegram BackButton. When `onBack` is null the back button is hidden.
 */
export function useTelegramBackButton(onBack: (() => void) | null): void {
  useEffect(() => {
    const bb = getTelegram()?.BackButton;
    if (!bb) return;

    if (!onBack) {
      bb.hide?.();
      return;
    }

    const handler = () => onBack();
    bb.onClick?.(handler);
    bb.show?.();

    return () => {
      bb.offClick?.(handler);
      bb.hide?.();
    };
  }, [onBack]);
}
