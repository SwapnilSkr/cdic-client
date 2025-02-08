export interface FlaggedItem {
  id: string;
  content: string;
  contentType: "text" | "image" | "video";
  flagReason: string;
  flaggedBy: string;
  timestamp: string;
  author: string;
  status: "pending" | "escalated" | "reviewed";
  aiAnalysis: {
    sentimentScore: number;
    language: string;
    contentCategory: string;
  };
  moderatorNotes: string;
}

export const mockFlaggedItems: FlaggedItem[] = [
  {
    id: "1",
    content:
      "This is a potentially misleading statement about climate change. It claims that global temperatures have not increased in the past decade, which contradicts scientific consensus.",
    contentType: "text",
    flagReason: "Misinformation",
    flaggedBy: "User123",
    timestamp: "2023-06-01T10:30:00Z",
    author: "ClimateSkeptic22",
    status: "pending",
    aiAnalysis: {
      sentimentScore: -0.2,
      language: "English",
      contentCategory: "Environmental",
    },
    moderatorNotes: "",
  },
  {
    id: "2",
    content: "/path/to/inappropriate-image.jpg",
    contentType: "image",
    flagReason: "Inappropriate Content",
    flaggedBy: "Moderator1",
    timestamp: "2023-06-02T14:45:00Z",
    author: "ImagePoster99",
    status: "escalated",
    aiAnalysis: {
      sentimentScore: 0,
      language: "N/A",
      contentCategory: "Adult Content",
    },
    moderatorNotes: "Image contains explicit content. Requires further review.",
  },
  {
    id: "3",
    content: "/path/to/controversial-video.mp4",
    contentType: "video",
    flagReason: "Hate Speech",
    flaggedBy: "ConcernedUser",
    timestamp: "2023-06-03T09:15:00Z",
    author: "VideoCreator55",
    status: "reviewed",
    aiAnalysis: {
      sentimentScore: -0.7,
      language: "English",
      contentCategory: "Social Issues",
    },
    moderatorNotes:
      "Video content has been reviewed and deemed not to violate community guidelines.",
  },
  {
    id: "4",
    content:
      "This comment contains offensive language and personal attacks against minority groups.",
    contentType: "text",
    flagReason: "Hate Speech",
    flaggedBy: "User456",
    timestamp: "2023-06-04T16:20:00Z",
    author: "AngryCommenter77",
    status: "pending",
    aiAnalysis: {
      sentimentScore: -0.8,
      language: "English",
      contentCategory: "User Interaction",
    },
    moderatorNotes: "",
  },
  {
    id: "5",
    content: "/path/to/misleading-graph.png",
    contentType: "image",
    flagReason: "Misinformation",
    flaggedBy: "FactChecker1",
    timestamp: "2023-06-05T11:00:00Z",
    author: "DataAnalyst33",
    status: "escalated",
    aiAnalysis: {
      sentimentScore: 0.1,
      language: "N/A",
      contentCategory: "Data Visualization",
    },
    moderatorNotes: "Graph appears to misrepresent data. Needs expert review.",
  },
  {
    id: "6",
    content:
      "This post contains unverified claims about a new miracle cure for a serious illness.",
    contentType: "text",
    flagReason: "Misinformation",
    flaggedBy: "HealthExpert",
    timestamp: "2023-06-06T08:30:00Z",
    author: "AlternativeMedicine101",
    status: "pending",
    aiAnalysis: {
      sentimentScore: 0.5,
      language: "English",
      contentCategory: "Health",
    },
    moderatorNotes: "",
  },
  {
    id: "7",
    content: "/path/to/graphic-violence.jpg",
    contentType: "image",
    flagReason: "Graphic Violence",
    flaggedBy: "CommunityMember",
    timestamp: "2023-06-07T13:20:00Z",
    author: "NewsReporter",
    status: "escalated",
    aiAnalysis: {
      sentimentScore: -0.9,
      language: "N/A",
      contentCategory: "News",
    },
    moderatorNotes:
      "Image contains graphic violence. Needs review for potential news value.",
  },
  {
    id: "8",
    content:
      "This comment thread contains coordinated harassment against a public figure.",
    contentType: "text",
    flagReason: "Harassment",
    flaggedBy: "ModeratorA",
    timestamp: "2023-06-08T17:45:00Z",
    author: "Multiple Users",
    status: "pending",
    aiAnalysis: {
      sentimentScore: -0.6,
      language: "English",
      contentCategory: "User Interaction",
    },
    moderatorNotes: "",
  },
  {
    id: "9",
    content: "/path/to/copyrighted-video.mp4",
    contentType: "video",
    flagReason: "Copyright Violation",
    flaggedBy: "ContentOwner",
    timestamp: "2023-06-09T11:10:00Z",
    author: "VideoReposter",
    status: "reviewed",
    aiAnalysis: {
      sentimentScore: 0,
      language: "Multiple",
      contentCategory: "Entertainment",
    },
    moderatorNotes:
      "Video confirmed to be copyrighted material. Removed and warning issued to uploader.",
  },
  {
    id: "10",
    content: "This post contains instructions for creating illegal substances.",
    contentType: "text",
    flagReason: "Illegal Content",
    flaggedBy: "LawEnforcement",
    timestamp: "2023-06-10T14:30:00Z",
    author: "AnonymousUser123",
    status: "escalated",
    aiAnalysis: {
      sentimentScore: 0.2,
      language: "English",
      contentCategory: "Illegal Activities",
    },
    moderatorNotes:
      "Content appears to violate laws. Escalated for legal team review.",
  },
  {
    id: "11",
    content: "/path/to/spam-image.png",
    contentType: "image",
    flagReason: "Spam",
    flaggedBy: "AutoModerator",
    timestamp: "2023-06-11T09:05:00Z",
    author: "MarketingBot",
    status: "reviewed",
    aiAnalysis: {
      sentimentScore: 0.3,
      language: "N/A",
      contentCategory: "Marketing",
    },
    moderatorNotes: "Confirmed spam content. Account suspended.",
  },
  {
    id: "12",
    content:
      "This comment contains personal information and a call to action for harassment.",
    contentType: "text",
    flagReason: "Doxxing",
    flaggedBy: "User789",
    timestamp: "2023-06-12T16:40:00Z",
    author: "AngryEx",
    status: "pending",
    aiAnalysis: {
      sentimentScore: -0.7,
      language: "English",
      contentCategory: "Personal",
    },
    moderatorNotes: "",
  },
  {
    id: "13",
    content: "/path/to/deepfake-video.mp4",
    contentType: "video",
    flagReason: "Misinformation",
    flaggedBy: "TechExpert",
    timestamp: "2023-06-13T12:15:00Z",
    author: "AIEnthusiast",
    status: "escalated",
    aiAnalysis: {
      sentimentScore: 0.1,
      language: "English",
      contentCategory: "Technology",
    },
    moderatorNotes: "Suspected deepfake video. Requires technical analysis.",
  },
  {
    id: "14",
    content:
      "This post contains unsubstantiated conspiracy theories about a recent event.",
    contentType: "text",
    flagReason: "Misinformation",
    flaggedBy: "FactChecker2",
    timestamp: "2023-06-14T10:20:00Z",
    author: "TruthSeeker42",
    status: "pending",
    aiAnalysis: {
      sentimentScore: -0.4,
      language: "English",
      contentCategory: "Conspiracy Theories",
    },
    moderatorNotes: "",
  },
  {
    id: "15",
    content: "/path/to/graphic-medical-image.jpg",
    contentType: "image",
    flagReason: "Graphic Content",
    flaggedBy: "User101",
    timestamp: "2023-06-15T15:30:00Z",
    author: "MedStudent",
    status: "reviewed",
    aiAnalysis: {
      sentimentScore: -0.2,
      language: "N/A",
      contentCategory: "Medical",
    },
    moderatorNotes:
      "Image is graphic but has educational value. Added content warning.",
  },
  {
    id: "16",
    content:
      "This comment thread contains coordinated inauthentic behavior promoting a political candidate.",
    contentType: "text",
    flagReason: "Manipulation",
    flaggedBy: "ElectionIntegrityTeam",
    timestamp: "2023-06-16T18:45:00Z",
    author: "Multiple Accounts",
    status: "escalated",
    aiAnalysis: {
      sentimentScore: 0.6,
      language: "English",
      contentCategory: "Politics",
    },
    moderatorNotes:
      "Suspected coordinated campaign. Escalated for further investigation.",
  },
  {
    id: "17",
    content: "/path/to/malware-link-post.txt",
    contentType: "text",
    flagReason: "Malicious Content",
    flaggedBy: "SecurityBot",
    timestamp: "2023-06-17T07:55:00Z",
    author: "HackerGroup",
    status: "reviewed",
    aiAnalysis: {
      sentimentScore: 0,
      language: "Multiple",
      contentCategory: "Cybersecurity",
    },
    moderatorNotes: "Confirmed malware link. Post removed and user banned.",
  },
  {
    id: "18",
    content:
      "This post contains extreme political views and calls for violence.",
    contentType: "text",
    flagReason: "Hate Speech",
    flaggedBy: "ConcernedCitizen",
    timestamp: "2023-06-18T14:10:00Z",
    author: "PoliticalExtremist",
    status: "pending",
    aiAnalysis: {
      sentimentScore: -0.9,
      language: "English",
      contentCategory: "Politics",
    },
    moderatorNotes: "",
  },
  {
    id: "19",
    content: "/path/to/misleading-product-ad.mp4",
    contentType: "video",
    flagReason: "Misinformation",
    flaggedBy: "ConsumerWatchdog",
    timestamp: "2023-06-19T11:25:00Z",
    author: "MarketingCompany",
    status: "escalated",
    aiAnalysis: {
      sentimentScore: 0.7,
      language: "English",
      contentCategory: "Advertising",
    },
    moderatorNotes:
      "Ad contains misleading claims. Escalated for legal review.",
  },
  {
    id: "20",
    content: "This comment contains a credible threat of self-harm.",
    contentType: "text",
    flagReason: "Self-Harm",
    flaggedBy: "MentalHealthModerator",
    timestamp: "2023-06-20T20:05:00Z",
    author: "AnonymousUser456",
    status: "escalated",
    aiAnalysis: {
      sentimentScore: -0.8,
      language: "English",
      contentCategory: "Mental Health",
    },
    moderatorNotes:
      "Urgent: User expressing intent of self-harm. Escalated for immediate action.",
  },
];
