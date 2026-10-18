export type Theme = "light" | "dark";
export const themeStorageKey = "globepick:theme";
export const themeChangeEvent = "globepick:theme-change";

export function resolveTheme(preference: unknown, prefersDark: boolean): Theme {
  return preference === "light" || preference === "dark"
    ? preference
    : prefersDark
      ? "dark"
      : "light";
}

export function readThemePreference(
  access: () => Pick<Storage, "getItem">,
): Theme | null {
  try {
    const value = access().getItem(themeStorageKey);
    return value === "light" || value === "dark" ? value : null;
  } catch {
    return null;
  }
}

export function saveThemePreference(
  access: () => Pick<Storage, "setItem">,
  theme: Theme,
): boolean {
  try {
    access().setItem(themeStorageKey, theme);
    return true;
  } catch {
    return false;
  }
}

// Only static application constants enter this script; stored values are validated.
// Run in <head> so the page uses the preference before its first paint.
export const themeBootstrapScript = `(()=>{let p=null;try{p=localStorage.getItem(${JSON.stringify(themeStorageKey)})}catch{}const valid=p==="light"||p==="dark";const dark=typeof matchMedia==="function"&&matchMedia("(prefers-color-scheme: dark)").matches;document.documentElement.dataset.theme=valid?p:dark?"dark":"light";document.documentElement.dataset.themePreference=valid?p:"system"})()`;
