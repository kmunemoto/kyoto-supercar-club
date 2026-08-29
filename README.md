# KYOTO SUPERCAR CLUB

京都からスーパーカーの魅力を発信するカーライフブランド。現在は**サービス準備中**です。予約・貸出・決済・購入申込は行いません。

主力は少人数での**共同所有（KSC COLLECTION）**です。あわせて、既存オーナー同士の**オーナーネットワーク**を検討しています。一般会員向けの貸し出しは保留し、新規募集していません。

Lovable プロジェクト: [lovable.dev/projects/f9b4c823-3a2e-4ecc-87ff-3c3cefcb17ae](https://lovable.dev/projects/f9b4c823-3a2e-4ecc-87ff-3c3cefcb17ae)

公開URL: https://kyoto-supercar-club.lovable.app/

サービス名は [`src/lib/brand.ts`](src/lib/brand.ts) の `BRAND.name` を書き換えるとサイト全体に反映されます。

## できること

- 公開サイト（共同所有、オーナーネットワーク、仕組み、安全管理、FAQ、プライバシー、利用条件）
- 共同オーナー候補の事前登録（Lovable Cloud へ保存）
- オーナーネットワークの先行相談
- お問い合わせ
- 運営向け管理画面（Lovable Cloud Auth + staff 許可リスト）
- 旧・一般会員事前登録のアーカイブ閲覧（新規受付は停止）

## 動かし方

```bash
npm i
npm run dev
```

チェックは `npm run typecheck` / `npm run lint` / `npm run test` です。GitHub Actions
（`.github/workflows/ci.yml`）で push ごとに同じものとビルドを実行します。

公開URL・canonical は `VITE_PUBLIC_SITE_URL` で切り替えます。未設定時は Lovable の実URLを使い、
ビルド時に警告を出します。**独自ドメイン公開時はこれを必ず設定してください。**未設定のままだと
canonical・sitemap・OGP がすべて旧URLを正典として指し続けます。公開ページの一覧は
[`site.config.ts`](site.config.ts) が単一の情報源で、アプリの canonical と `sitemap.xml`
の両方がここから生成されます。

LINE 導線は公式アカウント（`src/lib/site.ts` の `OFFICIAL_LINE_URL`）です。アカウントが変わったときだけ
`VITE_KSC_LINE_URL` で上書きしてください。`off` を設定すると、サイト上の LINE 導線がすべて
お問い合わせフォームに切り替わります。

## 管理画面

`/login` から入ります。共有コード方式は廃止しました。

1. Lovable Cloud Auth で管理者ユーザーを作成する
2. `staff` テーブルにそのユーザーの `user_id` を追加する
3. メールアドレスとパスワードでログインする

staff に無いアカウントはログインできません。

## Lovable Cloud

このプロジェクトは **既存の Lovable Cloud** を使います。外部に新しい Supabase プロジェクトは作りません。

接続後、[`supabase/migrations/`](supabase/migrations/) を **追加分も含めて順に** SQL Editor で実行してください。既存マイグレーションは削除・上書きしません。`member_preregistrations` の既存データは削除しないでください。

サーバー専用の値（service role、Resend、通知先メール）は **Lovable Cloud Secrets** にだけ置いてください。`VITE_` には入れないでください。

メール（受付控えと運営通知）は `RESEND_API_KEY` と `NOTIFY_EMAIL` が設定されているときだけ送信します。
`NOTIFY_FROM` は **Resend で認証済みのドメイン** のアドレスにしてください。既定の `noreply@resend.dev`
は Resend のサンドボックスで、アカウント所有者以外には届きません。送信の成否は `notification_log`
テーブルとサーバーログに記録されます。

## 画像

`public/images/` の配信用ファイル（AVIF / WebP / JPEG の各サイズ）は
[`scripts/build-images.mjs`](scripts/build-images.mjs) が生成します。元画像は `assets/photos/`
にあり、公開ディレクトリには置きません。写真を差し替えたときだけ実行してください。

```bash
npm i --no-save sharp && node scripts/build-images.mjs
```

## 個人情報の削除請求

管理画面の各詳細ページに「個人情報を削除する」があります。氏名・連絡先・自由記述を消し、
件数・ステータス・受付日は統計のために残します。実行は対応履歴に記録されます。
LINE 経由の相談はトーク履歴の削除も必要です。手順は [`docs/OPERATIONS.md`](docs/OPERATIONS.md)。

## フォーム以外で受けた相談

LINE・電話・対面で受けた相談は `/admin/intake` から登録してください。登録しない限り、
その相談には対応状況・滞留の検知・削除請求への対応のどれも効きません。

## バックアップ

管理画面の概況にある「すべて書き出す（JSON）」で、全リードに加えてメモ・対応履歴・
要確認台帳・通知記録を書き出します。一覧ごとの CSV には**メモと対応履歴が含まれません**。
週次での実行を推奨します（[`docs/OPERATIONS.md`](docs/OPERATIONS.md)）。

## ドキュメント

- [`docs/SYSTEM_REVIEW.md`](docs/SYSTEM_REVIEW.md) — システム評価と変更提案
- [`docs/LAUNCH_SYSTEMS.md`](docs/LAUNCH_SYSTEMS.md) — ローンチ時の作る/買う/人手の割り当て
- [`docs/OPERATIONS.md`](docs/OPERATIONS.md) — 週次の運用、ドメイン移行チェックリスト、削除請求の手順
- [`docs/IMPROVEMENT_IDEAS.md`](docs/IMPROVEMENT_IDEAS.md) — コードベースの改善提案（実装済み）

## 注意

共同所有の名義、保険、許認可、税務、オーナー契約は未確認です。サイト上では補償、料金、車種、売却価格を確約していません。管理画面の「要確認」を参照してください。
