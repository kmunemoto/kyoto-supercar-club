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
  { href: "/collection", label: "共同購入", labelLong: "スーパーカーを共同購入する" },
  { href: "/owners", label: "愛車登録", labelLong: "愛車を登録する" },
  { href: "/how-it-works", label: "サービスの違い", labelLong: "2つのサービスの違い" },
  { href: "/safety", label: "安全・保険", labelLong: "安全・保険について" },
  { href: "/faq", label: "よくある質問", labelLong: "よくある質問" },
  { href: "/contact", label: "お問い合わせ", labelLong: "お問い合わせ" },
] as const;

export const MOBILE_SERVICE_CARDS = [
  {
    href: "/collection",
    kicker: "KSC COLLECTION",
    title: "スーパーカーを共同購入したい方",
    body: "複数人で1台を購入し、実際に共同所有する仕組み",
  },
  {
    href: "/owners",
    kicker: "KSC OWNER NETWORK",
    title: "スーパーカーをお持ちの方",
    body: "愛車を登録し、所有者限定で他の登録車両を相互利用する仕組み",
  },
] as const;

export const MOBILE_AUX_NAV = [
  { href: "/how-it-works", label: "2つのサービスの違い" },
  { href: "/safety", label: "安全・保険について" },
  { href: "/faq", label: "よくある質問" },
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
