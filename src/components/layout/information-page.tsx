import type { ReactNode } from "react";
import { Container } from "./container";
import { PageIntro } from "./page-intro";
import { Card } from "@/components/ui/card";

export function InformationPage({
  title,
  description,
  sections,
}: {
  title: string;
  description: string;
  sections: readonly { title: string; content: ReactNode }[];
}) {
  return (
    <Container className="py-section">
      <PageIntro
        eyebrow="Development preview, updated 14 October 2026"
        title={title}
        description={description}
      />
      <div className="mt-8 max-w-reading space-y-5">
        {sections.map((section) => (
          <Card key={section.title}>
            <h2 className="text-card-title font-semibold">{section.title}</h2>
            <div className="mt-3 text-muted">{section.content}</div>
          </Card>
        ))}
      </div>
    </Container>
  );
}
