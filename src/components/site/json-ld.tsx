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
          description: "京都府内限定で準備中の招待制スーパーカークラブ。",
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
