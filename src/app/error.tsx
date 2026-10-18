"use client";

import { Container } from "@/components/layout/container";
import { Button, ButtonLink } from "@/components/ui/button";

export default function ErrorPage({
  retry,
}: {
  error: Error & { digest?: string };
  retry: () => void;
}) {
  return (
    <Container className="py-section">
      <h1 className="text-section-title">We couldn’t load this page.</h1>
      <p className="mt-4 text-muted">
        Please try again, or return to the homepage.
      </p>
      <div className="mt-6 flex flex-wrap gap-3">
        <Button onClick={() => retry()}>Try again</Button>
        <ButtonLink href="/" variant="secondary">
          Back to GlobePick
        </ButtonLink>
      </div>
    </Container>
  );
}
