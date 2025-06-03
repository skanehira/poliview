import { Button, Dialog } from "@radix-ui/themes";
import { PolicySummarySection } from "./PolicySummarySection";
import { PolicyCommentsSection } from "./PolicyCommentsSection";
import { PolicyMetadataSection } from "./PolicyMetadataSection";
import type { Policy } from "../types/policy";

interface PolicyDetailModalProps {
  policy: Policy | null;
  isOpen: boolean;
  onClose: () => void;
  onVoteComment: (
    policyId: string,
    commentId: string,
    type: "up" | "down",
  ) => void;
  onAddComment: (policyId: string, text: string, isAnonymous: boolean) => void;
  onSummarizePolicy?: (policy: Policy) => Promise<void>;
  isSummarizing?: boolean;
  simplifiedPolicyText?: string;
  showSimplifiedSummary?: boolean;
  onToggleSimplifiedSummary?: () => void;
}

// メインのPolicyDetailModalコンポーネント
export function PolicyDetailModal({
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
}: PolicyDetailModalProps) {
  if (!policy) return null;

  return (
    <Dialog.Root open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <Dialog.Content
        maxWidth="48rem"
        className="max-h-[90vh] overflow-y-auto relative"
      >
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

        {/* メタデータセクション */}
        <PolicyMetadataSection policy={policy} />

        {/* 要約セクション */}
        <PolicySummarySection
          policy={policy}
          onSummarizePolicy={onSummarizePolicy}
          isSummarizing={isSummarizing}
          simplifiedPolicyText={simplifiedPolicyText}
          showSimplifiedSummary={showSimplifiedSummary}
          onToggleSimplifiedSummary={onToggleSimplifiedSummary}
        />

        {/* コメントセクション */}
        <PolicyCommentsSection
          policy={policy}
          onVoteComment={onVoteComment}
          onAddComment={onAddComment}
        />
      </Dialog.Content>
    </Dialog.Root>
  );
}
