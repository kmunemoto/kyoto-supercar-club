import { createFileRoute, redirect } from "@tanstack/react-router";

/**
 * The old general-membership intake. Its content now lives on /membership;
 * keeping two near-identical pages meant one of them always drifted, and this
 * one only ever linked on to COLLECTION, losing owners who arrived here.
 */
export const Route = createFileRoute("/apply/member")({
  beforeLoad: () => {
    throw redirect({ to: "/membership", statusCode: 301 });
  },
});
