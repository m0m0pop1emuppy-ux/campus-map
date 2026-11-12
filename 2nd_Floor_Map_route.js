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
  "B251": "A",
  "B252": "B",
  "B253": "C",
  "B254": "D",
  "B255": "E",
  "B256": "F",
  "B258": "G",
  "D200": "H",
  "D201": "I",
  "E260": "J",
  "F270": "K",
  "F271": "L",
  "F272": "M",
  "F273": "N",
  "F274": "O",
  "F275": "P",
  "G210": "Q",
  "入学センター": "AD",
  "教務課": "AF",
  "キャリアセンター": "AH",
  "学生談話室": "AJ",
  "体育測定室": "AM",
  "生物学実験室": "AO",
  "第一化学実験室": "AP",
  "第二化学実験室": "AQ",
  "物理学実験室": "AS",
  "物理学実験室": "AT",
  "非常勤講師控室": "AV",
  "院生会室": "AX",
  "地学実習室": "AZ",
  "地学実習室": "BA",
  "機械室": "BC"
};
// 通路上の地点を登録
const routeNodes = {
  A: [1140, 525], //B251
  B: [1160, 640], //B252
  C: [980, 525], //B253
  D: [1020, 640], //B254
  E: [780, 525], //B255
  F: [890, 640], //B256
  G: [760, 640], //B258
  H: [1400, 930], //D200
  I: [1400, 830], //D201
  J: [460, 580], //E260
  K: [1110, 980], //F270
  L: [1140, 865], //F271
  M: [990, 980], //F272
  N: [980, 865], //F273
  O: [850, 980], //F274
  P: [830, 865], //F275
  Q: [660, 980], //G210
  R: [1150, 580], //B251,B252前
  S: [1000, 580],　//B253,B254前
  T: [770, 580], //B255,B258前
  U: [890, 580], //B256前
  V: [1340, 580], //玄関前階段下
  W: [1340, 918], //D200前
  X: [1340, 830], //D201前
  Y: [1125, 918], //F270,F271前
  Z: [985, 918], //F272,F273前
  AA: [840, 918], //F274,F275前
  AB: [660, 918], //G210前
  AC: [600, 580], //E260前
  AD: [1400, 110], //入学センター
  AE: [1340, 110], //入学センター前
  AF: [1400, 215], //教務課
  AG: [1340, 215], //教務課前
  AH: [1400, 370], //キャリアセンター
  AI: [1340, 370], //キャリアセンター前
  AJ: [1400, 745], //学生談話室
  AK: [1340, 745], //学生談話室前
  AL: [1340, 260], //D棟廊下点
  AM: [580, 865], //体育測定室
  AN: [580, 918], //体育測定室,生物学実験室前
  AO: [580, 980], //生物学実験室
  AP: [600, 140], //第一化学実験室
  AQ: [540, 260], //第二化学実験室
  AR: [600, 260], //第一化学実験室,第二化学実験室前
  AS: [1000, 206], //物理学実験室
  AT: [1000, 318], //物理学実験室
  AU: [1000, 260], //物理学実験室前
  AV: [1170, 206], //非常勤講師控室
  AW: [1170, 260], //非常勤講師控室前　
  AX: [1122, 318], //院生会室
  AY: [1122, 260], //院生会室前
  AZ: [800, 206], //地学実習室
  BA: [800, 318], //地学実習室
  BB: [800, 260], //地学実習室前
  BC: [1200, 980], //機械室
  BD: [1200, 918] //機械室前
};

// 直接つながっている地点を登録
const connections = [
  //各教室から廊下
  ["A", "R"],
  ["B", "R"],
  ["C", "S"],
  ["D", "S"],
  ["E", "T"],
  ["F", "U"],
  ["G", "T"],
  ["H", "W"],
  ["I", "X"],
  ["J", "AC"],
  ["K", "Y"],
  ["L", "Y"],
  ["M", "Z"],
  ["N", "Z"],
  ["O", "AA"],
  ["P", "AA"],
  ["Q", "AB"],
  ["AD", "AE"],
  ["AF", "AG"],
  ["AH", "AI"],
  ["AJ", "AK"],
  ["AM", "AN"],
  ["AO", "AN"],
  ["AP", "AR"],
  ["AQ", "AR"],
  ["AS", "AU"],
  ["AT", "AU"],
  ["AV", "AW"],
  ["AX", "AY"],
  ["AZ", "BB"],
  ["BA", "BB"],
  ["BC", "BD"],
  //廊下から廊下
  ["V", "R"],
  ["R", "S"],
  ["S", "U"],
  ["U", "T"],
  ["T", "AC"],
  ["V", "AK"],
  ["AK", "X"],
  ["X", "W"], 
  ["W", "BD"],
  ["BD", "Y"],
  ["Y", "Z"],
  ["Z", "AA"],
  ["AA", "AB"],
  ["AE", "AG"],
  ["AG", "AL"],
  ["AL", "AI"],
  ["AI", "V"],
  ["AB", "AN"],
  ["AC", "AR"],
  ["AL", "AW"],
  ["AW", "AY"],
  ["AY", "AU"],
  ["AU", "BB"],
  ["BB", "AR"]
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
