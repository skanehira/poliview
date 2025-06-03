import { useEffect, useState } from "react";
import { FinanceChart } from "./components/FinanceChart";
import { FloatingActionButton } from "./components/FloatingActionButton";
import { Header } from "./components/Header";
import { PolicyAddModal } from "./components/PolicyAddModal";
import { PolicyDetailModal } from "./components/PolicyDetailModal";
import { PolicyList } from "./components/PolicyList";
import { usePolicies } from "./hooks/usePolicies";
import type { Policy } from "./types/policy";

function App() {
  // Policies management with custom hook
  const {
    policies,
    sortOrder,
    addPolicy,
    handleVote,
    handleAddComment,
    handleCommentVote,
    handleSortChange,
    getStatusClasses,
  } = usePolicies();

  // UI state
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPolicy, setSelectedPolicy] = useState<Policy | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [simplifiedPolicyText, setSimplifiedPolicyText] = useState(""); // LLMによる要約テキスト
  const [isSummarizing, setIsSummarizing] = useState(false); // LLM呼び出し中のローディング状態
  const [showSimplifiedSummary, setShowSimplifiedSummary] = useState(false); // 要約内容の開閉状態
  const [showFabMenu, setShowFabMenu] = useState(false); // FABメニューの開閉状態
  const [activeTab, setActiveTab] = useState<"policies" | "finance">(
    "policies",
  ); // 'policies' or 'finance'

  // LLMによる政策要約機能
  const summarizePolicy = async (policy: Policy) => {
    setIsSummarizing(true);
    setSimplifiedPolicyText("要約を生成中..."); // ローディングメッセージ
    setShowSimplifiedSummary(true); // 要約生成開始時に開く

    const prompt = `以下の市政の政策について、高校生にもわかるように、より簡潔で平易な言葉で要約してください。特に、専門用語を避け、具体的な影響が伝わるように工夫してください。

政策タイトル: ${policy.title}
目的: ${policy.purpose}
概要: ${policy.overview}
具体的計画: ${policy.detailedPlan}`;

    const chatHistory: Array<{ role: string; parts: Array<{ text: string }> }> =
      [];
    chatHistory.push({ role: "user", parts: [{ text: prompt }] });

    const payload = { contents: chatHistory };
    const apiKey = ""; // If you want to use models other than gemini-2.0-flash or imagen-3.0-generate-002, provide an API key here. Otherwise, leave this as-is.
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (response.status !== 200) {
        setSimplifiedPolicyText("要約の生成に失敗しました。");
        console.error("LLM API error:", response.status, response.statusText);
        return;
      }
      const result = await response.json();

      if (
        result.candidates &&
        result.candidates.length > 0 &&
        result.candidates[0].content &&
        result.candidates[0].content.parts &&
        result.candidates[0].content.parts.length > 0
      ) {
        const text = result.candidates[0].content.parts[0].text;
        setSimplifiedPolicyText(text);
      } else {
        setSimplifiedPolicyText("要約の生成に失敗しました。");
        console.error("Unexpected LLM response structure:", result);
      }
    } catch (error) {
      setSimplifiedPolicyText("要約の生成中にエラーが発生しました。");
      console.error("Error calling LLM API:", error);
    } finally {
      setIsSummarizing(false);
    }
  };

  // ポリシー詳細モーダルを閉じる
  const closeModal = () => {
    setSelectedPolicy(null);
    setSimplifiedPolicyText(""); // モーダルを閉じるときに要約テキストをクリア
    setShowSimplifiedSummary(false); // モーダルを閉じるときに要約の開閉状態をリセット
  };

  // モーダル表示中の背景スクロール制御 (政策詳細モーダルのみ)
  useEffect(() => {
    if (selectedPolicy || showAddForm) {
      document.body.style.overflow = "hidden"; // スクロールを禁止
    } else {
      document.body.style.overflow = "unset"; // スクロールを許可
    }
    // コンポーネントのアンマウント時やselectedPolicyが変更された際にクリーンアップ
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [selectedPolicy, showAddForm]); // 依存配列に追加

  // policiesが更新されたら、selectedPolicyも最新の状態に更新
  useEffect(() => {
    if (selectedPolicy) {
      const updatedSelectedPolicy = policies.find(
        (p) => p.id === selectedPolicy.id,
      );
      if (updatedSelectedPolicy) {
        setSelectedPolicy(updatedSelectedPolicy);
      } else {
        // もし選択されていた政策がpoliciesから削除された場合（通常は発生しないはずだが念のため）
        setSelectedPolicy(null);
      }
    }
  }, [policies, selectedPolicy]); // policiesの変更を監視

  return (
    <div className="flex min-h-screen flex-col bg-gray-50 font-sans text-gray-800">
      <Header
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {/* メインコンテンツ */}
      {/* ヘッダーの高さ分、上部にパディングを追加 */}
      <main className="container mx-auto flex-grow p-4 pt-40 sm:pt-36">
        {" "}
        {/* ヘッダーの高さに合わせて調整 */}
        {activeTab === "policies" && (
          <PolicyList
            policies={policies}
            searchTerm={searchTerm}
            onPolicySelect={setSelectedPolicy}
            onVote={handleVote}
            getStatusClasses={getStatusClasses}
          />
        )}
        {activeTab === "finance" && <FinanceChart />}
      </main>

      {/* 政策詳細モーダル */}
      <PolicyDetailModal
        policy={selectedPolicy}
        isOpen={selectedPolicy !== null}
        onClose={closeModal}
        onVoteComment={handleCommentVote}
        onAddComment={handleAddComment}
        onSummarizePolicy={summarizePolicy}
        isSummarizing={isSummarizing}
        simplifiedPolicyText={simplifiedPolicyText}
        showSimplifiedSummary={showSimplifiedSummary}
        onToggleSimplifiedSummary={() =>
          setShowSimplifiedSummary(!showSimplifiedSummary)
        }
      />

      {/* フローティングアクションボタン (FAB) メニュー */}
      {activeTab === "policies" && (
        <FloatingActionButton
          showFabMenu={showFabMenu}
          setShowFabMenu={setShowFabMenu}
          sortOrder={sortOrder}
          onSortChange={(e) => {
            handleSortChange(e);
            setShowFabMenu(false);
          }}
          onAddPolicy={() => {
            setShowAddForm(true);
            setShowFabMenu(false);
          }}
        />
      )}

      {/* 政策追加モーダル */}
      <PolicyAddModal
        isOpen={showAddForm}
        onClose={() => setShowAddForm(false)}
        onAddPolicy={addPolicy}
      />
    </div>
  );
}

export default App;
