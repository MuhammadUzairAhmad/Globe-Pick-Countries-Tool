import { emptySavedState } from "../../../lib/storage/saved-state.ts";
import type { Filters, SavedState } from "../types.ts";
import type { SharedState } from "../../../lib/share/url-state.ts";

export type GeneratorState = {
  saved: SavedState;
  resultIds: string[];
  revealed: string[];
  replay: boolean;
  revision: number;
  hydrated: boolean;
  dirty: boolean;
  message: string;
  storageWarning: string;
};
export const initialState = (): GeneratorState => ({
  saved: emptySavedState(),
  resultIds: [],
  revealed: [],
  replay: false,
  revision: 0,
  hydrated: false,
  dirty: false,
  message: "",
  storageWarning: "",
});
export type Action =
  | {
      type: "hydrate";
      saved: SavedState;
      warning: string;
      shared: SharedState | null;
      message: string;
    }
  | { type: "filters"; filters: Filters }
  | { type: "generated"; ids: string[]; at: number; message: string }
  | { type: "replay"; ids: string[]; filters?: Filters }
  | { type: "reveal"; id: string }
  | { type: "favorite"; id: string }
  | { type: "clear-history" | "clear-favorites" | "reset-pool" }
  | { type: "message"; message: string }
  | { type: "storage-warning"; warning: string };

export function generatorReducer(
  state: GeneratorState,
  action: Action,
): GeneratorState {
  switch (action.type) {
    case "hydrate":
      return {
        ...initialState(),
        saved: {
          ...action.saved,
          ...(action.shared ? { filters: action.shared.filters } : {}),
        },
        hydrated: true,
        storageWarning: action.warning,
        resultIds: action.shared?.resultIds ?? [],
        replay: Boolean(action.shared?.resultIds.length),
        message: action.message,
      };
    case "filters":
      return {
        ...state,
        dirty: true,
        revealed:
          action.filters.guess && !state.saved.filters.guess
            ? []
            : state.revealed,
        saved: { ...state.saved, filters: action.filters },
      };
    case "generated":
      return {
        ...state,
        dirty: true,
        resultIds: action.ids,
        revision: state.revision + 1,
        revealed: [],
        replay: false,
        message: action.message,
        saved: {
          ...state.saved,
          consumed: [...new Set([...state.saved.consumed, ...action.ids])],
          history: [
            ...action.ids.map((id) => ({ id, at: action.at })),
            ...state.saved.history,
          ].slice(0, 100),
        },
      };
    case "replay":
      return {
        ...state,
        resultIds: action.ids,
        revision: state.revision + 1,
        revealed: [],
        replay: true,
        message:
          "Opened your saved selection. Your picked places and history haven’t changed.",
        saved: {
          ...state.saved,
          ...(action.filters ? { filters: action.filters } : {}),
        },
      };
    case "reveal":
      return {
        ...state,
        revealed: [...new Set([...state.revealed, action.id])],
      };
    case "favorite": {
      const exists = state.saved.favorites.includes(action.id);
      return {
        ...state,
        dirty: true,
        message: exists ? "Removed from favorites." : "Saved in this browser.",
        saved: {
          ...state.saved,
          favorites: exists
            ? state.saved.favorites.filter((id) => id !== action.id)
            : [...state.saved.favorites, action.id],
        },
      };
    }
    case "clear-history":
      return {
        ...state,
        dirty: true,
        message:
          "History cleared. Previous picks are still remembered while repeats are off.",
        saved: { ...state.saved, history: [] },
      };
    case "clear-favorites":
      return {
        ...state,
        dirty: true,
        message: "Favorites cleared in this browser.",
        saved: { ...state.saved, favorites: [] },
      };
    case "reset-pool":
      return {
        ...state,
        dirty: true,
        message:
          "All matching places can be picked again. Your filters, history, and favorites are unchanged.",
        saved: { ...state.saved, consumed: [] },
      };
    case "message":
      return { ...state, message: action.message };
    case "storage-warning":
      return { ...state, storageWarning: action.warning };
  }
}
