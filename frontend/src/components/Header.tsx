import { TextField, Tabs } from "@radix-ui/themes";

interface HeaderProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  activeTab: "policies" | "finance";
  setActiveTab: (tab: "policies" | "finance") => void;
  isMobile: boolean;
}

export function Header({
  searchTerm,
  setSearchTerm,
  activeTab,
  setActiveTab,
  isMobile,
}: HeaderProps) {
  return (
    <header
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 10,
        backgroundColor: "var(--blue-9)",
        color: "white",
        padding: "1rem",
        borderBottomLeftRadius: "8px",
        borderBottomRightRadius: "8px",
        boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
      }}
    >
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          display: "flex",
          flexDirection: isMobile ? "column" : "row",
          alignItems: isMobile ? "stretch" : "center",
          justifyContent: isMobile ? "center" : "space-between",
          gap: "1rem",
        }}
      >
        {/* 上段: タイトルとタブ */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: isMobile ? "space-between" : "flex-start",
            gap: isMobile ? "1rem" : "2rem",
            width: isMobile ? "100%" : "auto",
          }}
        >
          <h1
            style={{
              fontSize: isMobile ? "1.25rem" : "1.5rem",
              fontWeight: "bold",
              margin: 0,
            }}
          >
            Poli View
          </h1>

          {/* タブナビゲーション */}
          <Tabs.Root
            value={activeTab}
            onValueChange={(value) =>
              setActiveTab(value as "policies" | "finance")
            }
            activationMode="manual"
          >
            <Tabs.List
              style={{
                display: "flex",
                gap: "0.25rem",
              }}
            >
              <Tabs.Trigger
                value="policies"
                style={{
                  padding: isMobile ? "0.5rem 0.75rem" : "0.75rem 1rem",
                  backgroundColor: "transparent",
                  border: "none",
                  borderBottom:
                    activeTab === "policies"
                      ? "2px solid white"
                      : "2px solid transparent",
                  color: activeTab === "policies" ? "white" : "var(--blue-3)",
                  fontSize: isMobile ? "0.75rem" : "0.875rem",
                  fontWeight: "500",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                }}
                onMouseOver={(e) => {
                  if (activeTab !== "policies") {
                    (e.target as HTMLElement).style.color = "white";
                  }
                }}
                onMouseOut={(e) => {
                  if (activeTab !== "policies") {
                    (e.target as HTMLElement).style.color = "var(--blue-3)";
                  }
                }}
              >
                政策一覧
              </Tabs.Trigger>
              <Tabs.Trigger
                value="finance"
                style={{
                  padding: isMobile ? "0.5rem 0.75rem" : "0.75rem 1rem",
                  backgroundColor: "transparent",
                  border: "none",
                  borderBottom:
                    activeTab === "finance"
                      ? "2px solid white"
                      : "2px solid transparent",
                  color: activeTab === "finance" ? "white" : "var(--blue-3)",
                  fontSize: isMobile ? "0.75rem" : "0.875rem",
                  fontWeight: "500",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                }}
                onMouseOver={(e) => {
                  if (activeTab !== "finance") {
                    (e.target as HTMLElement).style.color = "white";
                  }
                }}
                onMouseOut={(e) => {
                  if (activeTab !== "finance") {
                    (e.target as HTMLElement).style.color = "var(--blue-3)";
                  }
                }}
              >
                市政の収支
              </Tabs.Trigger>
            </Tabs.List>
          </Tabs.Root>
        </div>

        {/* 下段（モバイル）/ 右側（デスクトップ）: 検索欄 */}
        <div style={{ width: isMobile ? "100%" : "16rem" }}>
          <TextField.Root
            placeholder="キーワードで政策を検索..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            size="2"
          />
        </div>
      </div>
    </header>
  );
}
