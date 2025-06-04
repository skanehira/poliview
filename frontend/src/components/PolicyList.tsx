import { Grid, Text } from "@radix-ui/themes";
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
      <Text
        size="4"
        color="gray"
        style={{
          display: "block",
          textAlign: "center",
          marginTop: "2rem",
        }}
      >
        「{searchTerm}」に一致する政策は見つかりませんでした。
      </Text>
    );
  }

  if (filteredPolicies.length === 0 && searchTerm === "") {
    return (
      <Text
        size="4"
        color="gray"
        style={{
          display: "block",
          textAlign: "center",
          marginTop: "2rem",
        }}
      >
        現在、登録されている政策はありません。ダミーデータが自動的に読み込まれます。
      </Text>
    );
  }

  return (
    <Grid columns={{ initial: "1", sm: "2", lg: "3" }} gap="6">
      {filteredPolicies.map((policy) => (
        <PolicyCard
          key={policy.id}
          policy={policy}
          onPolicySelect={onPolicySelect}
          onVote={onVote}
          getStatusClasses={getStatusClasses}
        />
      ))}
    </Grid>
  );
}
