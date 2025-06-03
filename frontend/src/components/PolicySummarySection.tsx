import { Box, Button, Card, Flex, Heading, Text } from "@radix-ui/themes";
import ReactMarkdown from "react-markdown";
import type { Policy } from "../types/policy";

interface PolicySummarySectionProps {
  policy: Policy;
  onSummarizePolicy?: (policy: Policy) => Promise<void>;
  isSummarizing?: boolean;
  simplifiedPolicyText?: string;
  showSimplifiedSummary?: boolean;
  onToggleSimplifiedSummary?: () => void;
}

export function PolicySummarySection({
  policy,
  onSummarizePolicy,
  isSummarizing = false,
  simplifiedPolicyText = "",
  showSimplifiedSummary = false,
  onToggleSimplifiedSummary,
}: PolicySummarySectionProps) {
  if (!onSummarizePolicy) {
    return null;
  }

  return (
    <Box mb="4">
      <Flex align="center" gap="2" mb="2">
        <Button
          onClick={() => onSummarizePolicy(policy)}
          variant="solid"
          color="purple"
          size="2"
          disabled={isSummarizing}
        >
          {isSummarizing ? (
            <Flex align="center" gap="2">
              <Box
                style={{
                  animation: "spin 1s linear infinite",
                  width: "1.25rem",
                  height: "1.25rem",
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  style={{ width: "100%", height: "100%" }}
                >
                  <title>読み込み中</title>
                  <circle
                    style={{ opacity: 0.25 }}
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    style={{ opacity: 0.75 }}
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
              </Box>
              <Text>要約中...</Text>
            </Flex>
          ) : (
            <Text>✨政策をさらに分かりやすく</Text>
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
      </Flex>
      {showSimplifiedSummary && simplifiedPolicyText && (
        <Card
          variant="surface"
          style={{
            marginTop: "0.5rem",
            backgroundColor: "var(--purple-3)",
            borderColor: "var(--purple-6)",
            borderWidth: "1px",
            borderStyle: "solid",
          }}
        >
          <Heading size="3" mb="2" style={{ color: "var(--purple-11)" }}>
            高校生向け要約:
          </Heading>
          <Box>
            <ReactMarkdown>{simplifiedPolicyText}</ReactMarkdown>
          </Box>
        </Card>
      )}
    </Box>
  );
}
