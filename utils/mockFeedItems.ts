import { Facebook, Instagram, Youtube, MessageCircle } from "lucide-react";

export type FeedItem = {
  id: number;
  platform: "Facebook" | "Instagram" | "YouTube" | "Reddit";
  author: { name: string; image: string };
  content: string;
  timestamp: string;
  engagement: { likes: number; shares: number; comments: number };
  sentiment: "positive" | "neutral" | "negative";
  flagged: boolean;
};

export const platformIcons = {
  Facebook,
  Instagram,
  Youtube,
  Reddit: MessageCircle,
};

export const mockFeedItems: FeedItem[] = [
  {
    id: 1,
    platform: "Facebook",
    author: { name: "John Doe", image: "/placeholder-user.jpg" },
    content: "Excited to announce our new product launch! #innovation",
    timestamp: "2 hours ago",
    engagement: { likes: 1500, shares: 300, comments: 250 },
    sentiment: "positive",
    flagged: false,
  },
  {
    id: 2,
    platform: "Instagram",
    author: { name: "Jane Smith", image: "/placeholder-user.jpg" },
    content: "Beautiful sunset at the beach 🌅 #naturelover",
    timestamp: "5 hours ago",
    engagement: { likes: 3000, shares: 100, comments: 500 },
    sentiment: "positive",
    flagged: false,
  },
  {
    id: 3,
    platform: "YouTube",
    author: { name: "Tech Reviews", image: "/placeholder-user.jpg" },
    content: "New video: Top 10 Smartphones of 2025 - You won't believe #5!",
    timestamp: "1 day ago",
    engagement: { likes: 10000, shares: 2000, comments: 1500 },
    sentiment: "neutral",
    flagged: false,
  },
  {
    id: 4,
    platform: "Reddit",
    author: { name: "u/newsbreaker", image: "/placeholder-user.jpg" },
    content: "Breaking: Major scientific breakthrough in quantum computing",
    timestamp: "3 hours ago",
    engagement: { likes: 5000, shares: 1000, comments: 3000 },
    sentiment: "positive",
    flagged: false,
  },
  {
    id: 5,
    platform: "Facebook",
    author: { name: "Sarah Johnson", image: "/placeholder-user.jpg" },
    content:
      "Just finished my first marathon! Feeling accomplished 🏃‍♀️ #fitness",
    timestamp: "1 hour ago",
    engagement: { likes: 800, shares: 50, comments: 120 },
    sentiment: "positive",
    flagged: false,
  },
  {
    id: 6,
    platform: "Instagram",
    author: { name: "Food Lover", image: "/placeholder-user.jpg" },
    content: "Trying out this new vegan restaurant in town 🥗 #foodie",
    timestamp: "4 hours ago",
    engagement: { likes: 2500, shares: 75, comments: 300 },
    sentiment: "positive",
    flagged: false,
  },
  {
    id: 7,
    platform: "YouTube",
    author: { name: "Travel Vlogger", image: "/placeholder-user.jpg" },
    content:
      "Exploring hidden gems in Bali - You won't find these in guidebooks!",
    timestamp: "2 days ago",
    engagement: { likes: 15000, shares: 3000, comments: 2000 },
    sentiment: "positive",
    flagged: false,
  },
  {
    id: 8,
    platform: "Reddit",
    author: { name: "u/politicalanalyst", image: "/placeholder-user.jpg" },
    content: "Opinion: The impact of recent policy changes on global economics",
    timestamp: "6 hours ago",
    engagement: { likes: 3500, shares: 800, comments: 1500 },
    sentiment: "neutral",
    flagged: false,
  },
  {
    id: 9,
    platform: "Facebook",
    author: { name: "Local News Network", image: "/placeholder-user.jpg" },
    content: "Traffic alert: Major accident on Highway 101, expect delays",
    timestamp: "30 minutes ago",
    engagement: { likes: 200, shares: 500, comments: 100 },
    sentiment: "negative",
    flagged: true,
  },
  {
    id: 10,
    platform: "Instagram",
    author: { name: "Fitness Guru", image: "/placeholder-user.jpg" },
    content:
      "New 30-day challenge starting tomorrow! Who's in? 💪 #fitnessmotivation",
    timestamp: "8 hours ago",
    engagement: { likes: 5000, shares: 200, comments: 800 },
    sentiment: "positive",
    flagged: false,
  },
  {
    id: 11,
    platform: "YouTube",
    author: { name: "DIY Crafts", image: "/placeholder-user.jpg" },
    content: "5 Easy Home Decor Ideas Using Recycled Materials",
    timestamp: "3 days ago",
    engagement: { likes: 8000, shares: 1500, comments: 1000 },
    sentiment: "positive",
    flagged: false,
  },
  {
    id: 12,
    platform: "Reddit",
    author: { name: "u/techexpert", image: "/placeholder-user.jpg" },
    content:
      "AMA: I'm a senior software engineer at a major tech company. Ask me anything!",
    timestamp: "12 hours ago",
    engagement: { likes: 6000, shares: 300, comments: 2500 },
    sentiment: "neutral",
    flagged: false,
  },
  {
    id: 13,
    platform: "Facebook",
    author: { name: "Environmental Group", image: "/placeholder-user.jpg" },
    content:
      "Join us for a beach cleanup this weekend! Let's protect our oceans 🌊 #environment",
    timestamp: "1 day ago",
    engagement: { likes: 1200, shares: 400, comments: 150 },
    sentiment: "positive",
    flagged: false,
  },
  {
    id: 14,
    platform: "Instagram",
    author: { name: "Fashion Influencer", image: "/placeholder-user.jpg" },
    content:
      "Summer fashion haul! Swipe to see my favorite picks 👗👠 #fashionista",
    timestamp: "7 hours ago",
    engagement: { likes: 7000, shares: 150, comments: 600 },
    sentiment: "positive",
    flagged: false,
  },
  {
    id: 15,
    platform: "YouTube",
    author: { name: "Cooking Channel", image: "/placeholder-user.jpg" },
    content: "How to Make the Perfect Pizza Dough - Step by Step Guide",
    timestamp: "4 days ago",
    engagement: { likes: 12000, shares: 2500, comments: 1800 },
    sentiment: "positive",
    flagged: false,
  },
  {
    id: 16,
    platform: "Reddit",
    author: { name: "u/moviebuff", image: "/placeholder-user.jpg" },
    content: "Unpopular Opinion: Why I think [MOVIE TITLE] is overrated",
    timestamp: "2 days ago",
    engagement: { likes: 4000, shares: 200, comments: 3500 },
    sentiment: "negative",
    flagged: false,
  },
  {
    id: 17,
    platform: "Facebook",
    author: { name: "Local Restaurant", image: "/placeholder-user.jpg" },
    content: "New menu items alert! Come try our seasonal specials 🍽️ #foodie",
    timestamp: "5 hours ago",
    engagement: { likes: 500, shares: 100, comments: 80 },
    sentiment: "positive",
    flagged: false,
  },
  {
    id: 18,
    platform: "Instagram",
    author: { name: "Travel Photographer", image: "/placeholder-user.jpg" },
    content:
      "Capturing the Northern Lights in Iceland. A dream come true! ✨ #auroraborealis",
    timestamp: "2 days ago",
    engagement: { likes: 9000, shares: 500, comments: 700 },
    sentiment: "positive",
    flagged: false,
  },
  {
    id: 19,
    platform: "YouTube",
    author: { name: "Science Explained", image: "/placeholder-user.jpg" },
    content: "The Mystery of Dark Matter: What We Know So Far",
    timestamp: "1 week ago",
    engagement: { likes: 20000, shares: 5000, comments: 3000 },
    sentiment: "neutral",
    flagged: false,
  },
  {
    id: 20,
    platform: "Reddit",
    author: { name: "u/conspiracy_theorist", image: "/placeholder-user.jpg" },
    content: "Theory: The government is hiding evidence of alien life",
    timestamp: "1 day ago",
    engagement: { likes: 1500, shares: 300, comments: 2000 },
    sentiment: "neutral",
    flagged: true,
  },
];
