import { useCallback, useEffect, useState } from "react";
import { DUMMY_POLICIES } from "../data/policies";
import type { NewPolicy, Policies, Policy } from "../types/policy";

export type SortOrder = "newest" | "popularity_desc" | "popularity_asc";

interface UsePoliciesReturn {
  // State
  policies: Policies;
  sortOrder: SortOrder;

  // Actions
  addPolicy: (newPolicy: NewPolicy) => void;
  handleVote: (policyId: string, type: "up" | "down") => void;
  handleAddComment: (
    policyId: string,
    commentText: string,
    isAnonymous: boolean,
  ) => void;
  handleCommentVote: (
    policyId: string,
    commentId: string,
    type: "up" | "down",
  ) => void;
  handleSortChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  setSortOrder: (order: SortOrder) => void;

  // Utilities
  getStatusClasses: (status: string) => string;
}

export function usePolicies(): UsePoliciesReturn {
  const [policies, setPolicies] = useState<Policies>([]);
  const [sortOrder, setSortOrder] = useState<SortOrder>("newest");

  // 政策のソート関数
  const sortPolicies = useCallback((policyList: Policy[], order: SortOrder) => {
    return [...policyList].sort((a, b) => {
      if (order === "newest") {
        return (b.year || 0) - (a.year || 0); // 新しい順
      }
      if (order === "popularity_desc") {
        const totalVotesA = (a.upvotes || 0) + (a.downvotes || 0);
        const popularityA =
          totalVotesA > 0 ? (a.upvotes || 0) / totalVotesA : -1;
        const totalVotesB = (b.upvotes || 0) + (b.downvotes || 0);
        const popularityB =
          totalVotesB > 0 ? (b.upvotes || 0) / totalVotesB : -1;
        return popularityB - popularityA; // 人気度が高い順
      }
      if (order === "popularity_asc") {
        const totalVotesA = (a.upvotes || 0) + (a.downvotes || 0);
        const popularityA =
          totalVotesA > 0 ? (a.upvotes || 0) / totalVotesA : 2; // 評価なしを最後に
        const totalVotesB = (b.upvotes || 0) + (b.downvotes || 0);
        const popularityB =
          totalVotesB > 0 ? (b.upvotes || 0) / totalVotesB : 2; // 評価なしを最後に
        return popularityA - popularityB; // 人気度が低い順
      }
      return 0; // デフォルト
    });
  }, []);

  // ダミーデータをローカルステートに読み込む関数
  const loadDummyData = useCallback(() => {
    // policiesが空の場合のみダミーデータを読み込む
    if (policies.length === 0) {
      // 初期ソート順でソート
      const sortedDummyPolicies = sortPolicies(DUMMY_POLICIES, "newest");
      setPolicies(sortedDummyPolicies);
    }
  }, [policies.length, sortPolicies]);

  // アプリ起動時にダミーデータを自動で読み込む
  useEffect(() => {
    loadDummyData();
  }, [loadDummyData]);

  // 政策の追加（ローカルステートに直接追加）
  const addPolicy = useCallback(
    (newPolicy: NewPolicy) => {
      const policyWithId = {
        ...newPolicy,
        id: String(Date.now()), // ユニークなIDを生成
        upvotes: 0,
        downvotes: 0,
        problems: newPolicy.problems
          .map((s: string) => s.trim())
          .filter((s: string) => s), // 問題点も配列に変換
        comments: [], // 新しい政策にはコメント配列を初期化
      };
      setPolicies((prevPolicies) => {
        const updatedPolicies = [...prevPolicies, policyWithId];
        // 新しい政策が追加されたら、現在のソート順で再ソート
        return sortPolicies(updatedPolicies, sortOrder);
      });
    },
    [sortOrder, sortPolicies],
  );

  // 投票ハンドラー
  const handleVote = useCallback(
    (policyId: string, type: "up" | "down") => {
      setPolicies((prevPolicies) => {
        const updatedPolicies = prevPolicies.map((policy) => {
          if (policy.id === policyId) {
            if (type === "up") {
              return { ...policy, upvotes: (policy.upvotes || 0) + 1 };
            }
            if (type === "down") {
              return { ...policy, downvotes: (policy.downvotes || 0) + 1 };
            }
          }
          return policy;
        });
        // 投票後も現在のソート順を維持
        return sortPolicies(updatedPolicies, sortOrder);
      });
    },
    [sortOrder, sortPolicies],
  );

  // コメント投稿ハンドラ
  const handleAddComment = useCallback(
    (policyId: string, commentText: string, isAnonymous: boolean) => {
      if (!commentText.trim()) return; // 空のコメントは投稿しない

      const newComment = {
        id: String(Date.now()),
        author: isAnonymous ? "匿名市民" : "市民", // 仮の投稿者名
        text: commentText.trim(),
        timestamp: new Date().toLocaleString(),
        upvotes: 0, // 新しいコメントのupvotesを初期化
        downvotes: 0, // 新しいコメントのdownvotesを初期化
      };

      setPolicies((prevPolicies) => {
        const updatedPolicies = prevPolicies.map((policy) =>
          policy.id === policyId
            ? { ...policy, comments: [...(policy.comments || []), newComment] }
            : policy,
        );
        return updatedPolicies; // policiesの状態を更新
      });
    },
    [],
  );

  // コメント投票ハンドラ
  const handleCommentVote = useCallback(
    (policyId: string, commentId: string, type: "up" | "down") => {
      setPolicies((prevPolicies) => {
        return prevPolicies.map((policy) => {
          if (policy.id === policyId) {
            const updatedComments = (policy.comments || []).map((comment) => {
              if (comment.id === commentId) {
                if (type === "up") {
                  return { ...comment, upvotes: (comment.upvotes || 0) + 1 };
                }
                if (type === "down") {
                  return {
                    ...comment,
                    downvotes: (comment.downvotes || 0) + 1,
                  };
                }
              }
              return comment;
            });
            return { ...policy, comments: updatedComments };
          }
          return policy;
        });
      });
    },
    [],
  );

  // ソート順変更ハンドラー
  const handleSortChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      const newSortOrder = e.target.value as SortOrder;
      setSortOrder(newSortOrder);
      setPolicies((prevPolicies) => sortPolicies(prevPolicies, newSortOrder));
    },
    [sortPolicies],
  );

  // ステータスに応じたスタイルを返すヘルパー関数
  const getStatusClasses = useCallback((status: string) => {
    switch (status) {
      case "完了":
        return "bg-green-100 text-green-800";
      case "進行中":
        return "bg-blue-100 text-blue-800";
      case "中止":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  }, []);

  return {
    // State
    policies,
    sortOrder,

    // Actions
    addPolicy,
    handleVote,
    handleAddComment,
    handleCommentVote,
    handleSortChange,
    setSortOrder,

    // Utilities
    getStatusClasses,
  };
}
