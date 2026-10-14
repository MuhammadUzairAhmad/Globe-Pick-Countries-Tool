import type { MetadataRoute } from "next";
import { isPublicSite, pages, siteOrigin } from "@/lib/seo/site";

export default function sitemap(): MetadataRoute.Sitemap {
  if (!isPublicSite) return [];
  return pages
    .filter((page) => page.published)
    .map((page) => ({ url: new URL(page.path, siteOrigin).href }));
}
