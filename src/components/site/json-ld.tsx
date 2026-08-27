import { BRAND } from "@/lib/brand";
import { FAQS } from "@/lib/content";
import { absUrl } from "@/lib/site";

export function JsonLd({
  data,
}: {
  data: Record<string, unknown> | Array<Record<string, unknown>>;
}) {
  return (
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />
  );
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
            "京都からスーパーカーの共同所有とオーナーネットワークを準備しているカーライフブランド。",
        },
      ]}
    />
  );
}

export function FaqJsonLd() {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: FAQS.map((f) => ({
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
