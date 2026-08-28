/**
 * Single source of truth for the service name and public copy constants.
 * Change `name` here to rebrand the entire site.
 */
export const BRAND = {
  name: "KYOTO SUPERCAR CLUB",
  nameJa: "京都スーパーカークラブ",
  short: "KSC",
  tagline: "京都から、車に憧れる文化をもう一度。",
  purpose: "車の魅力を発信する",
  phaseLabel: "サービス準備中",
  phaseNote:
    "京都限定で、共同購入とオーナー同士の相互利用を準備しています。いまは先行登録・相談のみで、契約・購入・予約ではありません。",
  region: "京都府内限定",
  siteUrl: "https://start-your-spark-56.lovable.app",
} as const;

export const NAV = [
  { href: "/collection", label: "共同所有", labelLong: "スーパーカーを共同所有する" },
  { href: "/owners", label: "オーナーネットワーク", labelLong: "既存スーパーカーオーナー限定" },
  { href: "/how-it-works", label: "サービスの違い", labelLong: "2つのサービスの違い" },
  { href: "/safety", label: "安全・保険", labelLong: "安全・保険について" },
  { href: "/faq", label: "よくある質問", labelLong: "よくある質問" },
  { href: "/contact", label: "お問い合わせ", labelLong: "お問い合わせ" },
] as const;

export const MOBILE_SERVICE_CARDS = [
  {
    href: "/collection",
    kicker: "KSC COLLECTION｜共同所有",
    title: "スーパーカーを共同購入したい方",
    body: "欲しい一台を、6人で共同購入・共同所有する仕組み",
  },
  {
    href: "/owners",
    kicker: "KSC OWNER NETWORK｜オーナーネットワーク",
    title: "スーパーカーをお持ちの方",
    body: "すでにスーパーカーを所有する人だけが、愛車を登録して他の登録車両を相互利用する仕組み",
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
  "京都のスーパーカー所有者限定。愛車を登録し、登録オーナー同士で他の車両を相互利用する仕組みを準備しています";

export const COLLECTION_VALUE =
  "欲しい一台を6人で共同購入・共同所有し、KSCが保管と管理を担う構想です。投資商品ではありません。";

export function pageTitle(page: string): string {
  return `${page} | ${BRAND.name}`;
}
