import assert from "node:assert/strict";
import { test } from "node:test";
import { toCsv } from "./utils.ts";

test("a formula in a form value cannot execute in the export", () => {
  const csv = toCsv([{ full_name: '=HYPERLINK("http://evil.example","click")' }], ["full_name"]);
  const cell = csv.split("\n")[1] ?? "";
  assert.ok(!cell.startsWith("="), `cell must not open with "=": ${cell}`);
  assert.ok(cell.includes("HYPERLINK"), "the text itself is kept, only disarmed");
});

test("every formula lead-in is disarmed", () => {
  for (const lead of ["=", "+", "-", "@"]) {
    const csv = toCsv([{ v: `${lead}cmd` }], ["v"]);
    const cell = (csv.split("\n")[1] ?? "").replace(/^"/, "");
    assert.equal(cell.startsWith(lead), false, `${lead} was left executable`);
  }
});

test("ordinary values are untouched", () => {
  const csv = toCsv(
    [{ full_name: "山田 太郎", email: "taro@example.com" }],
    ["full_name", "email"],
  );
  assert.equal(csv.split("\n")[1], "山田 太郎,taro@example.com");
});

test("commas and quotes are still escaped", () => {
  const csv = toCsv([{ v: 'a,b"c' }], ["v"]);
  assert.equal(csv.split("\n")[1], '"a,b""c"');
});
