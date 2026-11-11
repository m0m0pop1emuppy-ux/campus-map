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
const imageUrl = "https://raw.githubusercontent.com/m0m0pop1emuppy-ux/campus-map/main/4th_Floor_Map_color.png";

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
  "B450": "B0",
  "B451": "B1",
  "B452": "B2",
  "B453": "B3",
  "B454": "B4",
  "B455": "B5",
  "B456": "B6",
  "B457": "B7",
  "G410": "G0",
  "G415": "G5"
};
// 通路上の地点を登録
const routeNodes = {
  B0: [1240, 625], 
  B1: [1280, 535], 
  B2: [1030, 625], 
  B3: [1140, 535], 
  B4: [830, 625], 
  B5: [950, 535], 
  B6: [715, 625],
  B7: [750,535],
  G0: [580,985],
  G5: [550,870],
  
  B0F: [1240, 585], 
  B1F: [1280, 585], 
  B2F: [1030, 585], 
  B3F: [1140, 585], 
  B4F: [830, 585], 
  B5F: [950, 585], 
  B6F: [715, 585],
  B7F: [750,585],
  G0F: [680,985],
  G5F: [615,910],

  P0: [680,910]
};

// 直接つながっている地点を登録
const connections = [
  ["B0", "B0F"],
  ["B1", "B1F"],
  ["B2", "B2F"],
  ["B3", "B3F"],
  ["B4", "B4F"],
  ["B5", "B5F"],
  ["B6", "B6F"],
  ["B7", "B7F"],
  ["G0", "G0F"],
  ["G5", "G5F"],
  
  ["B6F", "B7F"],
  ["B7F", "B4F"],
  ["B4F", "B5F"],
  ["B5F", "B2F"],
  ["B2F", "B3F"],
  ["B3F", "B0F"],
  ["B0F", "B1F"],
  ["G5F", "P0"],
  ["P0", "G0F"]
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
