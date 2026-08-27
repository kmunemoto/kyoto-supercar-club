import { createServerFn } from "@tanstack/react-start";
import {
  contactSchema,
  fieldErrors,
  memberPreregSchema,
  ownerInquirySchema,
  type ContactInput,
  type MemberPreregInput,
  type OwnerInquiryInput,
} from "@/lib/schemas";

type Result =
  { ok: true; id: string } | { ok: false; error: string; fields?: Record<string, string> };

function spam(data: { companyUrl?: string | undefined }): boolean {
  return Boolean(data.companyUrl && data.companyUrl.trim());
}

export const submitOwnerInquiry = createServerFn({ method: "POST" })
  .validator((data: unknown) => data)
  .handler(async ({ data }): Promise<Result> => {
    const parsed = ownerInquirySchema.safeParse(data);
    if (!parsed.success) {
      return {
        ok: false,
        error: "入力内容を確認してください。",
        fields: fieldErrors(parsed.error),
      };
    }
    if (spam(parsed.data)) return { ok: true, id: "ignored" };
    const { insertOwnerInquiry } = await import("@/lib/cloud.server");
    return insertOwnerInquiry(parsed.data as OwnerInquiryInput);
  });

export const submitMemberPrereg = createServerFn({ method: "POST" })
  .validator((data: unknown) => data)
  .handler(async ({ data }): Promise<Result> => {
    const parsed = memberPreregSchema.safeParse(data);
    if (!parsed.success) {
      return {
        ok: false,
        error: "入力内容を確認してください。",
        fields: fieldErrors(parsed.error),
      };
    }
    if (spam(parsed.data)) return { ok: true, id: "ignored" };
    const { insertMemberPrereg } = await import("@/lib/cloud.server");
    return insertMemberPrereg(parsed.data as MemberPreregInput);
  });

export const submitContact = createServerFn({ method: "POST" })
  .validator((data: unknown) => data)
  .handler(async ({ data }): Promise<Result> => {
    const parsed = contactSchema.safeParse(data);
    if (!parsed.success) {
      return {
        ok: false,
        error: "入力内容を確認してください。",
        fields: fieldErrors(parsed.error),
      };
    }
    if (spam(parsed.data)) return { ok: true, id: "ignored" };
    const { insertContact } = await import("@/lib/cloud.server");
    return insertContact(parsed.data as ContactInput);
  });
