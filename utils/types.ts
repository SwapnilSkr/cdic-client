export interface Topic {
  _id: string;
  name: string;
  description: string;
  tags: string[];
  createdAt: string;
  active: boolean;
  alertThreshold: number;
  sentiment: {
    positive: number;
    neutral: number;
    negative: number;
  };
  sentimentHistory: {
    date: string;
    positive: number;
    neutral: number;
    negative: number;
  }[];
}
