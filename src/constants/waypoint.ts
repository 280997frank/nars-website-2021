import { Vector3 } from "three";

export const nonStopHallWaypoint = [
  {
    id: 1,
    name: "nsh-1",
    type: "start-point",
    x: 0.0028554901551448297,
    z: 11.97171029441554,
    rotateY: Math.PI,
    lookAtObject: new Vector3(0, 3.5, 0),
  },
  {
    id: 2,
    name: "nsh-2",
    type: "wall-point",
    x: -5.034186654327239,
    z: 4.987757108257208,
    rotateY: -Math.PI / 4,
    lookAtObject: ["Center_1", "CenterMini_1"],
  },
  {
    id: 3,
    name: "nsh-3",
    type: "door-point",
    x: -7.059537740555027,
    z: -0.03368737281231557,
    rotateY: -Math.PI / 2,
    lookAtObject: "door_community",
  },
  {
    id: 4,
    name: "nsh-4",
    type: "wall-point",
    x: -5.031312255293016,
    z: -5.009875054762895,
    rotateY: -Math.PI / 2 - Math.PI / 4,
    lookAtObject: ["Center_2", "CenterMini_2"],
  },
  {
    id: 5,
    name: "nsh-5",
    type: "door-point",
    x: -0.01459839429287113,
    z: -7.043506360892667,
    rotateY: Math.PI,
    lookAtObject: "door_play",
  },
  {
    id: 6,
    name: "nsh-6",
    type: "wall-point",
    x: 4.993827365533509,
    z: -4.99617062440819,
    rotateY: Math.PI / 2 + Math.PI / 4,
    lookAtObject: ["Center_3", "CenterMini_3"],
  },
  {
    id: 7,
    name: "nsh-7",
    type: "door-point",
    x: 6.975231989435331,
    z: -0.027832899726182803,
    rotateY: Math.PI / 2,
    lookAtObject: "door_discovery",
  },
  {
    id: 8,
    name: "nsh-8",
    type: "wall-point",
    x: 4.992948480753929,
    z: 4.996613108087243,
    rotateY: Math.PI / 4,
    lookAtObject: ["Center_4", "CenterMini_4"],
  },
];

export const hallIconSpots = [
  "CenterMini_1",
  "CenterMini_2",
  "CenterMini_3",
  "CenterMini_4",
];

export const hallSpots = [
  "Center_1",
  "Center_2",
  "Center_3",
  "Center_4",
  "door_community",
  "door_play",
  "door_discovery",
  ...hallIconSpots,
];

export const communityHotspots = [
  "com_1",
  "com_2",
  "com_3",
  "com_4",
  "com_5",
  "com_6",
  "com_7",
  "com_8",
];

export const communitySpots = ["door_community", ...communityHotspots];

export const playSpots = ["door_play", "play_spot", "PlayMini"];

export const discoverIconSpots = [
  "DiscoverMini_1",
  "DiscoverMini_2",
  "DiscoverMini_3",
  "DiscoverMini_4",
  "DiscoverMini_5",
  "DiscoverMini_6",
  "DiscoverMini_7",
  "DiscoverMini_8",
];

export const discoverySpots = [
  "door_discovery",
  "Disc_Face",
  "Disc_Lips",
  "Discover_Lookat",
  "Disc_Eyes",
  "Disc_Trex",
  ...discoverIconSpots,
];

export const communityWaypoint = [
  {
    id: 1,
    name: "cw-1",
    type: "start-point",
    x: -20.041239644807096,
    z: -0.003692357504280208,
    rotateY: -Math.PI / 2,
    lookAtObject: new Vector3(-25, 3.5, 0),
  },
  {
    id: 2,
    name: "cw-2",
    type: "wall-point",
    x: -23.993221541664404,
    z: 2.950571395130727,
    rotateY: Math.PI / 4,
    lookAtObject: ["com_1", "com_2"],
  },
  {
    id: 3,
    name: "cw-3",
    type: "wall-point",
    x: -27.022798328343416,
    z: 2.994171736908426,
    rotateY: -Math.PI / 4,
    lookAtObject: ["com_3", "com_4"],
  },
  {
    id: 4,
    name: "cw-4",
    type: "wall-point",
    x: -28.965170033043137,
    z: 0.9718040472040165,
    rotateY: -Math.PI / 2,
    lookAtObject: "com_5",
  },
  {
    id: 5,
    name: "cw-5",
    type: "wall-point",
    x: -28.975226577960182,
    z: -2.0693203601068886,
    rotateY: -Math.PI / 2 - Math.PI / 4,
    lookAtObject: ["com_6", "com_7"],
  },
  {
    id: 6,
    name: "cw-6",
    type: "wall-point",
    x: -26.010063268522828,
    z: -3.569302095364428,
    rotateY: Math.PI,
    lookAtObject: "com_8",
  },
];

