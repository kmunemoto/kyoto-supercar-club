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
    "京都を車両の保管・管理・受け渡し拠点として、共同購入と既存オーナー向けの無料登録を準備しています。",
  region: "京都を車両の保管・管理・受け渡し拠点として準備中",
  kyotoDefinition:
    "車両の保管・管理・受け渡し拠点は京都府内です。共同オーナーや登録オーナーの住所は問いません。",
  siteUrl: "https://kyoto-supercar-club.lovable.app",
} as const;

export const NAV = [
  { href: "/collection", label: "共同所有", labelLong: "スーパーカーを共同所有する" },
  { href: "/owners", label: "REGISTRY", labelLong: "既存スーパーカーオーナー限定・無料登録" },
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
    body: "欲しい一台を、少人数で共同購入・共同所有する仕組み",
  },
  {
    href: "/owners",
    kicker: "KSC REGISTRY｜無料登録",
    title: "スーパーカーをお持ちの方",
    body: "愛車を無料で登録。売却相談・MORNING RUN・愛車撮影のご案内につながります",
  },
] as const;

export const MOBILE_AUX_NAV = [
  { href: "/sell", label: "売却のご相談" },
  { href: "/touring", label: "MORNING RUN（ツーリング）" },
  { href: "/photography", label: "愛車撮影" },
  { href: "/how-it-works", label: "2つのサービスの違い" },
  { href: "/about", label: "準備の現在地" },
  { href: "/safety", label: "安全・保険について" },
  { href: "/faq", label: "よくある質問" },
  { href: "/contact", label: "お問い合わせ" },
] as const;

export const FOOTER_LINKS = [
  { href: "/collection", label: "KSC COLLECTION" },
  { href: "/owners", label: "KSC REGISTRY" },
  { href: "/sell", label: "売却のご相談" },
  { href: "/touring", label: "MORNING RUN" },
  { href: "/photography", label: "愛車撮影" },
  { href: "/about", label: "準備の現在地" },
  { href: "/privacy", label: "プライバシーポリシー" },
  { href: "/terms", label: "利用条件（準備中）" },
  { href: "/contact", label: "お問い合わせ" },
] as const;

export const OWNER_VALUE =
  "既存スーパーカーオーナーのための、無料の車両・オーナー登録サービスです。愛車は所有・保管したまま、費用をかけずにKSCの台帳に加われます。";

export const COLLECTION_VALUE =
  "買えないから、分けるのではない。一台に資金と維持費を固定せず、乗りたい車を合理的に所有する。";

export function pageTitle(page: string): string {
  return `${page} | ${BRAND.name}`;
}
