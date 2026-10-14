import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import type { Place } from "@/features/generator/types";

const normalize = (value: string) =>
  value
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLocaleLowerCase()
    .replace(/[^\p{L}\p{N}]/gu, "");

export function GuessReveal({
  place,
  onReveal,
  revealed,
}: {
  place: Extract<Place, { kind: "capital" }>;
  onReveal: (message: string) => void;
  revealed: boolean;
}) {
  const [answer, setAnswer] = useState("");
  const [notice, setNotice] = useState("");
  return (
    <form
      className="mt-5 space-y-3"
      onSubmit={(event) => {
        event.preventDefault();
        if (revealed) return;
        if (!answer.trim()) {
          setNotice("Enter a guess or choose Reveal answer.");
          return;
        }
        setNotice("");
        onReveal(
          normalize(answer) === normalize(place.capital.name)
            ? "That’s right!"
            : "Here’s the answer. Compare it with your guess.",
        );
      }}
    >
      <h3 className="text-card-title font-semibold">
        What is the {place.capital.role.toLocaleLowerCase()}?
      </h3>
      <p className="text-sm text-muted">
        {place.country.capitals.length > 1
          ? `${place.country.name} has more than one capital or government seat. Use the role above as your clue.`
          : `Enter your answer for ${place.country.name}, then check it below.`}
      </p>
      <Field
        id={`guess-${place.id}`}
        label={`Your guess for ${place.country.name}`}
      >
        <input
          id={`guess-${place.id}`}
          value={answer}
          autoComplete="off"
          readOnly={revealed}
          onChange={(event) => setAnswer(event.target.value)}
          className="min-h-touch w-full rounded-control border border-border bg-surface px-3 text-sm"
        />
      </Field>
      <div className="flex flex-wrap gap-2">
        <Button type="submit" aria-disabled={revealed}>
          Check guess
        </Button>
        <Button
          variant="secondary"
          aria-disabled={revealed}
          onClick={() => {
            if (!revealed) {
              setNotice("");
              onReveal("Answer revealed.");
            }
          }}
        >
          {revealed ? "Answer revealed" : "Reveal answer"}
        </Button>
      </div>
      <p role="status" className="text-sm text-muted">
        {notice}
      </p>
    </form>
  );
}
