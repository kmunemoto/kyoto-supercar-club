import assert from "node:assert/strict";
import { test } from "node:test";
import {
  SANDBOX_SENDER,
  countStale,
  isSandboxSender,
  isStale,
  opsWarnings,
  parseRecipients,
  STALE_NEW_DAYS,
  STALE_OPEN_DAYS,
} from "./ops-policy.ts";

const NOW = Date.parse("2026-08-29T00:00:00Z");
const daysAgo = (n: number) => new Date(NOW - n * 24 * 60 * 60 * 1000).toISOString();

const HEALTHY = {
  serviceRoleKey: "sk",
  resendApiKey: "re",
  notifyFrom: "KSC <hello@example.com>",
  notifyEmail: "a@example.com, b@example.com",
};

test("a fully configured environment reports nothing", () => {
  assert.deepEqual(opsWarnings(HEALTHY), []);
});

test("a missing service role key is reported, because it fails silently", () => {
  const warnings = opsWarnings({ ...HEALTHY, serviceRoleKey: undefined });
  assert.equal(warnings.length, 1);
  assert.match(warnings[0] ?? "", /SUPABASE_SERVICE_ROLE_KEY/);
});

test("the sandbox sender is reported even though Resend accepts it", () => {
  const warnings = opsWarnings({ ...HEALTHY, notifyFrom: `KSC <${SANDBOX_SENDER}>` });
  assert.equal(warnings.length, 1);
  assert.match(warnings[0] ?? "", /NOTIFY_FROM/);
});

test("no API key supersedes the sender warning", () => {
  const warnings = opsWarnings({ ...HEALTHY, resendApiKey: undefined, notifyFrom: undefined });
  assert.equal(warnings.filter((w) => /RESEND_API_KEY/.test(w)).length, 1);
  assert.equal(warnings.filter((w) => /NOTIFY_FROM/.test(w)).length, 0);
});

test("a single notification recipient is flagged as no redundancy", () => {
  const warnings = opsWarnings({ ...HEALTHY, notifyEmail: "only@example.com" });
  assert.equal(warnings.length, 1);
  assert.match(warnings[0] ?? "", /1件/);
});

test("recipients are split, trimmed, and emptied entries dropped", () => {
  assert.deepEqual(parseRecipients(" a@x.com , b@x.com ,, "), ["a@x.com", "b@x.com"]);
  assert.deepEqual(parseRecipients(""), []);
  assert.deepEqual(parseRecipients(undefined), []);
});

test("an unset sender counts as the sandbox", () => {
  assert.equal(isSandboxSender(undefined), true);
  assert.equal(isSandboxSender("KSC <hi@example.com>"), false);
});

test("a new lead is stale only after the threshold", () => {
  assert.equal(isStale({ status: "new", created_at: daysAgo(STALE_NEW_DAYS - 1) }, NOW), false);
  assert.equal(isStale({ status: "new", created_at: daysAgo(STALE_NEW_DAYS + 1) }, NOW), true);
});

test("a lead being worked stalls on its own, longer threshold", () => {
  const row = { status: "reviewing", created_at: daysAgo(60) };
  assert.equal(isStale({ ...row, updated_at: daysAgo(STALE_OPEN_DAYS - 1) }, NOW), false);
  assert.equal(isStale({ ...row, updated_at: daysAgo(STALE_OPEN_DAYS + 1) }, NOW), true);
});

test("a settled lead is never stale, however old", () => {
  for (const status of ["approved", "declined", "on_hold"]) {
    assert.equal(
      isStale({ status, created_at: daysAgo(999), updated_at: daysAgo(999) }, NOW),
      false,
    );
  }
});

test("an in-progress row with no updated_at falls back to created_at", () => {
  assert.equal(isStale({ status: "terms_adjusting", created_at: daysAgo(90) }, NOW), true);
  assert.equal(isStale({ status: "terms_adjusting", created_at: daysAgo(1) }, NOW), false);
});

test("an unparseable timestamp is not treated as stale", () => {
  assert.equal(isStale({ status: "new", created_at: "not a date" }, NOW), false);
  assert.equal(isStale({ status: "new", created_at: null }, NOW), false);
});

test("countStale counts across both rules", () => {
  const rows = [
    { status: "new", created_at: daysAgo(10) },
    { status: "new", created_at: daysAgo(1) },
    { status: "reviewing", created_at: daysAgo(90), updated_at: daysAgo(30) },
    { status: "approved", created_at: daysAgo(90), updated_at: daysAgo(90) },
  ];
  assert.equal(countStale(rows, NOW), 2);
});
