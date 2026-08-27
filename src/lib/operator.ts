/**
 * Public operator identity. Leave blank until legally confirmed.
 * Empty fields are never rendered on the public site.
 */
export const OPERATOR = {
  legalName: "",
  contactEmail: "",
  postalAddress: "",
  phone: "",
  representative: "",
} as const;

export function hasOperatorName(): boolean {
  return Boolean(OPERATOR.legalName.trim());
}
