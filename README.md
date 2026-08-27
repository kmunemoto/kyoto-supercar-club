# KYOTO SUPERCAR CLUB

京都からスーパーカーの魅力を発信するカーライフブランド。現在は**サービス準備中**です。予約・貸出・決済・購入申込は行いません。

主力は少人数での**共同所有（KSC COLLECTION）**です。あわせて、既存オーナー同士の**オーナーネットワーク**を検討しています。一般会員向けの貸し出しは保留し、新規募集していません。

Lovable プロジェクト: [lovable.dev/projects/f9b4c823-3a2e-4ecc-87ff-3c3cefcb17ae](https://lovable.dev/projects/f9b4c823-3a2e-4ecc-87ff-3c3cefcb17ae)

公開URL（現時点）: https://start-your-spark-56.lovable.app/

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

公開URL・canonical は `VITE_PUBLIC_SITE_URL` で切り替えます。未設定時は Lovable の実URLを使います。

LINE 導線は `VITE_KSC_LINE_URL` です。未設定時は `/contact` へ落ちます。コードに LINE URL を直接書かないでください。

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

## 注意

共同所有の名義、保険、許認可、税務、オーナー契約は未確認です。サイト上では補償、料金、車種、売却価格を確約していません。管理画面の「要確認」を参照してください。
