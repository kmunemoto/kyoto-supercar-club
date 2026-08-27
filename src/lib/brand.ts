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
  phaseNote:
    "現在は車両提供パートナーとの先行相談を受け付けています。相談だけで契約・預かり・貸出が始まることはありません。",
  region: "京都府内限定",
  siteUrl: "https://start-your-spark-56.lovable.app",
} as const;

export const NAV = [
  { href: "/owners", label: "オーナーの方へ" },
  { href: "/how-it-works", label: "仕組み" },
  { href: "/safety", label: "安全管理" },
  { href: "/membership", label: "会員制度" },
  { href: "/faq", label: "FAQ" },
  { href: "/contact", label: "お問い合わせ" },
] as const;

export const FOOTER_LINKS = [
  { href: "/privacy", label: "プライバシーポリシー" },
  { href: "/terms", label: "利用条件（準備中）" },
  { href: "/contact", label: "お問い合わせ" },
] as const;

export const OWNER_VALUE =
  "オーナーご自身の利用を最優先にしながら、保管・維持管理と審査制会員による活用を京都で準備しています";

export const MEMBER_VALUES = [
  "見る・知るところから、車を好きになれる",
  "クラブへの参加と運転資格を分けた審査制",
  "京都から始まる、新しいカーライフ",
] as const;

export function pageTitle(page: string): string {
  return `${page} | ${BRAND.name}`;
}
