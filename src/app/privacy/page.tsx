import { InformationPage } from "@/components/layout/information-page";
import { pageMetadata } from "@/lib/seo/site";

export const metadata = pageMetadata("/privacy");

export default function PrivacyPage() {
  return (
    <InformationPage
      title="Privacy in this preview"
      description="This page describes the local geography tools. Hosting-specific contact and retention details will be reviewed before public launch."
      sections={[
        {
          title: "Personal information",
          content:
            "The application has no registration, contact form, advertising, or analytics integration. It does not ask for your name, email address, student details, or location. Country project assignments stay in page memory until you leave or refresh. Printing uses your browser’s print dialog; any saved PDF stays wherever you choose to save it.",
        },
        {
          title: "Cookies and browser storage",
          content:
            "The application sets no cookies. Each tool saves your settings, picked places, up to 100 recent results, and favorites in your browser’s local storage. These records do not sync to other devices. Use Clear history, Clear favorites, Clear filters, and Reset picked places to reset their corresponding data, or clear site data in your browser to remove everything. Generation works when saving is unavailable.",
        },
        {
          title: "Fonts, external links, and requests",
          content:
            "Fonts, flags, map outlines, and geography data are served locally. Copying uses your browser clipboard; sharing creates a link you can copy, with device sharing available in supported browsers. Shared URLs contain country/capital IDs and selected filters, so anyone receiving a link can see that selection. No student names or other identity fields are included. Following an external source link sends you to another website, whose own privacy policy applies. Your browser makes normal requests to the server hosting the preview; server logs and hosting retention have not been configured for a public deployment.",
        },
        {
          title: "Questions and future changes",
          content:
            "For this private development preview, contact the project maintainer through the channel that provided it. The public operator, contact details, hosting provider, and actual data practices must be documented before launch or before any collection feature is added.",
        },
      ]}
    />
  );
}
