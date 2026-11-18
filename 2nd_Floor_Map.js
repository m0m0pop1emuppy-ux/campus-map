const width = 1080;
const height =1920;

// 地図を作成する
const map = L.map("map", {
  crs: L.CRS.Simple,
  minZoom: -2
});

// 画像全体の範囲を決める
const bounds = [
  [0, 0],
  [height, width]
];

// 画像のURLを設定
const imageUrl = "https://raw.githubusercontent.com/m0m0pop1emuppy-ux/campus-map/main/2nd_Floor_Map_color.png";


L.imageOverlay(imageUrl, bounds).addTo(map);

// ④ 画像全体が画面に入るようにする
map.fitBounds(bounds);

// 入力欄
const startInput =
  document.getElementById("startInput");

const goalInput =
  document.getElementById("goalInput");

// 経路の初期値
let routeLine = null;
 
 // 施設名と通路上の地点を対応させる
const facilitiesRouteNodes = {
  "非常勤講師控室": "A20",
  "院生会室": "A21",
  "物理学実験室1": "A22",
  "物理学実験室2": "A23",
  "地学実習室1": "A24",
  "地学実習室2": "A25",
  "B251": "B21",
  "B252": "B22",
  "B253": "B23",
  "B254": "B24",
  "B255": "B25",
  "B256": "B26",
  "B258": "B28",
  "第一化学実験室": "C21",
  "第二化学実験室": "C22",
  "D200": "D20",
  "D201": "D21",
  "学生談話室": "D22",
  "キャリアセンター": "D23",
  "教務課": "D24",
  "入学センター": "D25",
  "E260": "E20",
  "F270": "F20",
  "F271": "F21",
  "F272": "F22",
  "F273": "F23",
  "F274": "F24",
  "F275": "F25",
  "G210": "G20",
  "体育測定室": "G21",
  "生物学実験室": "G22",
  "A階段1": "S2A1",
  "A階段2": "S2A2",
  "B階段1": "S2B1",
  "B階段2": "S2B2",
  "D階段": "S2D",
  "F階段1": "S2F1",
  "F階段2": "S2F2",
  "G階段": "S2G",
  "AEV":"EV2A",
  "BEV":"EV2B",
  "FEV":"EV2F",
};

// 通路上の地点を登録
const routeNodes = {
  A20: [1170, 206], //非常勤講師控室
  A21: [1122, 318], //院生会室
  A22: [1000, 206], //物理学実験室1
  A23: [1000, 318], //物理学実験室2
  A24: [800, 206], //地学実習室1
  A25: [800, 318], //地学実習室2
  B21: [1140, 525], //B251
  B22: [1160, 640], //B252
  B23: [980, 525], //B253
  B24: [1020, 640], //B254
  B25: [780, 525], //B255
  B26: [890, 640], //B256
  B28: [760, 640], //B258
  C21: [600, 140], //第一化学実験室
  C22: [540, 260], //第二化学実験室
  D20: [1400, 930], //D200
  D21: [1400, 830], //D201
  D22: [1400, 745], //学生談話室
  D23: [1400, 370], //キャリアセンター
  D24: [1400, 215], //教務課
  D25: [1400, 110], //入学センター
  E20: [460, 580], //E260
  F20: [1110, 980], //F270
  F21: [1140, 865], //F271
  F22: [990, 980], //F272
  F23: [980, 865], //F273
  F24: [850, 980], //F274
  F25: [830, 865], //F275
  G20: [660, 980], //G210
  G21: [580, 865], //体育測定室
  G22: [580, 980], //生物学実験室
  S2A1:[1270,205],
  S2A2:[680,320],
  S2B1:[1310,650],
  S2B2:[680,640],
  S2D:[1380,580],
  S2F1:[1320,985],
  S2F2:[760,980],
  S2G:[510,980],
  EV2A:[1270,325],
  EV2B:[1270,650],
  EV2F:[1270,985],
  
  P20: [1340, 580],
  P21: [1310, 580],
  P22: [1270, 580],
  P23: [1150, 580], 
  P24: [1000, 580],
  P25: [870, 580],
  P26: [750, 580],
  P27: [680, 580],
  P28: [600, 580],
  P29: [600, 190],
  P210: [800, 260],
  P211: [680, 260],
  P212: [800, 260],
  P213: [970, 260],
  P214: [1130, 260],
  P215: [1270, 260],
  P216: [1340, 260],
  P217: [1340, 215],
  P218: [1340, 110],
  P219: [1340, 370],
  P220: [1340, 550],
  P221: [1420, 550],
  P222: [1420, 580],
  P223: [1420, 620],
  P224: [1340, 620],
  P225: [1340, 755],
  P226: [1340, 830],
  P227: [1340, 918],
  P228: [1320, 918],
  P229: [1270, 918],
  P230: [1095, 918],
  P231: [985, 918],
  P232: [840, 918],
  P233: [760, 918],
  P234: [660, 918],
  P235: [580, 918],
  P236: [510, 918],
};

