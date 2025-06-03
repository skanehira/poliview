import { useState } from "react";
import ReactMarkdown from "react-markdown";
import { Button, Dialog } from "@radix-ui/themes";

// 型定義
interface Comment {
  id: string;
  author: string;
  text: string;
  timestamp: string;
  upvotes: number;
  downvotes: number;
}

interface Policy {
  id: string;
  title: string;
  purpose: string;
  overview: string;
  detailedPlan: string;
  problems: string[];
  benefits: string[];
  drawbacks: string[];
  year: number;
  keywords: string[];
  relatedEvents: string[];
  upvotes: number;
  downvotes: number;
  budget?: number;
  status?: string;
  comments: Comment[];
}

interface PolicyDetailModalProps {
  policy: Policy | null;
  isOpen: boolean;
  onClose: () => void;
  onVoteComment: (policyId: string, commentId: string, type: "up" | "down") => void;
  onAddComment: (policyId: string, text: string, isAnonymous: boolean) => void;
  onSummarizePolicy?: (policy: Policy) => Promise<void>;
  isSummarizing?: boolean;
  simplifiedPolicyText?: string;
  showSimplifiedSummary?: boolean;
  onToggleSimplifiedSummary?: () => void;
}

// コメントアイテムコンポーネント
interface CommentItemProps {
  comment: Comment;
  onVoteComment: (policyId: string, commentId: string, type: "up" | "down") => void;
  policyId: string;
}

const CommentItem: React.FC<CommentItemProps> = ({
  comment,
  onVoteComment,
  policyId,
}) => {
  return (
    <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
      <p className="text-sm font-semibold text-gray-700">{comment.author}</p>
      <p className="text-xs text-gray-500 mb-1">{comment.timestamp}</p>
      <p className="text-gray-800">{comment.text}</p>
      <div className="flex space-x-2 mt-2">
        <Button
          onClick={() => onVoteComment(policyId, comment.id, "up")}
          variant="ghost"
          color="green"
          size="1"
        >
          👍 {comment.upvotes || 0}
        </Button>
        <Button
          onClick={() => onVoteComment(policyId, comment.id, "down")}
          variant="ghost"
          color="red"
          size="1"
        >
          👎 {comment.downvotes || 0}
        </Button>
      </div>
    </div>
  );
};

// コメント投稿フォームコンポーネント
interface CommentFormProps {
  policyId: string;
  onAddComment: (policyId: string, commentText: string, isAnonymous: boolean) => void;
}

const CommentForm: React.FC<CommentFormProps> = ({ policyId, onAddComment }) => {
  const [commentText, setCommentText] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddComment(policyId, commentText, isAnonymous);
    setCommentText("");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-4 rounded-lg shadow-md border border-gray-200"
    >
      <textarea
        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 mb-3 resize-y"
        rows={3}
        placeholder="この政策に対するあなたの意見を投稿してください..."
        value={commentText}
        onChange={(e) => setCommentText(e.target.value)}
        required
      />
      <div className="flex items-center justify-between">
        <label className="flex items-center text-gray-700 text-sm">
          <input
            type="checkbox"
            className="form-checkbox h-4 w-4 text-blue-600 rounded"
            checked={isAnonymous}
            onChange={(e) => setIsAnonymous(e.target.checked)}
          />
          <span className="ml-2">匿名で投稿する</span>
        </label>
        <Button type="submit" variant="solid" color="blue" size="2">
          コメントを投稿
        </Button>
      </div>
    </form>
  );
};

