<!-- LOVABLE:BEGIN -->

> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.

<!-- LOVABLE:END -->

<!-- 以下は Lovable の管理外です。LOVABLE ブロックの中は編集しないでください。 -->

## 作業の進め方

作業は次の順に**最後まで通してから完了とする**。ブランチに push した時点では終わりではない。

1. 実装する。
2. 検証する。`npm run typecheck` / `npm run lint` / `npm run test` / `npm run build`
   を全て通す。画面を変えたときは、実際に表示して意図どおりか確認する。
3. 作業ブランチにコミットして push する。
4. **main にマージして push する。**
5. GitHub Actions の CI が main で成功したことを確認する。失敗していれば直す。

### マージのしかた

- main は Lovable に接続されたブランチ。push すると Lovable エディタと公開プレビューに
  即反映されるため、**壊れた main を残さない**。手順2が通っていないものはマージしない。
- fast-forward か、マージコミットのみ。**rebase・squash・amend・force push は使わない**
  （上の LOVABLE ブロックのとおり、Lovable 側の履歴が壊れる）。
- main が先に進んでいて競合する場合は、main を作業ブランチに取り込んで解決してから
  マージする。逆向き（main の上で解決）はしない。

### Lovable エディタで編集したとき

エディタ（AI 編集を含む）からの変更は main に直接載り、公開プレビューへ即座に反映される。
上の検証フローを通らないため、次を必ず行う。

- 編集後に GitHub Actions の CI 結果を確認する。赤ければ直す。
- 公開プレビューを開き、意図した表示になっているか目で確認する。
- 大きな変更、複数ファイルにまたがる変更は、エディタではなくブランチ経由で行う。

### マージせずに確認を取るもの

自動で進めてよいのは、検証で正しさを示せる変更に限る。次のものは、実装しても
マージせずに判断を仰ぐ。

- 事実を創作しないと書けないもの（運営者情報、実績、料金の確定値など）。
- 公開している方針を変えるもの（補償・料金・車種・売却価格の確約に関わる表記）。
- 個人情報の取扱いや法務表記の変更で、専門家確認が前提になっているもの。
