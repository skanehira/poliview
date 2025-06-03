import {
  Box,
  Button,
  Card,
  Checkbox,
  Flex,
  Heading,
  Text,
  TextArea,
} from "@radix-ui/themes";
import { useState } from "react";
import type { Comment, Policy } from "../types/policy";

interface PolicyCommentsSectionProps {
  policy: Policy;
  onVoteComment: (
    policyId: string,
    commentId: string,
    type: "up" | "down",
  ) => void;
  onAddComment: (policyId: string, text: string, isAnonymous: boolean) => void;
}

// コメントアイテムコンポーネント
interface CommentItemProps {
  comment: Comment;
  onVoteComment: (
    policyId: string,
    commentId: string,
    type: "up" | "down",
  ) => void;
  policyId: string;
}

function CommentItem({ comment, onVoteComment, policyId }: CommentItemProps) {
  return (
    <Card variant="surface" size="2">
      <Text size="2" weight="medium" style={{ display: "block" }}>
        {comment.author}
      </Text>
      <Text
        size="1"
        color="gray"
        style={{ display: "block", marginBottom: "0.25rem" }}
      >
        {comment.timestamp}
      </Text>
      <Text size="2" style={{ display: "block", marginBottom: "0.5rem" }}>
        {comment.text}
      </Text>
      <Flex gap="2">
        <Button
          onClick={() => onVoteComment(policyId, comment.id, "up")}
          variant="ghost"
          color="green"
          size="1"
        >
          👍 {comment.upvotes || 0}
        </Button>
        <Button
          onClick={() => onVoteComment(policyId, comment.id, "down")}
          variant="ghost"
          color="red"
          size="1"
        >
          👎 {comment.downvotes || 0}
        </Button>
      </Flex>
    </Card>
  );
}

// コメント投稿フォームコンポーネント
interface CommentFormProps {
  policyId: string;
  onAddComment: (
    policyId: string,
    commentText: string,
    isAnonymous: boolean,
  ) => void;
}

function CommentForm({ policyId, onAddComment }: CommentFormProps) {
  const [commentText, setCommentText] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddComment(policyId, commentText, isAnonymous);
    setCommentText("");
  };

  return (
    <Card asChild>
      <form onSubmit={handleSubmit}>
        <TextArea
          placeholder="この政策に対するあなたの意見を投稿してください..."
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          required
          style={{
            minHeight: "80px",
            marginBottom: "0.75rem",
          }}
        />
        <Flex align="center" justify="between">
          <Text
            as="label"
            style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
          >
            <Checkbox
              checked={isAnonymous}
              onCheckedChange={(checked) => setIsAnonymous(checked as boolean)}
            />
            <Text size="2">匿名で投稿する</Text>
          </Text>
          <Button type="submit" variant="solid" color="blue" size="2">
            コメントを投稿
          </Button>
        </Flex>
      </form>
    </Card>
  );
}

export function PolicyCommentsSection({
  policy,
  onVoteComment,
  onAddComment,
}: PolicyCommentsSectionProps) {
  return (
    <Box
      style={{
        marginTop: "2rem",
        borderTop: "1px solid var(--gray-6)",
        paddingTop: "1.5rem",
      }}
    >
      <Heading size="5" mb="4">
        市民の声
      </Heading>
      <Box
        style={{
          marginBottom: "1.5rem",
          maxHeight: "15rem",
          overflowY: "auto",
          paddingRight: "0.5rem",
        }}
      >
        <Flex direction="column" gap="3">
          {policy.comments && policy.comments.length > 0 ? (
            policy.comments
              .slice()
              .reverse()
              .map((comment) => (
                <CommentItem
                  key={comment.id}
                  comment={comment}
                  onVoteComment={onVoteComment}
                  policyId={policy.id}
                />
              ))
          ) : (
            <Text size="2" color="gray">
              まだコメントはありません。最初のコメントを投稿してみましょう！
            </Text>
          )}
        </Flex>
      </Box>

      {/* コメント投稿フォーム */}
      <CommentForm policyId={policy.id} onAddComment={onAddComment} />
    </Box>
  );
}
