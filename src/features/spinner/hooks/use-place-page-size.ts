import { useSyncExternalStore } from "react";

const widePageQuery = "(min-width: 40rem)";

function subscribe(onChange: () => void) {
  const query = window.matchMedia(widePageQuery);
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
}

function getSnapshot() {
  return window.matchMedia(widePageQuery).matches;
}

const getServerSnapshot = () => false;

export function usePlacePageSize(): 4 | 8 {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
    ? 8
    : 4;
}