// メインのPolicyDetailModalコンポーネント
export const PolicyDetailModal: React.FC<PolicyDetailModalProps> = ({
  policy,
  isOpen,
  onClose,
  onVoteComment,
  onAddComment,
  onSummarizePolicy,
  isSummarizing = false,
  simplifiedPolicyText = "",
  showSimplifiedSummary = false,
  onToggleSimplifiedSummary,
}) => {
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

  if (!policy) return null;

  return (
    <Dialog.Root open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <Dialog.Content maxWidth="48rem" className="max-h-[90vh] overflow-y-auto relative">
        <div className="flex justify-between items-start mb-4">
          <Dialog.Title className="text-2xl font-bold text-blue-700">
            {policy.title}
          </Dialog.Title>
          <Dialog.Close>
            <Button variant="ghost" color="gray" size="1">
              &times;
            </Button>
          </Dialog.Close>
        </div>
        
        <p className="text-md text-gray-600 mb-4">年度: {policy.year}</p>

        {/* ステータス表示 */}
        {policy.status && (
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">ステータス</h3>
            <span
              className={`text-md font-bold px-3 py-1 rounded-full ${getStatusClasses(policy.status)}`}
            >
              {policy.status}
            </span>
          </div>
        )}

        {/* 予算表示 */}
        {policy.budget !== undefined && policy.budget !== null && (
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">予算</h3>
            <p className="text-gray-700 text-lg font-bold">
              {policy.budget.toLocaleString()} 円
            </p>
          </div>
        )}

        {/* 人気度表示 */}
        {(() => {
          const totalVotes = (policy.upvotes || 0) + (policy.downvotes || 0);
          const popularity = totalVotes > 0 ? ((policy.upvotes || 0) / totalVotes) * 100 : 0;
          return (
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">人気度</h3>
              {popularity !== null ? (
                <span
                  className={`text-md font-bold ${
                    popularity >= 70
                      ? "text-green-600"
                      : popularity >= 40
                      ? "text-yellow-600"
                      : "text-red-600"
                  }`}
                >
                  {popularity.toFixed(0)}%
                </span>
              ) : (
                <span className="text-md font-semibold text-gray-500">評価なし</span>
              )}
              <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                <div
                  className={`h-2.5 rounded-full ${
                    popularity >= 70
                      ? "bg-green-500"
                      : popularity >= 40
                      ? "bg-yellow-500"
                      : "bg-red-500"
                  }`}
                  style={{ width: `${popularity || 0}%` }}
                />
              </div>
            </div>
          );
        })()}

        <div className="mb-4">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">目的</h3>
          <p className="text-gray-700">{policy.purpose}</p>
        </div>

        {/* 解決したい問題点 */}
        {policy.problems && policy.problems.length > 0 && (
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">解決したい問題点</h3>
            <ul className="list-disc list-inside text-gray-700">
              {policy.problems.map((problem) => (
                <li key={problem}>{problem}</li>
              ))}
            </ul>
          </div>
        )}

        <div className="mb-4">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">概要</h3>
          <p className="text-gray-700">{policy.overview}</p>
        </div>

        {/* 具体的計画の内容 */}
        {policy.detailedPlan && (
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">具体的計画の内容</h3>
            <p className="text-gray-700">{policy.detailedPlan}</p>
          </div>
        )}

        {/* LLMによる要約ボタンと表示エリア */}
        {onSummarizePolicy && (
          <div className="mb-4">
            <div className="flex items-center space-x-2 mb-2">
              <Button
                onClick={() => onSummarizePolicy(policy)}
                variant="solid"
                color="purple"
                size="2"
                disabled={isSummarizing}
              >
                {isSummarizing ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    />
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                    要約中...
                  </>
                ) : (
                  <>✨政策をさらに分かりやすく</>
                )}
              </Button>
              {simplifiedPolicyText && onToggleSimplifiedSummary && (
                <Button
                  onClick={onToggleSimplifiedSummary}
                  variant="soft"
                  color="gray"
                  size="2"
                >
                  {showSimplifiedSummary ? "要約を閉じる" : "要約を開く"}
                </Button>
              )}
            </div>
            {showSimplifiedSummary && simplifiedPolicyText && (
              <div className="mt-2 p-4 bg-purple-50 rounded-lg border border-purple-200">
                <h4 className="text-md font-semibold text-purple-800 mb-2">高校生向け要約:</h4>
                <ReactMarkdown>{simplifiedPolicyText}</ReactMarkdown>
              </div>
            )}
          </div>
        )}

        {/* メリット */}
        {policy.benefits && policy.benefits.length > 0 && (
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-green-700 mb-2">メリット</h3>
            <ul className="list-disc list-inside text-gray-700">
              {policy.benefits.map((benefit) => (
                <li key={benefit}>{benefit}</li>
              ))}
            </ul>
          </div>
        )}

        {/* デメリット */}
        {policy.drawbacks && policy.drawbacks.length > 0 && (
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-red-700 mb-2">デメリット</h3>
            <ul className="list-disc list-inside text-gray-700">
              {policy.drawbacks.map((drawback) => (
                <li key={drawback}>{drawback}</li>
              ))}
            </ul>
          </div>
        )}

        {/* キーワード */}
        {policy.keywords && policy.keywords.length > 0 && (
          <div className="mt-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">関連キーワード</h3>
            <div className="flex flex-wrap gap-2">
              {policy.keywords.map((keyword) => (
                <span
                  key={keyword}
                  className="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full"
                >
                  {keyword}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* 関連イベント */}
        {policy.relatedEvents && policy.relatedEvents.length > 0 && (
          <div className="mt-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">政策に関するイベント</h3>
            <div className="relative border-l-2 border-blue-300 pl-6">
              {policy.relatedEvents.map((event) => (
                <div key={event} className="mb-4 last:mb-0">
                  <div className="absolute -left-2 top-0 mt-1 w-4 h-4 bg-blue-500 rounded-full border-2 border-white" />
                  <p className="text-gray-700">{event}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 市民の声セクション */}
        <div className="mt-8 border-t pt-6 border-gray-200">
          <h3 className="text-xl font-bold text-gray-800 mb-4">市民の声</h3>
          <div className="space-y-4 mb-6 max-h-60 overflow-y-auto pr-2">
            {policy.comments && policy.comments.length > 0 ? (
              policy.comments
                .slice()
                .reverse()
                .map((comment) => (
                  <CommentItem
                    key={comment.id}
                    comment={comment}
                    onVoteComment={onVoteComment}
                    policyId={policy.id}
                  />
                ))
            ) : (
              <p className="text-gray-600 text-sm">
                まだコメントはありません。最初のコメントを投稿してみましょう！
              </p>
            )}
          </div>

          {/* コメント投稿フォーム */}
          <CommentForm policyId={policy.id} onAddComment={onAddComment} />
        </div>
      </Dialog.Content>
    </Dialog.Root>
  );
};