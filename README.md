# KYOTO SUPERCAR CLUB

京都府内限定の招待制スーパーカークラブ。現在は**サービス準備中**です。予約・貸出・決済は行いません。最優先は、京都府内のスーパーカーオーナーからの車両提供に関する先行相談です。

Lovable プロジェクト: [lovable.dev/projects/f9b4c823-3a2e-4ecc-87ff-3c3cefcb17ae](https://lovable.dev/projects/f9b4c823-3a2e-4ecc-87ff-3c3cefcb17ae)

公開URL（現時点）: https://start-your-spark-56.lovable.app/

サービス名は [`src/lib/brand.ts`](src/lib/brand.ts) の `BRAND.name` を書き換えるとサイト全体に反映されます。

## できること

- 公開サイト（仕組み、安全管理、会員制度、オーナー案内、FAQ、プライバシー、利用条件）
- 車両オーナーの先行相談フォーム（Lovable Cloud へ保存）
- 会員事前登録フォーム
- お問い合わせ
- 運営向け管理画面（Lovable Cloud Auth + staff 許可リスト）

## 動かし方

```bash
npm i
npm run dev
```

公開URL・canonical は `VITE_PUBLIC_SITE_URL` で切り替えます。未設定時は Lovable の実URLを使います。

## 管理画面

`/login` から入ります。共有コード方式は廃止しました。

1. Lovable Cloud Auth で管理者ユーザーを作成する
2. `staff` テーブルにそのユーザーの `user_id` を追加する
3. メールアドレスとパスワードでログインする

staff に無いアカウントはログインできません。

## Lovable Cloud

このプロジェクトは **既存の Lovable Cloud** を使います。外部に新しい Supabase プロジェクトは作りません。

接続後、[`supabase/migrations/`](supabase/migrations/) を **追加分も含めて順に** SQL Editor で実行してください。既存マイグレーションは削除・上書きしません。

サーバー専用の値（service role、Resend、通知先メール）は **Lovable Cloud Secrets** にだけ置いてください。`VITE_` には入れないでください。

## 注意

レンタカー許可、保険、オーナー契約、税務は未確認です。サイト上では補償や料金を確約していません。管理画面の「要確認」を参照してください。
