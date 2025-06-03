import { Button } from "@radix-ui/themes";
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
    <div className="rounded-lg border border-gray-100 bg-gray-50 p-3">
      <p className="font-semibold text-gray-700 text-sm">{comment.author}</p>
      <p className="mb-1 text-gray-500 text-xs">{comment.timestamp}</p>
      <p className="text-gray-800">{comment.text}</p>
      <div className="mt-2 flex space-x-2">
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
      </div>
    </div>
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
    <form
      onSubmit={handleSubmit}
      className="rounded-lg border border-gray-200 bg-white p-4 shadow-md"
    >
      <textarea
        className="mb-3 w-full resize-y rounded-md border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
        rows={3}
        placeholder="この政策に対するあなたの意見を投稿してください..."
        value={commentText}
        onChange={(e) => setCommentText(e.target.value)}
        required
      />
      <div className="flex items-center justify-between">
        <label className="flex items-center text-gray-700 text-sm">
          <input
            type="checkbox"
            className="form-checkbox h-4 w-4 rounded text-blue-600"
            checked={isAnonymous}
            onChange={(e) => setIsAnonymous(e.target.checked)}
          />
          <span className="ml-2">匿名で投稿する</span>
        </label>
        <Button type="submit" variant="solid" color="blue" size="2">
          コメントを投稿
        </Button>
      </div>
    </form>
  );
}

export function PolicyCommentsSection({
  policy,
  onVoteComment,
  onAddComment,
}: PolicyCommentsSectionProps) {
  return (
    <div className="mt-8 border-gray-200 border-t pt-6">
      <h3 className="mb-4 font-bold text-gray-800 text-xl">市民の声</h3>
      <div className="mb-6 max-h-60 space-y-4 overflow-y-auto pr-2">
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
          <p className="text-gray-600 text-sm">
            まだコメントはありません。最初のコメントを投稿してみましょう！
          </p>
        )}
      </div>

      {/* コメント投稿フォーム */}
      <CommentForm policyId={policy.id} onAddComment={onAddComment} />
    </div>
  );
}
