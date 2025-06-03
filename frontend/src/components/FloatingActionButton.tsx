import { Button } from "@radix-ui/themes";

interface FloatingActionButtonProps {
  showFabMenu: boolean;
  setShowFabMenu: (show: boolean) => void;
  sortOrder: "newest" | "popularity_desc" | "popularity_asc";
  onSortChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  onAddPolicy: () => void;
}

export function FloatingActionButton({
  showFabMenu,
  setShowFabMenu,
  sortOrder,
  onSortChange,
  onAddPolicy,
}: FloatingActionButtonProps) {
  return (
    <div className="fixed right-8 bottom-8 z-20">
      <div className="relative">
        {/* FABボタン */}
        <Button
          onClick={() => setShowFabMenu(!showFabMenu)}
          variant="solid"
          color="blue"
          size="4"
          radius="full"
          className="h-14 w-14 transform font-bold text-3xl shadow-xl transition duration-300 ease-in-out hover:scale-105"
        >
          {showFabMenu ? "−" : "+"}
        </Button>
        {/* メニュー項目 (FABボタンに対して絶対位置で配置) */}
        {showFabMenu && (
          <div className="absolute right-0 bottom-full mb-3 flex flex-col items-end space-y-3">
            <Button
              onClick={onAddPolicy}
              variant="solid"
              color="green"
              size="2"
              radius="full"
              className="whitespace-nowrap text-sm shadow-lg"
            >
              政策を追加
            </Button>
            <div className="rounded-full bg-white p-2 shadow-lg">
              <select
                value={sortOrder}
                onChange={onSortChange}
                className="rounded-full border border-gray-300 p-2 text-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
              >
                <option value="newest">新しい順</option>
                <option value="popularity_desc">人気度が高い順</option>
                <option value="popularity_asc">人気度が低い順</option>
              </select>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
