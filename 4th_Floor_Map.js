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
  "B450": "B40",
  "B451": "B41",
  "B452": "B42",
  "B453": "B43",
  "B454": "B44",
  "B455": "B45",
  "B456": "B46",
  "B457": "B47",
  "G410": "G40",
  "G415": "G45",
  "階段A上": "S41",
  "階段A下": "S42",
  "階段B上": "S43",
  "階段B下": "S44",
  "階段G上": "S45",
  "階段G下": "S46",
  "エレベーターA": "E41",
  "エレベーターB": "E42"
};
// 通路上の地点を登録
const routeNodes = {
  B40: [1240, 625], 
  B41: [1280, 535], 
  B42: [1030, 625], 
  B43: [1140, 535], 
  B44: [830, 625], 
  B45: [950, 535], 
  B46: [715, 625],
  B47: [750,535],
  G40: [580,985],
  G45: [550,870],
  S41: [1365, 125],
  S42: [660, 230],
  S43: [1410, 625],
  S44: [680, 625],
  S45: [765, 985],
  S46: [480, 985],
  E41: [1365, 230],
  E42: [1365, 625],

  P40: [715, 585],
  P41: [885,585],
  P42: [1085, 585], 
  P43: [1285, 585],
  P44: [500, 945], 
  P45: [500, 895],
  P46: [1365, 585],
  P47: [1410, 585],
  P48: [680, 585],
  P49: [480, 920],
  P4A: [660, 920],
  P4B: [660, 960], //G410前
  P4C: [765, 960],
  P4D: [660, 190],
  P4E: [1365, 190]
};

// 直接つながっている地点を登録
const connections = [
  ["B40", "P43"],
  ["B41", "P43"],
  ["B42", "P42"],
  ["B43", "P42"],
  ["B44", "P41"],
  ["B45", "P41"],
  ["B46", "P40"],
  ["B47", "P40"],
  ["G40", "P44"],
  ["G45", "P45"],
  ["S41","P4E"],
  ["E41","P4E"],
  ["S42","P4D"],
  ["S43","P47"],
  ["E42","P46"],
  ["S44","P48"],
  ["S46","P49"],
  ["S45","P4C"],
  ["G45", "P4A"],
  ["G40", "P4B"],
  
  ["P40", "P41"],
  ["P41", "P42"],
  ["P42", "P43"],
  ["P4D","P4E"],
  ["P44", "P45"],
  ["P47", "P46"],
  ["P46", "P43"],
  ["P40", "P48"],
  ["P4B", "P4C"],
  ["P4A", "P4B"],
  ["P44", "P49"],
  ["P45", "P49"],
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
