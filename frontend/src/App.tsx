import { useState, useEffect, useCallback } from "react";
import { Button } from "@radix-ui/themes";
import { PolicyDetailModal } from "./components/PolicyDetailModal";
import { PolicyAddModal } from "./components/PolicyAddModal";
import { FinanceChart } from "./components/FinanceChart";
import { Header } from "./components/Header";
import type { Policy, NewPolicy, Policies } from "./types/policy";
import { DUMMY_POLICIES } from "./data/policies";

function App() {
  const [policies, setPolicies] = useState<Policies>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPolicy, setSelectedPolicy] = useState<Policy | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [simplifiedPolicyText, setSimplifiedPolicyText] = useState(""); // LLMによる要約テキスト
  const [isSummarizing, setIsSummarizing] = useState(false); // LLM呼び出し中のローディング状態
  const [showSimplifiedSummary, setShowSimplifiedSummary] = useState(false); // 要約内容の開閉状態
  const [sortOrder, setSortOrder] = useState<
    "newest" | "popularity_desc" | "popularity_asc"
  >("newest"); // ソート順序のステート
  const [showFabMenu, setShowFabMenu] = useState(false); // FABメニューの開閉状態
  const [activeTab, setActiveTab] = useState<"policies" | "finance">(
    "policies",
  ); // 'policies' or 'finance'

  // ダミーデータをローカルステートに読み込む関数
  const loadDummyData = useCallback(() => {
    // policiesが空の場合のみダミーデータを読み込む
    if (policies.length === 0) {
      // 初期ソート順でソート
      const sortedDummyPolicies = [...DUMMY_POLICIES].sort(
        (a, b) => (b.year || 0) - (a.year || 0),
      );
      setPolicies(sortedDummyPolicies);
      console.log("Dummy data loaded successfully!");
    }
  }, [policies.length]);

  // アプリ起動時にダミーデータを自動で読み込む
  useEffect(() => {
    loadDummyData();
  }, [loadDummyData]); // 初回レンダリング時のみ実行

  // 政策の追加（ローカルステートに直接追加）
  const addPolicy = (newPolicy: NewPolicy) => {
    const policyWithId = {
      ...newPolicy,
      id: String(Date.now()), // ユニークなIDを生成
      upvotes: 0,
      downvotes: 0,
      problems: newPolicy.problems
        .map((s: string) => s.trim())
        .filter((s: string) => s), // 問題点も配列に変換
      comments: [], // 新しい政策にはコメント配列を初期化
    };
    setPolicies((prevPolicies) => {
      const updatedPolicies = [...prevPolicies, policyWithId];
      // 新しい政策が追加されたら、現在のソート順で再ソート
      return sortPolicies(updatedPolicies, sortOrder);
    });
    console.log("Policy added successfully!");
  };

  // 投票ハンドラー
  const handleVote = (policyId: string, type: "up" | "down") => {
    setPolicies((prevPolicies) => {
      const updatedPolicies = prevPolicies.map((policy) => {
        if (policy.id === policyId) {
          if (type === "up") {
            return { ...policy, upvotes: (policy.upvotes || 0) + 1 };
          }
          if (type === "down") {
            return { ...policy, downvotes: (policy.downvotes || 0) + 1 };
          }
        }
        return policy;
      });
      // 投票後も現在のソート順を維持
      return sortPolicies(updatedPolicies, sortOrder);
    });
  };

  // コメント投稿ハンドラ
  const handleAddComment = (
    policyId: string,
    commentText: string,
    isAnonymous: boolean,
  ) => {
    if (!commentText.trim()) return; // 空のコメントは投稿しない

    const newComment = {
      id: String(Date.now()),
      author: isAnonymous ? "匿名市民" : "市民", // 仮の投稿者名
      text: commentText.trim(),
      timestamp: new Date().toLocaleString(),
      upvotes: 0, // 新しいコメントのupvotesを初期化
      downvotes: 0, // 新しいコメントのdownvotesを初期化
    };

    setPolicies((prevPolicies) => {
      const updatedPolicies = prevPolicies.map((policy) =>
        policy.id === policyId
          ? { ...policy, comments: [...(policy.comments || []), newComment] }
          : policy,
      );
      return updatedPolicies; // policiesの状態を更新
    });
  };

  // コメント投票ハンドラ
  const handleCommentVote = (
    policyId: string,
    commentId: string,
    type: "up" | "down",
  ) => {
    setPolicies((prevPolicies) => {
      return prevPolicies.map((policy) => {
        if (policy.id === policyId) {
          const updatedComments = (policy.comments || []).map((comment) => {
            if (comment.id === commentId) {
              if (type === "up") {
                return { ...comment, upvotes: (comment.upvotes || 0) + 1 };
              }
              if (type === "down") {
                return { ...comment, downvotes: (comment.downvotes || 0) + 1 };
              }
            }
            return comment;
          });
          return { ...policy, comments: updatedComments };
        }
        return policy;
      });
    });
  };

  // 政策のソート関数
  const sortPolicies = (policyList: Policy[], order: string) => {
    return [...policyList].sort((a, b) => {
      if (order === "newest") {
        return (b.year || 0) - (a.year || 0); // 新しい順
      }
      if (order === "popularity_desc") {
        const totalVotesA = (a.upvotes || 0) + (a.downvotes || 0);
        const popularityA =
          totalVotesA > 0 ? (a.upvotes || 0) / totalVotesA : -1;
        const totalVotesB = (b.upvotes || 0) + (b.downvotes || 0);
        const popularityB =
          totalVotesB > 0 ? (b.upvotes || 0) / totalVotesB : -1;
        return popularityB - popularityA; // 人気度が高い順
      }
      if (order === "popularity_asc") {
        const totalVotesA = (a.upvotes || 0) + (a.downvotes || 0);
        const popularityA =
          totalVotesA > 0 ? (a.upvotes || 0) / totalVotesA : 2; // 評価なしを最後に
        const totalVotesB = (b.upvotes || 0) + (b.downvotes || 0);
        const popularityB =
          totalVotesB > 0 ? (b.upvotes || 0) / totalVotesB : 2; // 評価なしを最後に
        return popularityA - popularityB; // 人気度が低い順
      }
      return 0; // デフォルト
    });
  };

  // ソート順変更ハンドラー
  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newSortOrder = e.target.value as
      | "newest"
      | "popularity_desc"
      | "popularity_asc";
    setSortOrder(newSortOrder);
    setPolicies((prevPolicies) => sortPolicies(prevPolicies, newSortOrder));
    setShowFabMenu(false); // ソート選択後、FABメニューを閉じる
  };

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

  // 検索フィルタリング
  const filteredPolicies = policies.filter((policy) => {
    const lowerCaseSearchTerm = searchTerm.toLowerCase();
    return (
      policy.title?.toLowerCase().includes(lowerCaseSearchTerm) ||
      policy.purpose?.toLowerCase().includes(lowerCaseSearchTerm) ||
      policy.overview?.toLowerCase().includes(lowerCaseSearchTerm) ||
      policy.detailedPlan?.toLowerCase().includes(lowerCaseSearchTerm) ||
      policy.problems?.some((problem) =>
        problem.toLowerCase().includes(lowerCaseSearchTerm),
      ) || // 問題点も検索対象に追加
      policy.keywords?.some((keyword) =>
        keyword.toLowerCase().includes(lowerCaseSearchTerm),
      ) ||
      policy.relatedEvents?.some((event) =>
        event.toLowerCase().includes(lowerCaseSearchTerm),
      )
    );
  });

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

  // ステータスに応じたスタイルを返すヘルパー関数
  const getStatusClasses = (status: string) => {
    switch (status) {
      case "完了":
        return "bg-green-100 text-green-800";
      case "進行中":
        return "bg-blue-100 text-blue-800";
      case "中止":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-800 flex flex-col">
      <Header
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {/* メインコンテンツ */}
      {/* ヘッダーの高さ分、上部にパディングを追加 */}
      <main className="container mx-auto p-4 flex-grow pt-40 sm:pt-36">
        {" "}
        {/* ヘッダーの高さに合わせて調整 */}
        {activeTab === "policies" && (
          <>
            {filteredPolicies.length === 0 && searchTerm !== "" ? (
              <p className="text-center text-gray-600 text-lg mt-8">
                「{searchTerm}」に一致する政策は見つかりませんでした。
              </p>
            ) : filteredPolicies.length === 0 && searchTerm === "" ? (
              <p className="text-center text-gray-600 text-lg mt-8">
                現在、登録されている政策はありません。ダミーデータが自動的に読み込まれます。
              </p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
                {filteredPolicies.map((policy) => {
                  // 人気度を計算
                  const totalVotes =
                    (policy.upvotes || 0) + (policy.downvotes || 0);
                  const popularity =
                    totalVotes > 0
                      ? ((policy.upvotes || 0) / totalVotes) * 100
                      : null;

                  return (
                    <div
                      key={policy.id}
                      onClick={() => {
                        console.log("Policy selected:", policy.title);
                        setSelectedPolicy(policy);
                      }}
                      className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 cursor-pointer border border-gray-200 flex flex-col justify-between"
                    >
                      <div>
                        <h3 className="text-xl font-semibold text-blue-700 mb-2">
                          {policy.title}
                        </h3>
                        <p className="text-sm text-gray-600 mb-3">
                          年度: {policy.year}
                        </p>
                        <p className="text-gray-700 text-sm line-clamp-3">
                          {policy.overview}
                        </p>
                        <div className="mt-3 flex flex-wrap gap-2">
                          {policy.keywords?.map((keyword) => (
                            <span
                              key={keyword}
                              className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full"
                            >
                              {keyword}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-100">
                        <div className="flex space-x-2">
                          <Button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleVote(policy.id, "up");
                            }}
                            variant="soft"
                            color="green"
                            size="1"
                            radius="full"
                          >
                            👍 {policy.upvotes}
                          </Button>
                          <Button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleVote(policy.id, "down");
                            }}
                            variant="soft"
                            color="red"
                            size="1"
                            radius="full"
                          >
                            👎 {policy.downvotes}
                          </Button>
                        </div>
                        {/* 人気度を表示 */}
                        {popularity !== null && (
                          <span
                            className={`text-sm font-semibold ${popularity >= 70 ? "text-green-600" : popularity >= 40 ? "text-yellow-600" : "text-red-600"}`}
                          >
                            人気度: {popularity.toFixed(0)}%
                          </span>
                        )}
                        {popularity === null && (
                          <span className="text-sm font-semibold text-gray-500">
                            評価なし
                          </span>
                        )}
                        {/* ステータス表示 */}
                        {policy.status && (
                          <span
                            className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${getStatusClasses(policy.status)}`}
                          >
                            {policy.status}
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </>
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
      {activeTab === "policies" && ( // 政策一覧タブでのみFABを表示
        <div className="fixed bottom-8 right-8 z-20">
          <div className="relative">
            {" "}
            {/* このdivがFABとメニューの親となり、相対的な位置決めを可能にする */}
            {/* FABボタン */}
            <Button
              onClick={() => setShowFabMenu(!showFabMenu)}
              variant="solid"
              color="blue"
              size="4"
              radius="full"
              className="w-14 h-14 shadow-xl text-3xl font-bold transition duration-300 ease-in-out transform hover:scale-105"
            >
              {showFabMenu ? "−" : "+"}
            </Button>
            {/* メニュー項目 (FABボタンに対して絶対位置で配置) */}
            {showFabMenu && (
              <div className="absolute bottom-full right-0 mb-3 flex flex-col items-end space-y-3">
                <Button
                  onClick={() => {
                    setShowAddForm(true);
                    setShowFabMenu(false);
                  }}
                  variant="solid"
                  color="green"
                  size="2"
                  radius="full"
                  className="shadow-lg text-sm whitespace-nowrap"
                >
                  政策を追加
                </Button>
                <div className="bg-white rounded-full shadow-lg p-2">
                  <select
                    value={sortOrder}
                    onChange={handleSortChange}
                    className="p-2 rounded-full border border-gray-300 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm"
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
      )}

      {/* 政策追加モーダル */}
      <PolicyAddModal
        isOpen={showAddForm}
        onClose={() => setShowAddForm(false)}
        onAddPolicy={(policy) => {
          addPolicy(policy);
          setShowFabMenu(false);
        }}
      />
    </div>
  );
}

export default App;
