import { BRAND } from "@/lib/brand";
import { OG_IMAGE, absUrl } from "@/lib/site";

type HeadOpts = {
  title: string;
  description: string;
  path: string;
  noindex?: boolean;
};

export function pageHead({ title, description, path, noindex = false }: HeadOpts) {
  const url = absUrl(path);
  const image = absUrl(OG_IMAGE.path);
  return {
    meta: [
      { title },
      { name: "description", content: description },
      { name: "robots", content: noindex ? "noindex,nofollow" : "index,follow" },
      { name: "author", content: BRAND.name },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:url", content: url },
      { property: "og:image", content: image },
      { property: "og:image:width", content: String(OG_IMAGE.width) },
      { property: "og:image:height", content: String(OG_IMAGE.height) },
      { property: "og:image:alt", content: OG_IMAGE.alt },
      { property: "og:locale", content: "ja_JP" },
      { property: "og:site_name", content: BRAND.name },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: title },
      { name: "twitter:description", content: description },
      { name: "twitter:image", content: image },
    ],
    links: [{ rel: "canonical", href: url }],
  };
}
