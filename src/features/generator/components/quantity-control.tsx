import { Field } from "@/components/ui/field";

export function QuantityControl({
  value,
  onChange,
  label = "Number of results",
  hint = "Choose between 1 and 20. Results in a set won’t repeat.",
}: {
  value: number;
  onChange: (value: number) => void;
  label?: string;
  hint?: string;
}) {
  const invalid = !Number.isInteger(value) || value < 1 || value > 20;
  return (
    <Field id="quantity" label={label} hint={hint}>
      <input
        id="quantity"
        aria-describedby="quantity-hint"
        aria-invalid={invalid}
        type="number"
        min="1"
        max="20"
        step="1"
        value={Number.isNaN(value) ? "" : value}
        onChange={(event) =>
          onChange(event.target.value === "" ? NaN : Number(event.target.value))
        }
        className="min-h-touch w-full rounded-control border border-border bg-surface px-3 py-2 text-sm"
      />
    </Field>
  );
}
