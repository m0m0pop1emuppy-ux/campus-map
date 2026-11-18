window.floorConnections = [
//各階のつながりを作成する Floorで階数、Nodeで場所を指定、typeは区別する場合後で必要になるので一応かいておいてください
  // 1階と2階：階段A
  {
    fromFloor: 1,
    fromNode: "P1",
    toFloor: 2,
    toNode: "P0",
    type: "stairs"
  },

  // 2階と3階：エレベーターB
  {
    fromFloor: 2,
    fromNode: "P5",
    toFloor: 3,
    toNode: "P5",
    type: "elevator"
  }

];
