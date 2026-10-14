import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlaceIdentity } from "@/features/generator/components/place-identity";
import { placeName } from "@/features/generator/lib/selection";
import { savedPlaceLabel } from "./labels";
import type { HistoryEntry, Place } from "@/features/generator/types";

type Props = {
  byId: ReadonlyMap<string, Place>;
  history: HistoryEntry[];
  favorites: string[];
  hiddenIds: ReadonlySet<string>;
  onReplay: (id: string) => void;
  onRemoveFavorite: (id: string) => void;
  onClearHistory: () => void;
  onClearFavorites: () => void;
};

export function SavedPlaces({
  byId,
  history,
  favorites,
  hiddenIds,
  onReplay,
  onRemoveFavorite,
  onClearHistory,
  onClearFavorites,
}: Props) {
  function actionLabel(id: string) {
    const place = byId.get(id);
    return place ? savedPlaceLabel(place, hiddenIds.has(id)) : "place";
  }
  function identity(id: string) {
    const place = byId.get(id);
    return place ? (
      <PlaceIdentity
        country={place.country}
        title={
          hiddenIds.has(id)
            ? `${place.country.name} (answer hidden)`
            : placeName(place)
        }
        subtitle={
          place.kind === "capital" && !hiddenIds.has(id)
            ? place.capital.role
            : place.country.continent
        }
      />
    ) : null;
  }
  return (
    <section aria-label="Places saved in this browser" className="mt-8">
      <p className="mb-4 text-sm text-muted">
        Your recent results and favorites are saved in this browser. Each tool
        has its own list.
      </p>
      <div className="grid gap-5 lg:grid-cols-2">
        <Card>
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h2 className="text-card-title font-semibold">
              Recent results ({history.length})
            </h2>
            <button
              type="button"
              onClick={onClearHistory}
              disabled={!history.length}
              className="min-h-touch px-2 text-sm font-medium text-brand disabled:opacity-50"
            >
              Clear history
            </button>
          </div>
          <p className="mt-2 text-xs text-muted">
            Your last 100 picks. Open one to view it again without making a new
            pick.
          </p>
          {!history.length ? (
            <p className="mt-5 text-sm text-muted">
              Your generated places will appear here.
            </p>
          ) : (
            <ul className="mt-4 max-h-96 divide-y divide-border overflow-y-auto">
              {history.map((entry, index) => (
                <li
                  key={`${entry.id}-${entry.at}-${index}`}
                  className="flex flex-col justify-between gap-3 py-3 sm:flex-row sm:items-center"
                >
                  {identity(entry.id)}
                  <Button
                    variant="secondary"
                    onClick={() => onReplay(entry.id)}
                    aria-label={`Open ${actionLabel(entry.id)}`}
                  >
                    Open
                  </Button>
                </li>
              ))}
            </ul>
          )}
        </Card>
        <Card>
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h2 className="text-card-title font-semibold">
              Favorites ({favorites.length})
            </h2>
            <button
              type="button"
              onClick={onClearFavorites}
              disabled={!favorites.length}
              className="min-h-touch px-2 text-sm font-medium text-brand disabled:opacity-50"
            >
              Clear favorites
            </button>
          </div>
          {!favorites.length ? (
            <p className="mt-5 text-sm text-muted">
              Save a result to come back to it later.
            </p>
          ) : (
            <ul className="mt-4 max-h-96 divide-y divide-border overflow-y-auto">
              {favorites.map((id) => (
                <li key={id} className="space-y-3 py-3">
                  {identity(id)}
                  <div className="flex flex-wrap gap-2">
                    <Button
                      variant="secondary"
                      onClick={() => onReplay(id)}
                      aria-label={`Open favorite ${actionLabel(id)}`}
                    >
                      Open
                    </Button>
                    <Button
                      variant="secondary"
                      onClick={() => onRemoveFavorite(id)}
                      aria-label={`Remove favorite ${actionLabel(id)}`}
                    >
                      Remove
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>
    </section>
  );
}
