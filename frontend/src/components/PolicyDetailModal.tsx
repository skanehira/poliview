import { Button, Dialog, Flex, Text } from "@radix-ui/themes";
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
        style={{
          position: "relative",
          maxHeight: "90vh",
          overflowY: "auto",
        }}
      >
        <Dialog.Description
          style={{
            position: "absolute",
            width: "1px",
            height: "1px",
            padding: 0,
            margin: "-1px",
            overflow: "hidden",
            clip: "rect(0, 0, 0, 0)",
            whiteSpace: "nowrap",
            borderWidth: 0,
          }}
        >
          政策の詳細情報、メタデータ、コメントを表示
        </Dialog.Description>
        <Flex justify="between" align="start" mb="4">
          <Dialog.Title>
            <Text size="6" weight="bold" style={{ color: "var(--blue-11)" }}>
              {policy.title}
            </Text>
          </Dialog.Title>
          <Dialog.Close>
            <Button variant="ghost" color="gray" size="1">
              &times;
            </Button>
          </Dialog.Close>
        </Flex>

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
