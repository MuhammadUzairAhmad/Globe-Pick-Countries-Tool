import {
  readThemePreference,
  resolveTheme,
  saveThemePreference,
  themeChangeEvent,
  themeStorageKey,
  type Theme,
} from "./theme.ts";

export const getThemeSnapshot = (): Theme =>
  document.documentElement.dataset.theme === "dark" ? "dark" : "light";
export const getServerThemeSnapshot = (): Theme => "light";

export function changeTheme(theme: Theme) {
  document.documentElement.dataset.theme = theme;
  document.documentElement.dataset.themePreference = theme;
  saveThemePreference(() => window.localStorage, theme);
  window.dispatchEvent(new Event(themeChangeEvent));
}

export function subscribeTheme(notify: () => void) {
  const media = window.matchMedia("(prefers-color-scheme: dark)");
  function apply(preference: string | null) {
    document.documentElement.dataset.themePreference =
      preference === "light" || preference === "dark" ? preference : "system";
    document.documentElement.dataset.theme = resolveTheme(
      preference,
      media.matches,
    );
    notify();
  }
  function systemChanged() {
    if (document.documentElement.dataset.themePreference === "system")
      apply(null);
  }
  function storageChanged(event: StorageEvent) {
    if (event.key === themeStorageKey || event.key === null)
      apply(readThemePreference(() => window.localStorage));
  }
  media.addEventListener("change", systemChanged);
  window.addEventListener("storage", storageChanged);
  window.addEventListener(themeChangeEvent, notify);
  return () => {
    media.removeEventListener("change", systemChanged);
    window.removeEventListener("storage", storageChanged);
    window.removeEventListener(themeChangeEvent, notify);
  };
}
