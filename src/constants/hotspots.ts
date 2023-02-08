import { Vector3 } from "three";

export interface IFloorHotspot {
  id: string;
  x: number;
  z: number;
  type: string;
  back?: string;
  caption?: {
    text: string;
    position: {
      x: number;
      y: number;
      z: number;
    };
    rotation: {
      x: number;
      y: number;
      z: number;
    };
  };
  shows: {
    id: string;
    rotation: number;
  }[];
}

export interface IRoom {
  id: string;
  title: string;
  center: Vector3;
  wallHotspots: string[];
  floorHotspots: IFloorHotspot[];
}

export const communityPostId = [
  {
    id: "a751dd71-1fa8-43b2-b88a-cc5f5d7ec7fa",
    type: "by-the-community",
  },
  {
    id: "ad1adbb6-5ce6-41a4-a988-775d6435427d",
    type: "by-nars",
  },
  {
    id: "44b599f4-88c1-4384-8641-21e227b74300",
    type: "by-the-community",
  },
  {
    id: "8174e781-b63c-4685-a729-8be0cdb95b12",
    type: "by-nars",
  },
  {
    id: "24b01b46-0e63-41f3-a0ea-ef85311c7193",
    type: "by-the-community",
  },
  {
    id: "6c1f595b-48f8-457a-b2e3-446831600117",
    type: "by-nars",
  },
  {
    id: "c536b89d-3c92-4a8e-9a9f-affba7d0f9b3",
    type: "by-the-community",
  },
  {
    id: "07f708cd-e4dd-472e-ac72-69fcba83a568",
    type: "by-nars",
  },
];

export const discoveryPanels = [
  "Disc_Face001",
  "Disc_Lips001",
  "Disc_Eyes001",
  "Disc_Trex",
];
export const discoveryPanelText = [
  "Disc_Face",
  "Disc_Lips",
  "Disc_Eyes",
  "Disc_TREX",
  "Disc_Best",
];
export const productCategories = [
  "face",
  "lips",
  "eyes",
  "trex",
  "bestsellers",
];
export const photoFrame = [
  "Frame_Face",
  "Frame_Lips",
  "Frame_Eyes",
  "Frame_Trex",
];
export const plusDiscoveryHotspots = [
  "DiscoverMini_1",
  "DiscoverMini_2",
  "DiscoverMini_3",
  "DiscoverMini_4",
];

export const middleDisplaySrc = [
  {
    category: "best_seler",
    type: "video",
    src: "/videos/BestSeller.mp4",
  },
  {
    category: "eyes",
    type: "video",
    src: "/videos/Eyes.mp4",
  },
  {
    category: "face",
    type: "video",
    src: "/videos/Face.mp4",
  },
  {
    category: "lips",
    type: "video",
    src: "/videos/Lips.mp4",
  },
  {
    category: "trex",
    type: "video",
    src: "/videos/Trex.mp4",
  },
];

export interface INavatarAnimation {
  room: string;
  clip: string[];
  position: {
    x: number;
    y: number;
    z: number;
  };
  positions?: {
    x: number;
    y: number;
    z: number;
  }[];
}

export const navatarAnimation: INavatarAnimation[] = [
  {
    room: "discovery",
    clip: ["idle", "lengthy", "waving"],
    position: { x: 34.5, y: 0.1, z: -1 },
  },
  {
    room: "community",
    clip: ["sit_1", "sit_2"],
    position: { x: -23.7, y: 0, z: 0 },
    positions: [
      { x: -23.7, y: -0.4, z: 0 },
      { x: -24, y: 0.2, z: 0 },
    ],
  },
  {
    room: "play",
    clip: ["breakdance", "weight_shift", "waving"],
    position: { x: -0.1, y: 1.5, z: -28.4 },
  },
];

export const floorObjectPosition = [
  { x: 31, y: 0.1, z: -5 },
  { x: 32.5, y: 0.1, z: -3.5 },
  { x: 33, y: 0.1, z: -1.5 },
  { x: 33, y: 0.1, z: 1.5 },
  { x: 32.5, y: 0.1, z: 3.5 },
  { x: 31, y: 0.1, z: 5 },
];