export const playWaypoint = [
  {
    id: 1,
    name: "gw-1",
    type: "start-point",
    x: -0.010787435979339451,
    z: -19.020871933728095,
    rotateY: Math.PI / 2,
    lookAtObject: ["play_spot", "PlayMini"],
  },
  {
    id: 2,
    name: "gw-2",
    type: "center-point",
    x: 4.007083784530367,
    z: -23.985342435960618,
    rotateY: Math.PI,
    lookAtObject: ["play_spot", "PlayMini"],
  },
  {
    id: 3,
    name: "gw-3",
    type: "center-point",
    x: -3.998308412880283,
    z: -24.0390741234407,
    rotateY: -Math.PI / 2 - Math.PI / 4,
    lookAtObject: ["play_spot", "PlayMini"],
  },
];

export const discoveryWaypoint = [
  {
    id: 1,
    name: "dw-1",
    type: "start-point",
    x: 21.028558410917977,
    z: 0.005446763652214001,
    rotateY: Math.PI / 2 + Math.PI / 4,
    lookAtObject: new Vector3(25, 3.5, 0),
  },
  {
    id: 2,
    name: "dw-2",
    type: "wall-point",
    x: 26.99907903267118,
    z: -3.023891133312852,
    rotateY: -Math.PI / 4 - Math.PI / 2,
    lookAtObject: ["Disc_Face", "DiscoverMini_1"],
  },
  {
    id: 3,
    name: "dw-3",
    type: "wall-point",
    x: 29.989935647686217,
    z: -2.9789774666900315,
    rotateY: Math.PI / 4 + Math.PI / 2,
    lookAtObject: ["Disc_Lips", "DiscoverMini_2"],
  },
  {
    id: 4,
    name: "dw-4",
    type: "wall-point",
    x: 31,
    z: 0,
    rotateY: Math.PI / 2,
    lookAtObject: [
      "Discover_Lookat",
      "DiscoverMini_5",
      "DiscoverMini_6",
      "DiscoverMini_7",
      "DiscoverMini_8",
    ],
  },
  {
    id: 5,
    name: "dw-5",
    type: "wall-point",
    x: 30.018732267950316,
    z: 2.970979878525095,
    rotateY: Math.PI / 4,
    lookAtObject: ["Disc_Eyes", "DiscoverMini_3"],
  },
  {
    id: 6,
    name: "dw-6",
    type: "wall-point",
    x: 27.01118956966865,
    z: 3.000284401119827,
    rotateY: -Math.PI / 4,
    lookAtObject: ["Disc_Trex", "DiscoverMini_4"],
  },
];

export const entryWaypoint = [
  {
    id: 1,
    name: "ew-1",
    type: "start-point",
    x: 0,
    z: 23,
    rotateY: Math.PI,
    lookAtObject: new Vector3(0, 3.5, 0),
  },
  {
    id: 2,
    name: "ew-2",
    type: "entry-point",
    x: 0,
    z: 17,
    rotateY: Math.PI,
    lookAtObject: new Vector3(0, 3.5, 0),
  },
];

export const narsWaypoints = [
  {
    room: "entry",
    type: "direct",
    door: "",
    back: "",
    hotspots: [],
    waypoints: entryWaypoint,
  },
  {
    room: "hall",
    door: "ew-2",
    back: "",
    type: "circular",
    hotspots: hallSpots,
    waypoints: nonStopHallWaypoint,
  },
  {
    room: "community",
    door: "door_community",
    back: "nsh-3",
    type: "circular",
    hotspots: communitySpots,
    waypoints: communityWaypoint,
  },
  {
    room: "play",
    door: "door_play",
    back: "nsh-5",
    type: "direct",
    hotspots: playSpots,
    waypoints: playWaypoint,
  },
  {
    room: "discovery",
    door: "door_discovery",
    back: "nsh-7",
    type: "circular",
    hotspots: discoverySpots,
    waypoints: discoveryWaypoint,
  },
];
