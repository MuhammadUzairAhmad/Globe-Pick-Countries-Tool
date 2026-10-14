import Image from "next/image";
import { Card } from "@/components/ui/card";
import { Icon } from "@/components/ui/icon";

export const exampleSource =
  "https://www.studyinjapan.go.jp/en/why/47prefectures/kanto/tokyo.html";

export function ExampleResult({
  mode = "country",
}: {
  mode?: "country" | "capital";
}) {
  const capital = mode === "capital";
  return (
    <Card>
      <div className="flex items-center justify-between gap-3">
        <p className="text-xs font-semibold uppercase tracking-widest text-muted">
          Example result
        </p>
        <Icon name="compass" className="size-5 text-brand" />
      </div>
      <div className="mt-7 flex items-center gap-4">
        <Image
          src="/flags/jp.svg"
          width={72}
          height={48}
          alt=""
          className="h-12 w-18 rounded border border-border object-contain"
          unoptimized
        />
        <div>
          <p className="text-section-title font-semibold tracking-tight">
            {capital ? "Tokyo" : "Japan"}
          </p>
          <p className="mt-1 text-sm text-muted">
            {capital ? "Capital of Japan" : "East Asia"}
          </p>
        </div>
      </div>
      <dl className="mt-6 grid grid-cols-2 gap-4 border-t border-border pt-5">
        <div>
          <dt className="text-xs text-muted">
            {capital ? "Country" : "Capital"}
          </dt>
          <dd className="mt-1 font-medium">{capital ? "Japan" : "Tokyo"}</dd>
        </div>
        <div>
          <dt className="text-xs text-muted">Currency</dt>
          <dd className="mt-1 font-medium">Japanese yen</dd>
        </div>
      </dl>
      <div className="mt-6 rounded-control bg-page p-4">
        <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-brand">
          <Icon name="book" className="size-4" />
          Try this
        </p>
        <p className="mt-2 text-sm text-muted">
          Find Tokyo in an atlas. Which body of water lies to its east?
        </p>
      </div>
      <p className="mt-5 text-xs text-muted">
        This is an example result. Tokyo’s capital role checked on 14 October
        2026 against the{" "}
        <a
          href={exampleSource}
          className="underline decoration-border underline-offset-4 hover:text-brand"
        >
          Study in Japan Tokyo page
        </a>
        . Other facts follow our dated country dataset.
      </p>
    </Card>
  );
}
