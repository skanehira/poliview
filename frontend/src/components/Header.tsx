import { Button } from "@radix-ui/themes";

interface HeaderProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  activeTab: "policies" | "finance";
  setActiveTab: (tab: "policies" | "finance") => void;
}

export const Header: React.FC<HeaderProps> = ({
  searchTerm,
  setSearchTerm,
  activeTab,
  setActiveTab,
}) => {
  return (
    <header className="fixed top-0 left-0 z-10 w-full rounded-b-lg bg-blue-600 p-4 text-white shadow-md">
      <div className="container mx-auto flex flex-col items-center justify-between sm:flex-row">
        <h1 className="mb-2 font-bold text-2xl sm:mb-0">市政の可視化アプリ</h1>
        <div className="flex w-full items-center space-x-2 sm:w-auto">
          <input
            type="text"
            placeholder="キーワードで政策を検索..."
            className="w-full rounded-md border border-gray-300 p-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-400 sm:w-64"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      {/* タブナビゲーション */}
      <div className="container mx-auto mt-4 flex border-blue-500 border-b">
        <Button
          onClick={() => setActiveTab("policies")}
          variant={activeTab === "policies" ? "solid" : "ghost"}
          color="gray"
          size="2"
          className={
            activeTab === "policies"
              ? "border-white border-b-2 text-white"
              : "text-blue-200 hover:text-white"
          }
        >
          政策一覧
        </Button>
        <Button
          onClick={() => setActiveTab("finance")}
          variant={activeTab === "finance" ? "solid" : "ghost"}
          color="gray"
          size="2"
          className={
            activeTab === "finance"
              ? "border-white border-b-2 text-white"
              : "text-blue-200 hover:text-white"
          }
        >
          市政の収支
        </Button>
      </div>
    </header>
  );
};
