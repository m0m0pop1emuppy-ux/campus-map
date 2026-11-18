const width = 1080;
const height = 1920;

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
const imageUrl = "https://raw.githubusercontent.com/m0m0pop1emuppy-ux/campus-map/main/1st_Floor_Map_color.png";

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
  "学生なんでも相談室　特別支援サポートルーム": "C10",
  "学生支援相談ルーム": "A10",
  "教務課": "A11",
  "学生支援課": "A12",
  "ALSOK学生談話室": "A13",
  "小会議室": "D10",
  "大会議室": "D11",
  "階段1": "S11",
  "階段2": "S12",
  "エレベーター": "E11"
};
// 通路上の地点を登録
const routeNodes = {
  A10: [560, 610], 
  A11: [750, 530], 
  A12: [1030, 530],
  A13: [1310, 610],
  C10: [230, 510], 
  D10: [1670, 490], 
  D11: [1670, 290], 
  S11: [1470, 450],
  S12: [465, 580],
  E11: [1470, 620],
  
  P10: [580, 510], 
  P11: [580, 350], 
  P12: [750, 345], 
  P13: [1030, 350], 
  P14: [1230, 350],
  P15: [1310, 510],
  P16: [1590, 510],
  P17: [1590, 350],
  P18: [1470, 510],
  P19: [465, 510]
};

// 直接つながっている地点を登録
const connections = [
  ["A10", "P10"],
  ["A11", "P12"],
  ["A12", "P13"],
  ["A13", "P15"],
  ["D10", "P16"],
  ["D11", "P17"],
  ["S11", "P18"],
  ["E11", "P18"],
  ["P16", "P18"],
  ["P15", "P18"],
  ["S12", "P19"],
  ["P10", "P19"],
  
  
  ["C10", "P19"],
  ["P10", "P11"],
  ["P10", "P12"],
  ["P12", "P13"],
  ["P13", "P14"],
  ["P14", "P15"],
  ["P16", "P17"]
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
