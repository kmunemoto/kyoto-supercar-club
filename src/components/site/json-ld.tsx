import { BRAND } from "@/lib/brand";
import { FAQS } from "@/lib/content";
import { absUrl } from "@/lib/site";

export function JsonLd({
  data,
}: {
  data: Record<string, unknown> | Array<Record<string, unknown>>;
}) {
  // A "</script>" anywhere in the serialised data would close this tag early.
  const json = JSON.stringify(data).replace(/</g, "\\u003c");
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: json }} />;
}

export function SiteJsonLd() {
  return (
    <JsonLd
      data={[
        {
          "@context": "https://schema.org",
          "@type": "WebSite",
          name: BRAND.name,
          url: absUrl("/"),
          inLanguage: "ja",
        },
        {
          "@context": "https://schema.org",
          "@type": "Organization",
          name: BRAND.name,
          url: absUrl("/"),
          areaServed: { "@type": "AdministrativeArea", name: "京都府" },
          description:
            "京都からスーパーカーの共同購入と、既存オーナー限定の相互利用を準備しているカーライフブランド。",
        },
      ]}
    />
  );
}

/**
 * Only /faq renders every question, so only /faq carries the FAQPage block.
 * Emitting all of them from the home page — which shows four — both contradicts
 * the visible content and duplicates the same block on two URLs.
 */
export function FaqJsonLd({ items = FAQS }: { items?: readonly { q: string; a: string }[] }) {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: items.map((f) => ({
          "@type": "Question",
          name: f.q,
          acceptedAnswer: { "@type": "Answer", text: f.a },
        })),
      }}
    />
  );
}

export function WebPageJsonLd({
  name,
  description,
  path,
}: {
  name: string;
  description: string;
  path: string;
}) {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "WebPage",
        name,
        description,
        url: absUrl(path),
        inLanguage: "ja",
        isPartOf: { "@type": "WebSite", name: BRAND.name, url: absUrl("/") },
        about: {
          "@type": "Organization",
          name: BRAND.name,
          areaServed: { "@type": "AdministrativeArea", name: "京都府" },
        },
      }}
    />
  );
}
