import { track } from "@/lib/analytics";
import { getLineUrl } from "@/lib/site";
import { CONTACT_TOPICS } from "@/lib/schemas";

export type InquiryTopic = (typeof CONTACT_TOPICS)[number];

export function InquiryCta({
  topic,
  children,
  className,
  place = "body",
}: {
  topic: InquiryTopic;
  children: React.ReactNode;
  className?: string;
  place?: string;
}) {
  const line = getLineUrl();
  if (line) {
    return (
      <a
        href={line}
        target="_blank"
        rel="noopener noreferrer"
        className={className}
        onClick={() => track("line_cta_click", { place, topic })}
      >
        {children}
      </a>
    );
  }
  return (
    <a
      href={`/contact?topic=${encodeURIComponent(topic)}`}
      className={className}
      onClick={() => track("contact_form_start", { place, topic })}
    >
      {children}
    </a>
  );
}
