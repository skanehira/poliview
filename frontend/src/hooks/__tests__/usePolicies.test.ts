import { act, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { NewPolicy } from "../../types/policy";
import { usePolicies } from "../usePolicies";

// Mock DUMMY_POLICIES
vi.mock("../../data/policies", () => ({
  DUMMY_POLICIES: [
    {
      id: "1",
      title: "Test Policy 1",
      year: 2024,
      overview: "Test overview 1",
      purpose: "Test purpose 1",
      detailedPlan: "Test plan 1",
      problems: ["Problem 1"],
      benefits: ["Benefit 1"],
      drawbacks: ["Drawback 1"],
      keywords: ["Keyword 1"],
      relatedEvents: ["Event 1"],
      upvotes: 10,
      downvotes: 2,
      status: "進行中",
      comments: [],
    },
    {
      id: "2",
      title: "Test Policy 2",
      year: 2023,
      overview: "Test overview 2",
      purpose: "Test purpose 2",
      detailedPlan: "Test plan 2",
      problems: ["Problem 2"],
      benefits: ["Benefit 2"],
      drawbacks: ["Drawback 2"],
      keywords: ["Keyword 2"],
      relatedEvents: ["Event 2"],
      upvotes: 5,
      downvotes: 5,
      status: "完了",
      comments: [],
    },
  ],
}));

describe("usePolicies", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Mock Date.now() for consistent IDs
    vi.spyOn(Date, "now").mockReturnValue(123456789);
    // Mock Date.prototype.toLocaleString() for consistent timestamps
    vi.spyOn(Date.prototype, "toLocaleString").mockReturnValue(
      "2024/1/1 12:00:00",
    );
  });

  it("initializes with dummy data and default sort order", async () => {
    const { result } = renderHook(() => usePolicies());

    // Wait for useEffect to load dummy data
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    expect(result.current.policies).toHaveLength(2);
    expect(result.current.sortOrder).toBe("newest");

    // Check if policies are sorted by year (newest first)
    expect(result.current.policies[0].year).toBe(2024);
    expect(result.current.policies[1].year).toBe(2023);
  });

  it("adds a new policy correctly", async () => {
    const { result } = renderHook(() => usePolicies());

    // Wait for initial load
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    const newPolicy: NewPolicy = {
      title: "New Test Policy",
      year: 2025,
      overview: "New overview",
      purpose: "New purpose",
      detailedPlan: "New plan",
      problems: ["New problem", " ", "Another problem"],
      benefits: ["New benefit"],
      drawbacks: ["New drawback"],
      keywords: ["New keyword"],
      relatedEvents: ["New event"],
      status: "進行中",
    };

    act(() => {
      result.current.addPolicy(newPolicy);
    });

    expect(result.current.policies).toHaveLength(3);

    const addedPolicy = result.current.policies[0]; // Should be first due to newest year
    expect(addedPolicy.title).toBe("New Test Policy");
    expect(addedPolicy.year).toBe(2025);
    expect(addedPolicy.id).toBe("123456789");
    expect(addedPolicy.upvotes).toBe(0);
    expect(addedPolicy.downvotes).toBe(0);
    expect(addedPolicy.comments).toEqual([]);
    // Check that empty problems are filtered out
    expect(addedPolicy.problems).toEqual(["New problem", "Another problem"]);
  });

  it("handles voting correctly", async () => {
    const { result } = renderHook(() => usePolicies());

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    const initialUpvotes = result.current.policies[0].upvotes;

    act(() => {
      result.current.handleVote("1", "up");
    });

    expect(result.current.policies[0].upvotes).toBe((initialUpvotes || 0) + 1);

    act(() => {
      result.current.handleVote("1", "down");
    });

    expect(result.current.policies[0].downvotes).toBe(3); // Was 2, now 3
  });

  it("adds comments correctly", async () => {
    const { result } = renderHook(() => usePolicies());

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    act(() => {
      result.current.handleAddComment("1", "Test comment", false);
    });

    const policy = result.current.policies.find((p) => p.id === "1");
    expect(policy?.comments).toHaveLength(1);
    expect(policy?.comments?.[0].text).toBe("Test comment");
    expect(policy?.comments?.[0].author).toBe("市民");
    expect(policy?.comments?.[0].id).toBe("123456789");
    expect(policy?.comments?.[0].timestamp).toBe("2024/1/1 12:00:00");
  });

  it("adds anonymous comments correctly", async () => {
    const { result } = renderHook(() => usePolicies());

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    act(() => {
      result.current.handleAddComment("1", "Anonymous comment", true);
    });

    const policy = result.current.policies.find((p) => p.id === "1");
    expect(policy?.comments?.[0].author).toBe("匿名市民");
  });

  it("ignores empty comments", async () => {
    const { result } = renderHook(() => usePolicies());

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    const initialCommentsLength =
      result.current.policies[0].comments?.length || 0;

    act(() => {
      result.current.handleAddComment("1", "   ", false);
    });

    expect(result.current.policies[0].comments).toHaveLength(
      initialCommentsLength,
    );
  });

  it("handles comment voting correctly", async () => {
    const { result } = renderHook(() => usePolicies());

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    // First add a comment
    act(() => {
      result.current.handleAddComment("1", "Test comment", false);
    });

    const commentId = result.current.policies[0].comments?.[0].id;
    expect(commentId).toBeDefined();

    act(() => {
      result.current.handleCommentVote("1", commentId as string, "up");
    });

    let policy = result.current.policies.find((p) => p.id === "1");
    let comment = policy?.comments?.[0];
    expect(comment?.upvotes).toBe(1);

    act(() => {
      result.current.handleCommentVote("1", commentId as string, "down");
    });

    // Get updated policy and comment references
    policy = result.current.policies.find((p) => p.id === "1");
    comment = policy?.comments?.[0];
    expect(comment?.downvotes).toBe(1);
  });

  it("handles sort order changes correctly", async () => {
    const { result } = renderHook(() => usePolicies());

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    const mockEvent = {
      target: { value: "popularity_desc" },
    } as React.ChangeEvent<HTMLSelectElement>;

    act(() => {
      result.current.handleSortChange(mockEvent);
    });

    expect(result.current.sortOrder).toBe("popularity_desc");

    // Check if policies are sorted by popularity (highest first)
    // Policy 1: 10/(10+2) = 0.833, Policy 2: 5/(5+5) = 0.5
    expect(result.current.policies[0].id).toBe("1");
    expect(result.current.policies[1].id).toBe("2");
  });

  it("sorts by popularity ascending correctly", async () => {
    const { result } = renderHook(() => usePolicies());

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    const mockEvent = {
      target: { value: "popularity_asc" },
    } as React.ChangeEvent<HTMLSelectElement>;

    act(() => {
      result.current.handleSortChange(mockEvent);
    });

    expect(result.current.sortOrder).toBe("popularity_asc");

    // Check if policies are sorted by popularity (lowest first)
    // Policy 2: 5/(5+5) = 0.5, Policy 1: 10/(10+2) = 0.833
    expect(result.current.policies[0].id).toBe("2");
    expect(result.current.policies[1].id).toBe("1");
  });

  it("returns correct status classes", () => {
    const { result } = renderHook(() => usePolicies());

    expect(result.current.getStatusClasses("完了")).toBe(
      "bg-green-100 text-green-800",
    );
    expect(result.current.getStatusClasses("進行中")).toBe(
      "bg-blue-100 text-blue-800",
    );
    expect(result.current.getStatusClasses("中止")).toBe(
      "bg-red-100 text-red-800",
    );
    expect(result.current.getStatusClasses("その他")).toBe(
      "bg-gray-100 text-gray-800",
    );
  });

  it("maintains sort order after voting", async () => {
    const { result } = renderHook(() => usePolicies());

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    // Set to popularity desc
    const mockEvent = {
      target: { value: "popularity_desc" },
    } as React.ChangeEvent<HTMLSelectElement>;

    act(() => {
      result.current.handleSortChange(mockEvent);
    });

    // Vote on policy 2 to potentially change order
    act(() => {
      result.current.handleVote("2", "up");
      result.current.handleVote("2", "up");
      result.current.handleVote("2", "up");
    });

    // Policy 2 now has 8 upvotes and 5 downvotes = 8/13 = 0.615
    // Policy 1 still has 10 upvotes and 2 downvotes = 10/12 = 0.833
    // So policy 1 should still be first
    expect(result.current.policies[0].id).toBe("1");
  });

  it("loads dummy data only once", async () => {
    const { result, rerender } = renderHook(() => usePolicies());

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    const initialLength = result.current.policies.length;

    // Rerender should not reload dummy data
    rerender();

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    expect(result.current.policies.length).toBe(initialLength);
  });
});
