import { Badge, Box, Flex, Heading, Progress, Text } from "@radix-ui/themes";
import type { Policy } from "../types/policy";

interface PolicyMetadataSectionProps {
  policy: Policy;
}

export function PolicyMetadataSection({ policy }: PolicyMetadataSectionProps) {
  // ステータスに応じたカラーを返すヘルパー関数
  const getStatusColor = (status: string) => {
    switch (status) {
      case "完了":
        return "green";
      case "進行中":
        return "blue";
      case "中止":
        return "red";
      default:
        return "gray";
    }
  };

  return (
    <>
      <Text size="3" color="gray" mb="4">
        年度: {policy.year}
      </Text>

      {/* ステータス表示 */}
      {policy.status && (
        <Box mb="4">
          <Heading size="4" mb="2">
            ステータス
          </Heading>
          <Badge
            size="2"
            color={
              getStatusColor(policy.status) as "blue" | "green" | "red" | "gray"
            }
            variant="soft"
          >
            {policy.status}
          </Badge>
        </Box>
      )}

      {/* 予算表示 */}
      {policy.budget !== undefined && policy.budget !== null && (
        <Box mb="4">
          <Heading size="4" mb="2">
            予算
          </Heading>
          <Text size="4" weight="bold">
            {policy.budget.toLocaleString()} 円
          </Text>
        </Box>
      )}

      {/* 人気度表示 */}
      {(() => {
        const totalVotes = (policy.upvotes || 0) + (policy.downvotes || 0);
        const popularity =
          totalVotes > 0 ? ((policy.upvotes || 0) / totalVotes) * 100 : 0;
        const popularityColor =
          popularity >= 70 ? "green" : popularity >= 40 ? "yellow" : "red";
        return (
          <Box mb="4">
            <Heading size="4" mb="2">
              人気度
            </Heading>
            {popularity !== null ? (
              <Text
                size="3"
                weight="bold"
                color={popularityColor as "green" | "yellow" | "red"}
              >
                {popularity.toFixed(0)}%
              </Text>
            ) : (
              <Text size="3" weight="medium" color="gray">
                評価なし
              </Text>
            )}
            <Box mt="2">
              <Progress
                value={popularity || 0}
                max={100}
                size="2"
                color={popularityColor as "green" | "yellow" | "red"}
              />
            </Box>
          </Box>
        );
      })()}

      <Box mb="4">
        <Heading size="4" mb="2">
          目的
        </Heading>
        <Text>{policy.purpose}</Text>
      </Box>

      {/* 解決したい問題点 */}
      {policy.problems && policy.problems.length > 0 && (
        <Box mb="4">
          <Heading size="4" mb="2">
            解決したい問題点
          </Heading>
          <Box style={{ paddingLeft: "1rem" }}>
            {policy.problems.map((problem) => (
              <Text
                key={problem}
                style={{ display: "block", marginBottom: "0.25rem" }}
              >
                • {problem}
              </Text>
            ))}
          </Box>
        </Box>
      )}

      <Box mb="4">
        <Heading size="4" mb="2">
          概要
        </Heading>
        <Text>{policy.overview}</Text>
      </Box>

      {/* 具体的計画の内容 */}
      {policy.detailedPlan && (
        <Box mb="4">
          <Heading size="4" mb="2">
            具体的計画の内容
          </Heading>
          <Text>{policy.detailedPlan}</Text>
        </Box>
      )}
    </>
  );
}

// メリット以降の部分を別コンポーネントとして作成
export function PolicyBenefitsSection({ policy }: PolicyMetadataSectionProps) {
  return (
    <>
      {/* メリット */}
      {policy.benefits && policy.benefits.length > 0 && (
        <Box mb="4">
          <Heading size="4" mb="2" style={{ color: "var(--green-11)" }}>
            メリット
          </Heading>
          <Box style={{ paddingLeft: "1rem" }}>
            {policy.benefits.map((benefit) => (
              <Text
                key={benefit}
                style={{ display: "block", marginBottom: "0.25rem" }}
              >
                • {benefit}
              </Text>
            ))}
          </Box>
        </Box>
      )}

      {/* デメリット */}
      {policy.drawbacks && policy.drawbacks.length > 0 && (
        <Box mb="4">
          <Heading size="4" mb="2" style={{ color: "var(--red-11)" }}>
            デメリット
          </Heading>
          <Box style={{ paddingLeft: "1rem" }}>
            {policy.drawbacks.map((drawback) => (
              <Text
                key={drawback}
                style={{ display: "block", marginBottom: "0.25rem" }}
              >
                • {drawback}
              </Text>
            ))}
          </Box>
        </Box>
      )}

      {/* キーワード */}
      {policy.keywords && policy.keywords.length > 0 && (
        <Box mt="4">
          <Heading size="4" mb="2">
            関連キーワード
          </Heading>
          <Flex gap="2" wrap="wrap">
            {policy.keywords.map((keyword) => (
              <Badge key={keyword} color="blue" variant="soft" size="2">
                {keyword}
              </Badge>
            ))}
          </Flex>
        </Box>
      )}

      {/* 関連イベント */}
      {policy.relatedEvents && policy.relatedEvents.length > 0 && (
        <Box mt="4">
          <Heading size="4" mb="2">
            政策に関するイベント
          </Heading>
          <Box
            style={{
              borderLeft: "2px solid var(--blue-9)",
              paddingLeft: "1.46rem",
            }}
          >
            {policy.relatedEvents.map((event, index) => (
              <Box
                key={event}
                style={{
                  marginBottom:
                    index === policy.relatedEvents.length - 1 ? 0 : "1rem",
                  position: "relative",
                }}
              >
                <Box
                  style={{
                    position: "absolute",
                    left: "-2rem",
                    top: "0.25rem",
                    width: "1rem",
                    height: "1rem",
                    borderRadius: "50%",
                    backgroundColor: "var(--blue-9)",
                    border: "2px solid white",
                  }}
                />
                <Text>{event}</Text>
              </Box>
            ))}
          </Box>
        </Box>
      )}
    </>
  );
}
