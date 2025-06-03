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
    <header className="fixed top-0 left-0 w-full bg-blue-600 text-white p-4 shadow-md rounded-b-lg z-10">
      <div className="container mx-auto flex flex-col sm:flex-row justify-between items-center">
        <h1 className="text-2xl font-bold mb-2 sm:mb-0">市政の可視化アプリ</h1>
        <div className="flex items-center space-x-2 w-full sm:w-auto">
          <input
            type="text"
            placeholder="キーワードで政策を検索..."
            className="p-2 rounded-md border border-gray-300 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-400 w-full sm:w-64"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      {/* タブナビゲーション */}
      <div className="container mx-auto mt-4 flex border-b border-blue-500">
        <Button
          onClick={() => setActiveTab("policies")}
          variant={activeTab === "policies" ? "solid" : "ghost"}
          color="gray"
          size="2"
          className={
            activeTab === "policies"
              ? "border-b-2 border-white text-white"
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
              ? "border-b-2 border-white text-white"
              : "text-blue-200 hover:text-white"
          }
        >
          市政の収支
        </Button>
      </div>
    </header>
  );
};
