import { getLineUrl } from "@/lib/site";
import { CONTACT_TOPICS } from "@/lib/schemas";

export type InquiryTopic = (typeof CONTACT_TOPICS)[number];

export function InquiryCta({
  topic,
  children,
  className,
}: {
  topic: InquiryTopic;
  children: React.ReactNode;
  className?: string;
}) {
  const line = getLineUrl();
  if (line) {
    return (
      <a href={line} target="_blank" rel="noopener noreferrer" className={className}>
        {children}
      </a>
    );
  }
  return (
    <a href={`/contact?topic=${encodeURIComponent(topic)}`} className={className}>
      {children}
    </a>
  );
}