export const rooms: IRoom[] = [
  {
    id: "entry",
    title: "NARS Non Stop World",
    center: new Vector3(0, 3.5, 0),
    wallHotspots: [],
    floorHotspots: [
      {
        id: "nsw-1",
        x: 0,
        z: 23,
        type: "start",
        shows: [
          {
            id: "hall",
            rotation: 1,
          },
        ],
      },
      {
        id: "hall",
        x: 0,
        z: 16.5,
        type: "enter",
        shows: [],
      },
    ],
  },
  {
    id: "hall",
    title: "NARS | Non Stop Hall",
    center: new Vector3(0, 0, 0),
    wallHotspots: [
      "CenterMini_1",
      "CenterMini_2",
      "CenterMini_3",
      "CenterMini_4",
    ],
    floorHotspots: [
      {
        id: "nsh-1",
        x: 0,
        z: 12,
        type: "start",
        shows: [
          {
            id: "nsh-2",
            rotation: -0.25,
          },
          {
            id: "nsh-3",
            rotation: -0.5,
          },
          {
            id: "nsh-4",
            rotation: -0.75,
          },
          {
            id: "nsh-6",
            rotation: 0.75,
          },
          {
            id: "nsh-7",
            rotation: 0.5,
          },
          {
            id: "nsh-8",
            rotation: 0.25,
          },
          {
            id: "community",
            rotation: -0.5,
          },
          {
            id: "play",
            rotation: 1,
          },
          {
            id: "discovery",
            rotation: 0.5,
          },
        ],
      },
      {
        id: "nsh-2",
        x: -5,
        z: 5,
        type: "walk",
        shows: [
          {
            id: "nsh-1",
            rotation: 0,
          },
          {
            id: "nsh-3",
            rotation: -0.5,
          },
          {
            id: "nsh-4",
            rotation: -0.75,
          },
          {
            id: "nsh-5",
            rotation: 1,
          },
          {
            id: "nsh-7",
            rotation: 0.5,
          },
          {
            id: "nsh-8",
            rotation: 0.25,
          },
          {
            id: "community",
            rotation: -0.5,
          },
          {
            id: "play",
            rotation: 1,
          },
          {
            id: "discovery",
            rotation: 0.5,
          },
        ],
      },
      {
        id: "nsh-3",
        x: -7,
        z: 0,
        type: "door",
        shows: [
          {
            id: "nsh-1",
            rotation: 0,
          },
          {
            id: "nsh-2",
            rotation: -0.25,
          },
          {
            id: "nsh-4",
            rotation: -0.75,
          },
          {
            id: "nsh-5",
            rotation: 1,
          },
          {
            id: "nsh-6",
            rotation: 0.75,
          },
          {
            id: "nsh-8",
            rotation: 0.25,
          },
          {
            id: "community",
            rotation: -0.5,
          },
          {
            id: "play",
            rotation: 1,
          },
          {
            id: "discovery",
            rotation: 0.5,
          },
        ],
      },
      {
        id: "nsh-4",
        x: -5,
        z: -5,
        type: "walk",
        shows: [
          {
            id: "nsh-1",
            rotation: 0,
          },
          {
            id: "nsh-2",
            rotation: -0.25,
          },
          {
            id: "nsh-3",
            rotation: -0.5,
          },
          {
            id: "nsh-5",
            rotation: 1,
          },
          {
            id: "nsh-6",
            rotation: 0.75,
          },
          {
            id: "nsh-7",
            rotation: 0.5,
          },
          {
            id: "community",
            rotation: -0.5,
          },
          {
            id: "play",
            rotation: 1,
          },
          {
            id: "discovery",
            rotation: 0.5,
          },
        ],
      },
      {
        id: "nsh-5",
        x: 0,
        z: -7,
        type: "door",
        shows: [
          {
            id: "nsh-2",
            rotation: -0.25,
          },
          {
            id: "nsh-3",
            rotation: -0.5,
          },
          {
            id: "nsh-4",
            rotation: -0.75,
          },
          {
            id: "nsh-6",
            rotation: 0.75,
          },
          {
            id: "nsh-7",
            rotation: 0.5,
          },
          {
            id: "nsh-8",
            rotation: 0.25,
          },
          {
            id: "play",
            rotation: 1,
          },
          {
            id: "community",
            rotation: -0.5,
          },
          {
            id: "play",
            rotation: 1,
          },
          {
            id: "discovery",
            rotation: 0.5,
          },
        ],
      },
      {
        id: "nsh-6",
        x: 5,
        z: -5,
        type: "walk",
        shows: [
          {
            id: "nsh-1",
            rotation: 0,
          },
          {
            id: "nsh-3",
            rotation: -0.5,
          },
          {
            id: "nsh-4",
            rotation: -0.75,
          },
          {
            id: "nsh-5",
            rotation: 1,
          },
          {
            id: "nsh-7",
            rotation: 0.5,
          },
          {
            id: "nsh-8",
            rotation: 0.25,
          },
          {
            id: "community",
            rotation: -0.5,
          },
          {
            id: "play",
            rotation: 1,
          },
          {
            id: "discovery",
            rotation: 0.5,
          },
        ],
      },
      {
        id: "nsh-7",
        x: 7,
        z: 0,
        type: "door",
        shows: [
          {
            id: "nsh-1",
            rotation: 0,
          },
          {
            id: "nsh-2",
            rotation: -0.25,
          },
          {
            id: "nsh-4",
            rotation: -0.75,
          },
          {
            id: "nsh-5",
            rotation: 1,
          },
          {
            id: "nsh-6",
            rotation: 0.75,
          },
          {
            id: "nsh-8",
            rotation: 0.25,
          },
          {
            id: "discovery",
            rotation: 0.5,
          },
          {
            id: "community",
            rotation: -0.5,
          },
          {
            id: "play",
            rotation: 1,
          },
        ],
      },
      {
        id: "nsh-8",
        x: 5,
        z: 5,
        type: "walk",
        shows: [
          {
            id: "nsh-1",
            rotation: 0,
          },
          {
            id: "nsh-2",
            rotation: -0.25,
          },
          {
            id: "nsh-3",
            rotation: -0.5,
          },
          {
            id: "nsh-5",
            rotation: 1,
          },
          {
            id: "nsh-6",
            rotation: 0.75,
          },
          {
            id: "nsh-7",
            rotation: 0.5,
          },
          {
            id: "community",
            rotation: -0.5,
          },
          {
            id: "play",
            rotation: 1,
          },
          {
            id: "discovery",
            rotation: 0.5,
          },
        ],
      },
      {
        id: "community",
        x: -12,
        z: 0,
        type: "enter",
        caption: {
          text: "星际社区",
          position: { x: -11, y: 0.1, z: 0 },
          rotation: { x: -Math.PI / 2, y: 0, z: Math.PI / 2 },
        },
        shows: [],
      },
      {
        id: "play",
        x: 0,
        z: -12,
        type: "enter",
        caption: {
          text: "游戏专区",
          position: { x: 0, y: 0.1, z: -11 },
          rotation: { x: -Math.PI / 2, y: 0, z: 0 },
        },
        shows: [],
      },
      {
        id: "discovery",
        x: 12,
        z: 0,
        type: "enter",
        caption: {
          text: "星品情报",
          position: { x: 11, y: 0.1, z: 0 },
          rotation: { x: Math.PI / 2, y: Math.PI, z: Math.PI / 2 },
        },
        shows: [],
      },
    ],
  },
  {
    id: "community",
    title: "NARS | Non Stop Community",
    center: new Vector3(-24, 3.5, 0),
    wallHotspots: [
      "Mini_Community1",
      "Mini_Community2",
      "Mini_Community3",
      "Mini_Community4",
      "Mini_Community5",
      "Mini_Communit4",
      "Mini_Communit5",
      "Mini_Community6",
    ],
    floorHotspots: [
      {
        id: "nsc-1",
        x: -18,
        z: 0,
        type: "start",
        shows: [
          {
            id: "hall",
            rotation: 0.5,
          },
          {
            id: "nsc-2",
            rotation: -0.5,
          },
          {
            id: "nsc-4",
            rotation: -0.5,
          },
        ],
      },
      {
        id: "nsc-2",
        x: -24,
        z: 3,
        type: "walk",
        shows: [
          {
            id: "nsc-1",
            rotation: 0.5,
          },
          {
            id: "nsc-3",
            rotation: -0.75,
          },
        ],
      },
      {
        id: "nsc-3",
        x: -29,
        z: 1,
        type: "walk",
        shows: [
          {
            id: "nsc-1",
            rotation: 0.5,
          },
          {
            id: "nsc-2",
            rotation: 0.25,
          },
          {
            id: "nsc-4",
            rotation: 0.75,
          },
        ],
      },
      {
        id: "nsc-4",
        x: -25,
        z: -3.57,
        type: "walk",
        shows: [
          {
            id: "nsc-3",
            rotation: -0.25,
          },
          {
            id: "nsc-1",
            rotation: 0.5,
          },
        ],
      },
      {
        id: "hall",
        x: -15,
        z: 0,
        back: "nsh-3",
        type: "out",
        shows: [],
      },
    ],
  },
  {
    id: "play",
    title: "NARS | Non Stop Play",
    center: new Vector3(0, 3.5, -23),
    wallHotspots: ["PlayMini", "play_spot"],
    floorHotspots: [
      {
        id: "nsp-1",
        x: 0,
        z: -20,
        type: "start",
        shows: [
          {
            id: "nsp-2",
            rotation: 0.75,
          },
          {
            id: "nsp-3",
            rotation: -0.75,
          },
          {
            id: "hall",
            rotation: 0,
          },
        ],
      },
      {
        id: "nsp-2",
        x: 4,
        z: -24,
        type: "walk",
        shows: [
          {
            id: "nsp-1",
            rotation: 0,
          },
          {
            id: "nsp-3",
            rotation: -0.75,
          },
        ],
      },
      {
        id: "nsp-3",
        x: -4,
        z: -24,
        type: "walk",
        shows: [
          {
            id: "nsp-1",
            rotation: 0,
          },
          {
            id: "nsp-2",
            rotation: 0.75,
          },
        ],
      },
      {
        id: "hall",
        x: 0,
        z: -15,
        type: "out",
        back: "nsh-5",
        shows: [],
      },
    ],
  },
  {
    id: "discovery",
    title: "NARS | Non Stop Discovery",
    center: new Vector3(23, 3.5, 0),
    wallHotspots: [
      ...plusDiscoveryHotspots,
      "Disc_Product_Hotspot_1",
      "Disc_Product_Hotspot_2",
      "Disc_Product_Hotspot_3",
      "Disc_Product_Hotspot_4",
      "Disc_Product_Hotspot_5",
      "Disc_Product_Hotspot_6",
      ...photoFrame,
      ...discoveryPanelText,
      ...discoveryPanels,
    ],
    floorHotspots: [
      {
        id: "nsd-1",
        x: 21,
        z: 0,
        type: "start",
        shows: [
          {
            id: "nsd-2",
            rotation: -0.75,
          },
          {
            id: "nsd-3",
            rotation: 0.75,
          },
          {
            id: "nsd-4",
            rotation: 0.5,
          },
          {
            id: "nsd-5",
            rotation: 0.25,
          },
          {
            id: "nsd-6",
            rotation: -0.25,
          },
          {
            id: "hall",
            rotation: -0.5,
          },
        ],
      },
      {
        id: "nsd-2",
        x: 27,
        z: -3,
        type: "walk",
        shows: [
          {
            id: "nsd-1",
            rotation: -0.5,
          },
          {
            id: "nsd-3",
            rotation: 0.75,
          },
          {
            id: "nsd-4",
            rotation: 0.5,
          },
          {
            id: "nsd-5",
            rotation: 0,
          },
          {
            id: "nsd-6",
            rotation: -0.25,
          },
        ],
      },
      {
        id: "nsd-3",
        x: 30,
        z: -3,
        type: "walk",
        shows: [
          {
            id: "nsd-1",
            rotation: -0.5,
          },
          {
            id: "nsd-2",
            rotation: -0.75,
          },
          {
            id: "nsd-4",
            rotation: 0.5,
          },
          {
            id: "nsd-5",
            rotation: 0.25,
          },
          {
            id: "nsd-6",
            rotation: -0.25,
          },
        ],
      },
      {
        id: "nsd-4",
        x: 31,
        z: 0,
        type: "walk",
        shows: [
          {
            id: "nsd-1",
            rotation: -0.5,
          },
          {
            id: "nsd-2",
            rotation: -0.75,
          },
          {
            id: "nsd-3",
            rotation: 0.75,
          },
          {
            id: "nsd-5",
            rotation: 0.25,
          },
          {
            id: "nsd-6",
            rotation: -0.25,
          },
        ],
      },
      {
        id: "nsd-5",
        x: 30,
        z: 3,
        type: "walk",
        shows: [
          {
            id: "nsd-1",
            rotation: -0.5,
          },
          {
            id: "nsd-2",
            rotation: -0.75,
          },
          {
            id: "nsd-3",
            rotation: 0.75,
          },
          {
            id: "nsd-4",
            rotation: 0.5,
          },
          {
            id: "nsd-6",
            rotation: -0.25,
          },
        ],
      },
      {
        id: "nsd-6",
        x: 27,
        z: 3,
        type: "walk",
        shows: [
          {
            id: "nsd-1",
            rotation: -0.5,
          },
          {
            id: "nsd-2",
            rotation: -0.75,
          },
          {
            id: "nsd-3",
            rotation: 0.75,
          },
          {
            id: "nsd-4",
            rotation: 0.5,
          },
          {
            id: "nsd-5",
            rotation: 0.25,
          },
        ],
      },
      {
        id: "hall",
        x: 15,
        z: 0,
        type: "out",
        back: "nsh-7",
        shows: [],
      },
    ],
  },
];
