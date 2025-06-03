import { Badge, Box, Button, Card, Flex, Text } from "@radix-ui/themes";
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
}) => {
  // 人気度を計算
  const totalVotes = (policy.upvotes || 0) + (policy.downvotes || 0);
  const popularity =
    totalVotes > 0 ? ((policy.upvotes || 0) / totalVotes) * 100 : null;

  return (
    <Card
      size="3"
      style={{
        cursor: "pointer",
        transition: "all 0.3s ease",
        height: "100%",
        display: "flex",
        flexDirection: "column",
      }}
      onClick={() => {
        onPolicySelect(policy);
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLElement).style.boxShadow =
          "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.boxShadow = "";
      }}
    >
      <Box style={{ flexGrow: 1 }}>
        <Text
          size="5"
          weight="bold"
          style={{
            color: "var(--blue-11)",
            marginBottom: "0.5rem",
            display: "block",
          }}
        >
          {policy.title}
        </Text>
        <Text
          size="2"
          color="gray"
          style={{
            marginBottom: "0.75rem",
            display: "block",
          }}
        >
          年度: {policy.year}
        </Text>
        <Text
          size="2"
          style={{
            display: "-webkit-box",
            WebkitLineClamp: 3,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            textOverflow: "ellipsis",
            color: "var(--gray-11)",
            marginBottom: "0.75rem",
          }}
        >
          {policy.overview}
        </Text>
        <Flex gap="2" wrap="wrap">
          {policy.keywords?.map((keyword) => (
            <Badge key={keyword} color="blue" variant="soft" size="1">
              {keyword}
            </Badge>
          ))}
        </Flex>
      </Box>
      <Flex
        align="center"
        justify="between"
        style={{
          marginTop: "1rem",
          paddingTop: "1rem",
          borderTop: "1px solid var(--gray-5)",
        }}
      >
        <Flex gap="2">
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
        </Flex>
        {/* 人気度を表示 */}
        {popularity !== null && (
          <Text
            size="2"
            weight="bold"
            style={{
              color:
                popularity >= 70
                  ? "var(--green-11)"
                  : popularity >= 40
                    ? "var(--yellow-11)"
                    : "var(--red-11)",
            }}
          >
            人気度: {popularity.toFixed(0)}%
          </Text>
        )}
        {popularity === null && (
          <Text size="2" weight="bold" color="gray">
            評価なし
          </Text>
        )}
        {/* ステータス表示 */}
        {policy.status && (
          <Badge
            size="1"
            color={
              policy.status === "進行中"
                ? "blue"
                : policy.status === "完了"
                  ? "green"
                  : policy.status === "中止"
                    ? "red"
                    : "gray"
            }
            variant="soft"
          >
            {policy.status}
          </Badge>
        )}
      </Flex>
    </Card>
  );
};
