window.floorConnections = [
//各階のつながりを作成する Floorで階数、Nodeで場所を指定、typeは区別する場合後で必要になるので一応かいておいてください
  // 1階と2階：階段A
  { fromFloor: 1, fromNode: "P1", toFloor: 2, toNode: "P0", type: "stairs" },
  { fromFloor: 1, fromNode: "P1", toFloor: 2, toNode: "P0", type: "stairs" },
  { fromFloor: 2, fromNode: "S2A1", toFloor: 3, toNode: "SA3", type: "stairs" },
  { fromFloor: 2, fromNode: "S2A2", toFloor: 3, toNode: "P0", type: "stairs" }, //接続なし
  { fromFloor: 2, fromNode: "S2B1", toFloor: 3, toNode: "SB3", type: "stairs" },
  { fromFloor: 2, fromNode: "S2B2", toFloor: 3, toNode: "P0", type: "stairs" }, //なぜかない
  { fromFloor: 2, fromNode: "S2D", toFloor: 3, toNode: "SD3", type: "stairs" },
  { fromFloor: 2, fromNode: "S2F1", toFloor: 3, toNode: "P0", type: "stairs" },
  { fromFloor: 2, fromNode: "S2F2", toFloor: 3, toNode: "P0", type: "stairs" },
  { fromFloor: 2, fromNode: "S2G", toFloor: 3, toNode: "P0", type: "stairs" },
  { fromFloor: 3, fromNode: "S2F1", toFloor: 2, toNode: "P0", type: "stairs" },
  { fromFloor: 3, fromNode: "S2F1", toFloor: 2, toNode: "P0", type: "stairs" },
  { fromFloor: 3, fromNode: "S2F1", toFloor: 2, toNode: "P0", type: "stairs" },



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
  "A棟階段" : "SA3",
  "B棟階段" : "SB3",
  "D棟階段" : "SD3",
  "F棟階段1" : "SF31", // トイレ付近
  "F棟階段2" : "SF32", // G棟付近
  "G棟階段" : "SG3"
 "階段A上": "S41",
  "階段A下": "S42",
  "階段B上": "S43",
  "階段B下": "S44",
  "階段G上": "S45",
  "階段G下": "S46",
