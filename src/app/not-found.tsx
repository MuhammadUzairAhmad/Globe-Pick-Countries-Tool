import { Container } from "@/components/layout/container";
import { PageIntro } from "@/components/layout/page-intro";
import { ButtonLink } from "@/components/ui/button";

export default function NotFound() {
  return (
    <Container className="py-section">
      <PageIntro
        eyebrow="Page not found"
        title="This place isn’t on our map."
        description="That page does not exist. Head back to GlobePick to explore the project and learning ideas."
      />
      <ButtonLink href="/" className="mt-8">
        Back to GlobePick
      </ButtonLink>
    </Container>
  );
}
