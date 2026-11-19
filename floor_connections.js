window.floorConnections = [
//各階のつながりを作成する Floorで階数、Nodeで場所を指定、typeは区別する場合後で必要になるので一応かいておいてください
  // 1階と2階：階段A
  { fromFloor: 1, fromNode: "P1", toFloor: 2, toNode: "P0", type: "stairs" },

  // 2階と3階：エレベーターB
  { fromFloor: 2, fromNode: "P5", toFloor: 3, toNode: "P5", type: "elevator" }
];
//  "A棟階段1": "S2A1", // 上部
  "A棟階段2": "S2A2", // 下部
  "B棟階段1": "S2B1", // 上部
  "B棟階段2": "S2B2", // 下部
  "D棟階段": "S2D",
  "F棟階段1": "S2F1", // 上部
  "F棟階段2": "S2F2", // 下部
  "G棟階段": "S2G",
  "A棟EV":"EV2A",
  "B棟EV":"EV2B",
  "F棟EV":"EV2F",
