export interface Comment {
  id: string;
  author: string;
  text: string;
  timestamp: string;
  upvotes: number;
  downvotes: number;
}

export interface Policy {
  id: string;
  title: string;
  purpose: string;
  overview: string;
  detailedPlan: string;
  problems: string[];
  benefits: string[];
  drawbacks: string[];
  year: number;
  keywords: string[];
  relatedEvents: string[];
  upvotes: number;
  downvotes: number;
  budget?: number;
  status?: string;
  comments: Comment[];
}

export type NewPolicy = Omit<
  Policy,
  "id" | "upvotes" | "downvotes" | "comments"
>;

export type Policies = Policy[];
