# KYOTO SUPERCAR CLUB

京都発の招待制スーパーカーシェア。現在は**サービス準備中**の検証用MVPです。予約・貸出・決済は行いません。

Lovable プロジェクト: [lovable.dev/projects/f9b4c823-3a2e-4ecc-87ff-3c3cefcb17ae](https://lovable.dev/projects/f9b4c823-3a2e-4ecc-87ff-3c3cefcb17ae)

サービス名は [`src/lib/brand.ts`](src/lib/brand.ts) の `BRAND.name` を書き換えるとサイト全体に反映されます。

## できること

- 公開サイト（仕組み、安全管理、会員制度、オーナー案内、FAQ、プライバシー、利用条件）
- 車両オーナーの相談フォーム
- 会員事前登録フォーム
- お問い合わせ
- 運営向け管理画面（申込一覧、詳細、検索、ステータス、メモ、対応履歴、CSV、集計）

## 動かし方

```bash
npm i
npm run dev
```

## 管理画面

`/login` から入ります。

- メールアドレス: 任意（記録用）
- 運営コード: `kyoto-staff`（`VITE_STAFF_CODE` で変更可）

申込データは、Supabase 接続前はブラウザの localStorage に保存されます。同じブラウザでフォーム送信 → 管理画面、の流れを確認できます。ダミー申込が最初から入っています。

## Supabase

Lovable 内の Supabase を使う想定です。接続後、[`supabase/migrations/`](supabase/migrations/) を SQL Editor で実行してください。テーブルと将来拡張用の空テーブルが入っています。

## 注意

レンタカー許可、保険、オーナー契約、税務は未確認です。サイト上では補償や料金を確約していません。管理画面の「要確認」を参照してください。
