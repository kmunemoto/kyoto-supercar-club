/**
 * Public operator identity. Leave blank until legally confirmed.
 * Empty fields are never rendered on the public site.
 */
export const OPERATOR = {
  legalName: "KYOTO SUPERCAR CLUB",
  contactEmail: "k.munemoto@kyoto-salute.com",
  postalAddress: "京都府京都市中京区毘沙門町533-1 プラザ御所南",
  phone: "090-8386-0894",
  representative: "宗本 寛太",
} as const;

export function hasOperatorName(): boolean {
  return Boolean(OPERATOR.legalName.trim());
}
