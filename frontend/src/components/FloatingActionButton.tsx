import { Button, Select } from "@radix-ui/themes";

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
    <div
      style={{
        position: "fixed",
        right: "2rem",
        bottom: "2rem",
        zIndex: 20,
      }}
    >
      <div style={{ position: "relative" }}>
        {/* FABボタン */}
        <Button
          onClick={() => setShowFabMenu(!showFabMenu)}
          variant="solid"
          color="blue"
          size="4"
          radius="full"
          style={{
            width: "3.5rem",
            height: "3.5rem",
            fontSize: "1.875rem",
            fontWeight: "bold",
            boxShadow:
              "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
            transition: "transform 0.3s ease-in-out",
            cursor: "pointer",
          }}
          onMouseEnter={(e) => {
            (e.target as HTMLElement).style.transform = "scale(1.05)";
          }}
          onMouseLeave={(e) => {
            (e.target as HTMLElement).style.transform = "scale(1)";
          }}
        >
          {showFabMenu ? "−" : "+"}
        </Button>
        {/* メニュー項目 (FABボタンに対して絶対位置で配置) */}
        {showFabMenu && (
          <div
            style={{
              position: "absolute",
              right: 0,
              bottom: "100%",
              marginBottom: "0.75rem",
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-end",
              gap: "0.75rem",
            }}
          >
            <Button
              onClick={onAddPolicy}
              variant="solid"
              color="green"
              size="2"
              radius="full"
              style={{
                whiteSpace: "nowrap",
                fontSize: "0.875rem",
                boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
              }}
            >
              政策を追加
            </Button>
            <div
              style={{
                backgroundColor: "white",
                padding: "0.5rem",
                borderRadius: "9999px",
                boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
              }}
            >
              <Select.Root
                value={sortOrder}
                onValueChange={(value) => {
                  const event = {
                    target: { value },
                  } as React.ChangeEvent<HTMLSelectElement>;
                  onSortChange(event);
                }}
              >
                <Select.Trigger
                  style={{
                    borderRadius: "9999px",
                    fontSize: "0.875rem",
                    minWidth: "150px",
                  }}
                />
                <Select.Content>
                  <Select.Item value="newest">新しい順</Select.Item>
                  <Select.Item value="popularity_desc">
                    人気度が高い順
                  </Select.Item>
                  <Select.Item value="popularity_asc">
                    人気度が低い順
                  </Select.Item>
                </Select.Content>
              </Select.Root>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
