import { Button } from "@radix-ui/themes";
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
    <div className="mb-4">
      <div className="mb-2 flex items-center space-x-2">
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
                className="-ml-1 mr-3 h-5 w-5 animate-spin text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <title>Loading...</title>
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
              </svg>
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
        <div className="mt-2 rounded-lg border border-purple-200 bg-purple-50 p-4">
          <h4 className="mb-2 font-semibold text-md text-purple-800">
            高校生向け要約:
          </h4>
          <ReactMarkdown>{simplifiedPolicyText}</ReactMarkdown>
        </div>
      )}
    </div>
  );
}
