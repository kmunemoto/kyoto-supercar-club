/**
 * Single source of truth for the service name and public copy constants.
 * Change `name` here to rebrand the entire site.
 */
export const BRAND = {
  name: "KYOTO SUPERCAR CLUB",
  nameJa: "京都スーパーカークラブ",
  short: "KSC",
  tagline: "京都から始まる、新しいカーライフ",
  phaseLabel: "サービス準備中",
  phaseNote: "先行相談・事前登録を受け付けています。現時点では予約・貸出はできません。",
  region: "京都・滋賀・大阪北部",
  siteUrl: "https://kyotosupercar.club",
} as const;

export const NAV = [
  { href: "/how-it-works", label: "仕組み" },
  { href: "/safety", label: "安全管理" },
  { href: "/membership", label: "会員制度" },
  { href: "/owners", label: "オーナーの方へ" },
  { href: "/faq", label: "FAQ" },
  { href: "/contact", label: "お問い合わせ" },
] as const;

export const FOOTER_LINKS = [
  { href: "/privacy", label: "プライバシーポリシー" },
  { href: "/terms", label: "利用条件（準備中）" },
  { href: "/contact", label: "お問い合わせ" },
  { href: "/admin", label: "運営" },
] as const;

export const OWNER_VALUE =
  "大切な愛車を最高の状態で管理しながら、維持費の負担を軽くする";

export const MEMBER_VALUES = [
  "所有する前に、本当に好きな一台と出会える",
  "厳選された車を、審査された会員だけで共有する",
  "京都から始まる、新しいカーライフ",
] as const;

export function pageTitle(page: string): string {
  return `${page} | ${BRAND.name}`;
}
