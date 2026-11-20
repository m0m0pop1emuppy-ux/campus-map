window.floorConnections = [
//各階のつながりを作成する Floorで階数、Nodeで場所を指定、typeは区別する場合後で必要になるので一応かいておいてください
  // A階段
  { fromFloor: 1, fromNode: "S11", toFloor: 2, toNode: "S2A1", type: "stairs" },
  { fromFloor: 1, fromNode: "S12", toFloor: 2, toNode: "S2A2", type: "stairs" },
  { fromFloor: 2, fromNode: "S2A1", toFloor: 3, toNode: "SA3", type: "stairs" },
  //B上
  { fromFloor: 2, fromNode: "S2B1", toFloor: 3, toNode: "SB3", type: "stairs" },
  { fromFloor: 3, fromNode: "SB3", toFloor: 4, toNode: "S43", type: "stairs" },
  { fromFloor: 4, fromNode: "S43", toFloor: 5, toNode: "S5B2", type: "stairs" },
  //B下
  { fromFloor: 2, fromNode: "S2B2", toFloor: 4, toNode: "S44", type: "stairs" },
  { fromFloor: 4, fromNode: "S44", toFloor: 5, toNode: "S5B2", type: "stairs" },
  //D
  { fromFloor: 2, fromNode: "S2D", toFloor: 3, toNode: "SD3", type: "stairs" },
  //F上
  { fromFloor: 2, fromNode: "S2F1", toFloor: 3, toNode: "SF31", type: "stairs" },
  //F下
  { fromFloor: 2, fromNode: "S2F2", toFloor: 3, toNode: "SF32", type: "stairs" },
  //G
  { fromFloor: 2, fromNode: "S2G", toFloor: 3, toNode: "SG3", type: "stairs" },
  { fromFloor: 3, fromNode: "SG3", toFloor: 4, toNode: "S46", type: "stairs" },

  // 2階と3階：エレベーターB
  { fromFloor: 1, fromNode: "E11", toFloor: 2, toNode: "EV2A", type: "elevator" }
];

