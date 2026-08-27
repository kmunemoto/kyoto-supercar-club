/**
 * Single source of truth for the service name and public copy constants.
 * Change `name` here to rebrand the entire site.
 */
export const BRAND = {
  name: "KYOTO SUPERCAR CLUB",
  nameJa: "京都スーパーカークラブ",
  short: "KSC",
  tagline: "車を、もう一度憧れに。",
  purpose: "車の魅力を発信する",
  phaseLabel: "サービス準備中",
  phaseNote:
    "共同所有とオーナーネットワークを、京都から準備しています。事前登録は契約・購入・予約ではありません。",
  region: "京都府内限定",
  siteUrl: "https://start-your-spark-56.lovable.app",
} as const;

export const NAV = [
  { href: "/collection", label: "共同所有" },
  { href: "/owners", label: "オーナーネットワーク" },
  { href: "/how-it-works", label: "仕組み" },
  { href: "/safety", label: "安全管理" },
  { href: "/faq", label: "FAQ" },
  { href: "/contact", label: "お問い合わせ" },
] as const;

export const FOOTER_LINKS = [
  { href: "/collection", label: "KSC COLLECTION" },
  { href: "/owners", label: "KSC OWNER NETWORK" },
  { href: "/privacy", label: "プライバシーポリシー" },
  { href: "/terms", label: "利用条件（準備中）" },
  { href: "/contact", label: "お問い合わせ" },
] as const;

export const OWNER_VALUE =
  "愛車を登録することで、厳選された他のオーナー車両を利用できる仕組みを、京都で準備しています";

export const COLLECTION_VALUE =
  "一台を少人数で共同所有し、KSCが保管と管理を担う構想です。投資商品ではありません。";

export function pageTitle(page: string): string {
  return `${page} | ${BRAND.name}`;
}
