import { useState } from "react";
import { Button } from "@radix-ui/themes";
import type { Policy, Comment } from "../types/policy";

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
    <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
      <p className="text-sm font-semibold text-gray-700">{comment.author}</p>
      <p className="text-xs text-gray-500 mb-1">{comment.timestamp}</p>
      <p className="text-gray-800">{comment.text}</p>
      <div className="flex space-x-2 mt-2">
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
      className="bg-white p-4 rounded-lg shadow-md border border-gray-200"
    >
      <textarea
        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 mb-3 resize-y"
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
            className="form-checkbox h-4 w-4 text-blue-600 rounded"
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
    <div className="mt-8 border-t pt-6 border-gray-200">
      <h3 className="text-xl font-bold text-gray-800 mb-4">市民の声</h3>
      <div className="space-y-4 mb-6 max-h-60 overflow-y-auto pr-2">
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
