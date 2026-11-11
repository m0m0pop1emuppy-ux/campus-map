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
const imageUrl　=　"https://raw.githubusercontent.com/m0m0pop1emuppy-ux/campus-map/main/3rd_Floor_Map_color.png";


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
  "図書館": "A0",
  "B350": "B0",
  "B351": "B1",
  "B352": "B2",
  "B353": "B3",
  "B354": "B4",
  "B355": "B5",
  "B356": "B6",
  "B358": "B8",
  "留学交流推進課": "D0",
  "人文学部創生学部学務係": "D1",
  "D303": "D3",
  "D307": "D7",
  "D308": "D8",
  "D309": "D9",
  "D310": "D10",
  "D311a": "D11A",
  "D311b": "D11B",
  "D312": "D12",
  "D313": "D13",
  "E260": "E0",
  "F370A": "F0A",
  "F370B": "F0B",
  "F371": "F1",
  "F372": "F2",
  "F373": "F3",
  "F374": "F4",
  "F375": "F5",
  "G310": "G0",
  "G311": "G1",
  "G312": "G2",
  "G313": "G3",
  "G315": "G5",
};

// 通路上の地点を登録
const routeNodes = {
  A0: [1030, 247],  
  B0: [1200, 642], 
  B1: [1194, 526], 
  B2: [1130, 642], 
  B3: [1010, 524], 
  B4: [1050, 642], 
  B5: [790, 524], 
  B6: [912, 642],
  B8: [772, 642],
  D0: [1420, 780], 
  D1: [1420, 970],
  D3: [1410,889],
  D7: [1360, 464],
  D8: [1360, 415],
  D9: [1360, 371],
  D10: [1440, 460],
  D11A: [1440, 414],
  D11B: [1440, 370],
  D12: [1440, 323],
  D13: [1420, 290],
  E0: [455, 577],
  F0A: [1180, 1005], 
  F0B: [1110, 1005],
  F1: [1160, 885], 
  F2: [1020, 1010], 
  F3: [1000, 885],
  F4: [866, 1005],
  F5: [848, 885], 
  G0: [638, 992],
  G1: [650, 885], 
  G2: [535, 992],
  G3: [580, 885],
  G5: [480, 885],

  P0: [1180,247],
  P1: [1360,247],
  P2: [1360,323],
  P3: [1400,323],
  P4: [1400,370],
  P5: [1400,414],
  P6: [1400,460],
  P7: [1400,514],
  P8: [1355,514],
  P9: [1355,590],
  P10: [1355,780],
  P11: [1355,889],
  P12: [1355,935],
  P13: [1180,935],
  P14: [1110,935],
  P15: [1000,935],
  P16: [848,935],
  P17: [650,935],
  P18: [535,935],
  P19: [480,935],
  P20: [525,590],
  P21: [772,590],
  P22: [860,590],
  P23: [1010,590],
  P24: [1130,590],
  P25: [1200,590]
};

// 直接つながっている地点を登録
const connections = [
  ["A0", "P0"],
  ["B0", "P25"],
  ["B1", "P24"],
  ["B1", "P25"],
  ["B2", "P24"],
  ["B3", "P23"],
  ["B4", "P23"],
  ["B5", "P21"],
  ["B5", "P22"],
  ["B6", "P22"],
  ["B8", "P21"],
  ["D0", "P10"],
  ["D1", "P12"],
  ["D3", "P11"],
  ["D7", "P6"],
  ["D8", "P5"],
  ["D9", "P4"],
  ["D10", "P6"],
  ["D11A", "P5"],
  ["D11B", "P4"],
  ["D12", "P3"],
  ["D13", "P3"],
  ["E0", "P20"],
  ["F0A", "P13"],
  ["F0B", "P14"],
  ["F1", "P13"],
  ["F1", "P14"],
  ["F2", "P15"],
  ["F3", "P15"],
  ["F4", "P16"],
  ["F5", "P16"],
  ["G0", "P17"],
  ["G1", "P17"],
  ["G2", "P18"],
  ["G3", "P18"],
  ["G5", "P19"],

  ["P0", "P1"],
  ["P1", "P2"],
  ["P2", "P3"],
  ["P3", "P4"],
  ["P4", "P5"],
  ["P5", "P6"],
  ["P6", "P7"],
  ["P7", "P8"],
  ["P8", "P9"],
  ["P9", "P10"],
  ["P10", "P11"],
  ["P11", "P12"],
  ["P12", "P13"],
  ["P13", "P14"],
  ["P14", "P15"],
  ["P15", "P16"],
  ["P16", "P17"],
  ["P17", "P18"],
  ["P18", "P19"],
  
  ["P20", "P21"],
  ["P21", "P22"],
  ["P22", "P23"],
  ["P23", "P24"],
  ["P24", "P25"],
  ["P25", "P9"]
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