// 直接つながっている地点を登録
const connections = [
  ["A20", "P214"],
  ["A21", "P214"],
  ["A22", "P213"],
  ["A23", "P213"],
  ["A24", "P212"],
  ["A25", "P212"],
  ["B21", "P23"],
  ["B22", "P23"],
  ["B23", "P24"],
  ["B24", "P24"],
  ["B25", "P25"],
  ["B25", "P26"],
  ["B25", "P27"],
  ["B26", "P25"],
  ["B28", "P26"],
  ["C21", "P210"],
  ["C22", "P29"],
  ["D20", "P227"],
  ["D21", "P226"],
  ["D22", "P225"],
  ["D23", "P219"],
  ["D24", "P217"],
  ["D25", "P218"],
  ["E20", "P28"],
  ["F20", "P230"],
  ["F21", "P230"],
  ["F22", "P231"],
  ["F23", "P231"],
  ["F24", "P232"],
  ["F25", "P232"],
  ["G20", "P234"],
  ["G21", "P235"],
  ["G22", "P235"],
  ["S2A1", "P215"],
  ["S2A2", "P211"],
  ["S2B1", "P21"],
  ["S2B2", "P27"],
  ["S2D", "P222"],
  ["S2F1", "P228"],
  ["S2F2", "P233"],
  ["S2G", "P236"],
  ["EV2A", "P215"],
  ["EV2B", "P22"],
  ["EV2F", "P229"],
  
  ["P20", "P220"],
  ["P20", "P224"],
  ["P20", "P21"],
  ["P21", "P22"],
  ["P22", "P23"],
  ["P23", "P24"],
  ["P24", "P25"],
  ["P25", "P26"],
  ["P26", "P27"],
  ["P27", "P28"],
  ["P28", "P29"],
  ["P29", "P210"],
  ["P29", "P211"],
  ["P211", "P212"],
  ["P212", "P213"],
  ["P213", "P214"],
  ["P214", "P215"],
  ["P215", "P216"],
  ["P216", "P217"],
  ["P217", "P218"],
  ["P216", "P219"],
  ["P219", "P220"],
  ["P220", "P221"],
  ["P221", "P222"],
  ["P222", "P223"],
  ["P223", "P224"],
  ["P224", "P225"],
  ["P225", "P226"],
  ["P226", "P227"],
  ["P227", "P228"],
  ["P228", "P229"],
  ["P229", "P230"],
  ["P230", "P231"],
  ["P231", "P232"],
  ["P232", "P233"],
  ["P233", "P234"],
  ["P234", "P235"],
  ["P235", "P236"]
];

document.getElementById("routeButton")
  .addEventListener("click", function() {

    const startName = startInput.value.trim();
    const goalName = goalInput.value.trim();

    if (!startName || !goalName) {
      document.getElementById("routeMessage")
        .textContent = "出発地と目的地を入力してください";
      return;
    }

    // 施設名が登録されているか確認
    if (
      !facilitiesRouteNodes[startName] ||
      !facilitiesRouteNodes[goalName]
    ) {
      document.getElementById("routeMessage")
        .textContent = "施設名が見つかりません";
      return;
    }

    if (startName === goalName) {
      document.getElementById("routeMessage")
        .textContent = "出発地と目的地が同じです";
      return;
    }

    // 最短経路を検索
    const path = findRoute(
      facilitiesRouteNodes[startName],
      facilitiesRouteNodes[goalName]
    );

    if (!path) {
      document.getElementById("routeMessage")
        .textContent = "経路が見つかりません";
      return;
    }

    // 前の経路を消去
    if (routeLine) {
      map.removeLayer(routeLine);
    }

    // 経路を地図に表示
    const points = path.map(id => routeNodes[id]);

    routeLine = L.polyline(points, {
      color: "blue",
      weight: 5
    }).addTo(map);

    // 経路全体が画面に入るようにする
    map.fitBounds(routeLine.getBounds(), {
      padding: [30, 30]
    });

    document.getElementById("routeMessage")
      .textContent = "経路を表示しました";

  });

// 最短経路
function findRoute(start, goal) {

  const distance = {};
  const previous = {};
  const visited = new Set();

  Object.keys(routeNodes).forEach(id => {
    distance[id] = Infinity;
  });

  distance[start] = 0;

  while (true) {

    let current = null;

    Object.keys(routeNodes).forEach(id => {
      if (!visited.has(id) &&
          (current === null ||
           distance[id] < distance[current])) {
        current = id;
      }
    });

    if (current === null ||
        distance[current] === Infinity) {
      break;
    }

    if (current === goal) break;

    visited.add(current);

    connections.forEach(([a, b]) => {

      let next = null;

      if (a === current) next = b;
      if (b === current) next = a;

      if (next !== null) {

        const d = Math.hypot(
          routeNodes[current][0] - routeNodes[next][0],
          routeNodes[current][1] - routeNodes[next][1]
        );

        const newDistance = distance[current] + d;

        if (newDistance < distance[next]) {
          distance[next] = newDistance;
          previous[next] = current;
        }
      }

    });

  }

  if (distance[goal] === Infinity) {
    return null;
  }

  const path = [];
  let current = goal;

  while (current !== undefined) {
    path.unshift(current);
    current = previous[current];
  }

  return path;
}
// 経路消去
document.getElementById("clearRouteButton")
  .addEventListener("click", function() {

    if (routeLine) {
      map.removeLayer(routeLine);
      routeLine = null;
    }

    document.getElementById("routeMessage")
      .textContent = "";

  });
