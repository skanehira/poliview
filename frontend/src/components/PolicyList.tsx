import type { Policy } from "../types/policy";
import { PolicyCard } from "./PolicyCard";

interface PolicyListProps {
  policies: Policy[];
  searchTerm: string;
  onPolicySelect: (policy: Policy) => void;
  onVote: (policyId: string, type: "up" | "down") => void;
  getStatusClasses: (status: string) => string;
}

export function PolicyList({
  policies,
  searchTerm,
  onPolicySelect,
  onVote,
  getStatusClasses,
}: PolicyListProps) {
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
      ) ||
      policy.keywords?.some((keyword) =>
        keyword.toLowerCase().includes(lowerCaseSearchTerm),
      ) ||
      policy.relatedEvents?.some((event) =>
        event.toLowerCase().includes(lowerCaseSearchTerm),
      )
    );
  });

  if (filteredPolicies.length === 0 && searchTerm !== "") {
    return (
      <p className="mt-8 text-center text-gray-600 text-lg">
        「{searchTerm}」に一致する政策は見つかりませんでした。
      </p>
    );
  }

  if (filteredPolicies.length === 0 && searchTerm === "") {
    return (
      <p className="mt-8 text-center text-gray-600 text-lg">
        現在、登録されている政策はありません。ダミーデータが自動的に読み込まれます。
      </p>
    );
  }

  return (
    <div className="mt-4 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {filteredPolicies.map((policy) => (
        <PolicyCard
          key={policy.id}
          policy={policy}
          onPolicySelect={onPolicySelect}
          onVote={onVote}
          getStatusClasses={getStatusClasses}
        />
      ))}
    </div>
  );
}
