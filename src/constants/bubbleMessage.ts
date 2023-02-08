export type BubbleMessagePosition =
  | "hall"
  | "community"
  | "play"
  | "entry"
  | "discovery";

export const bubblePosition: BubbleMessagePosition[] = [
  "community",
  "discovery",
  "entry",
  "hall",
  "play",
];
export interface BubbleMessage {
  text: string[];
  isRead: boolean;
  position: BubbleMessagePosition;
}

export interface BubbleMessageUser {
  id: string;
  bubbleMessage: BubbleMessage[];
}

export const message: BubbleMessage[] = [
  {
    text: ["opening.bubbleSpeeches.welcome"],
    isRead: false,
    position: "entry",
  },
  {
    text: ["opening.bubbleSpeeches.welcome", "opening.bubbleSpeeches.profile"],
    isRead: false,
    position: "hall",
  },
  {
    text: [
      "community.bubbleSpeeches.0",
      "community.bubbleSpeeches.1",
      "community.bubbleSpeeches.2",
    ],
    isRead: false,
    position: "community",
  },
  {
    text: [
      "discovery.bubbleSpeeches.0",
      "discovery.bubbleSpeeches.1",
      "discovery.bubbleSpeeches.2",
      "discovery.bubbleSpeeches.3",
    ],
    isRead: false,
    position: "discovery",
  },
  {
    text: ["play.bubbleSpeeches.0", "play.bubbleSpeeches.1"],
    isRead: false,
    position: "play",
  },
];
