import { Button } from "@radix-ui/themes";
import type { Policy } from "../types/policy";

interface PolicyCardProps {
  policy: Policy;
  onPolicySelect: (policy: Policy) => void;
  onVote: (policyId: string, type: "up" | "down") => void;
  getStatusClasses: (status: string) => string;
}

export const PolicyCard: React.FC<PolicyCardProps> = ({
  policy,
  onPolicySelect,
  onVote,
  getStatusClasses,
}) => {
  // 人気度を計算
  const totalVotes = (policy.upvotes || 0) + (policy.downvotes || 0);
  const popularity =
    totalVotes > 0 ? ((policy.upvotes || 0) / totalVotes) * 100 : null;

  return (
    <div
      key={policy.id}
      onClick={() => {
        onPolicySelect(policy);
      }}
      className="flex cursor-pointer flex-col justify-between rounded-lg border border-gray-200 bg-white p-6 shadow-lg transition-shadow duration-300 hover:shadow-xl"
    >
      <div>
        <h3 className="mb-2 font-semibold text-blue-700 text-xl">
          {policy.title}
        </h3>
        <p className="mb-3 text-gray-600 text-sm">年度: {policy.year}</p>
        <p className="line-clamp-3 text-gray-700 text-sm">{policy.overview}</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {policy.keywords?.map((keyword) => (
            <span
              key={keyword}
              className="rounded-full bg-blue-100 px-2.5 py-0.5 font-medium text-blue-800 text-xs"
            >
              {keyword}
            </span>
          ))}
        </div>
      </div>
      <div className="mt-4 flex items-center justify-between border-gray-100 border-t pt-4">
        <div className="flex space-x-2">
          <Button
            onClick={(e) => {
              e.stopPropagation();
              onVote(policy.id, "up");
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
              onVote(policy.id, "down");
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
            className={`font-semibold text-sm ${
              popularity >= 70
                ? "text-green-600"
                : popularity >= 40
                  ? "text-yellow-600"
                  : "text-red-600"
            }`}
          >
            人気度: {popularity.toFixed(0)}%
          </span>
        )}
        {popularity === null && (
          <span className="font-semibold text-gray-500 text-sm">評価なし</span>
        )}
        {/* ステータス表示 */}
        {policy.status && (
          <span
            className={`rounded-full px-2.5 py-0.5 font-semibold text-xs ${getStatusClasses(policy.status)}`}
          >
            {policy.status}
          </span>
        )}
      </div>
    </div>
  );
};
