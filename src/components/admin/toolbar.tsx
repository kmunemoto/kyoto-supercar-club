import { APPLICATION_STATUSES, STATUS_LABEL } from "@/lib/status";
import { Input, NativeSelect } from "@/components/ui/native";
import { Button } from "@/components/ui/button";

export function AdminToolbar({
  q,
  status,
  onQ,
  onStatus,
  onExport,
}: {
  q: string;
  status: string;
  onQ: (v: string) => void;
  onStatus: (v: string) => void;
  onExport: () => void;
}) {
  return (
    <div className="flex flex-col gap-3 md:flex-row md:items-center">
      <Input
        value={q}
        onChange={(e) => onQ(e.target.value)}
        placeholder="氏名・メール・電話で検索"
        className="md:max-w-xs"
        aria-label="検索"
      />
      <NativeSelect
        value={status}
        onChange={(e) => onStatus(e.target.value)}
        className="md:max-w-[12rem]"
        aria-label="ステータス"
      >
        <option value="all">すべてのステータス</option>
        {APPLICATION_STATUSES.map((s) => (
          <option key={s} value={s}>
            {STATUS_LABEL[s]}
          </option>
        ))}
      </NativeSelect>
      <Button type="button" variant="outline" size="sm" onClick={onExport} className="md:ml-auto">
        CSV出力
      </Button>
    </div>
  );
}
