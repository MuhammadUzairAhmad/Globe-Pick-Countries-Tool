import type { MetadataRoute } from "next";
import { isPublicSite, siteOrigin } from "@/lib/seo/site";

export default function robots(): MetadataRoute.Robots {
  // Allow crawling so that search engines can see each page's noindex directive.
  return {
    rules: { userAgent: "*", allow: "/" },
    ...(isPublicSite
      ? { sitemap: new URL("/sitemap.xml", siteOrigin).href }
      : {}),
  };
}
