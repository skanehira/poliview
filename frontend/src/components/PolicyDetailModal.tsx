import { Button, Dialog } from "@radix-ui/themes";
import type { Policy } from "../types/policy";
import { PolicyCommentsSection } from "./PolicyCommentsSection";
import {
  PolicyBenefitsSection,
  PolicyMetadataSection,
} from "./PolicyMetadataSection";
import { PolicySummarySection } from "./PolicySummarySection";

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
        className="relative max-h-[90vh] overflow-y-auto"
      >
        <Dialog.Description className="sr-only">
          政策の詳細情報、メタデータ、コメントを表示
        </Dialog.Description>
        <div className="mb-4 flex items-start justify-between">
          <Dialog.Title className="font-bold text-2xl text-blue-700">
            {policy.title}
          </Dialog.Title>
          <Dialog.Close>
            <Button variant="ghost" color="gray" size="1">
              &times;
            </Button>
          </Dialog.Close>
        </div>

        {/* メタデータセクション（具体的計画まで） */}
        <PolicyMetadataSection policy={policy} />

        {/* 要約セクション（具体的計画の内容とメリットの間） */}
        <PolicySummarySection
          policy={policy}
          onSummarizePolicy={onSummarizePolicy}
          isSummarizing={isSummarizing}
          simplifiedPolicyText={simplifiedPolicyText}
          showSimplifiedSummary={showSimplifiedSummary}
          onToggleSimplifiedSummary={onToggleSimplifiedSummary}
        />

        {/* メリット・デメリット・その他セクション */}
        <PolicyBenefitsSection policy={policy} />

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
