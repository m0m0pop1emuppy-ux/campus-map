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
const imageUrl = "https://raw.githubusercontent.com/m0m0pop1emuppy-ux/campus-map/main/BISL_University Map_Whole_GropeA.png";


L.imageOverlay(imageUrl, bounds).addTo(map);

// ④ 画像全体が画面に入るようにする
map.fitBounds(bounds);

// マーカーの大きさを指定する
const icons = {
  bullu:L.icon({
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  iconSize: [12, 20],
  iconAnchor: [8, 26],
  popupAnchor: [0, -26]
}),
 class: L.icon({
    iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png",
    iconSize: [16, 26],
    iconAnchor: [8, 26],
    popupAnchor: [0, -26]
  })
};

// 施設の情報を登録
const facilities = [
  { name: "工学部棟", x: 290, y: 1400, type: "class" },
  { name: "総合研究棟", x: 425, y: 870, type: "class" },
  { name: "理学部棟", x: 420, y: 1020, type: "class"},
  { name: "教育学部棟", x: 658, y: 1010, type: "class"},
  { name: "農学部棟", x: 710, y: 710, type: "class"},
  {name: "法学部棟", x: 700, y: 530, type: "class"},
  {name: "図書館", x: 500, y: 570, type: "bullu"}
];

// 登録した施設を地図上に表示
const markersByName = {};

  facilities.forEach(facility => {
  const marker = L.marker(
    [facility.y, facility.x],
    { icon: icons[facility.type] }
  ).addTo(map);

// マーカーをクリックすると施設名を表示
  marker.bindPopup(facility.name);

 // 施設名とマーカーを紐づける
  markersByName[facility.name] = marker;
});
//検索機能
document.getElementById("searchButton").addEventListener("click", () => {
  const keyword = document
    .getElementById("searchInput")
    .value.trim();

  const message = document.getElementById("message");

  if (keyword === "") {
    message.textContent = "施設名や教室名を入力してください。";
    return;
  }

  // 入力した文字を含む施設を探す
  const results = facilities.filter(facility =>
    facility.name.includes(keyword)
  );

  if (results.length === 0) {
    message.textContent = "該当する施設が見つかりません。";
    return;
  }

  // 最初に見つかった施設へ移動
  const facility = results[0];

  map.setView(
    [facility.y, facility.x], 0.5  // 移動後の拡大
  );

  // 該当施設のマーカーを開く
  markersByName[facility.name].openPopup();

  message.textContent =
    results.length > 1
      ? `${results.length}件見つかりました。最初の施設を表示しています。`
      : `${facility.name}`;
});
// 入力欄
const startInput =
  document.getElementById("startInput");

const goalInput =
  document.getElementById("goalInput");

// 経路の初期値
let routeLine = null;
 // 施設名と通路上の地点を対応させる
const facilitiesRouteNodes = {
  "工学部棟": "A",
  "総合研究棟": "B",
  "理学部棟": "C",
  "おためし": "V",
  "農学部棟": "E",
  "正門": "O",
  "北門": "Q"
};
// 通路上の地点を登録
const routeNodes = {
  A: [1400, 290], //工学部棟
  B: [870, 425], //総合研究棟
  C: [1020, 420], //理学部棟
  D: [1010, 658], //教育学部棟
  E: [710, 710], //農学部棟
  F: [530, 700], //法学部棟
  G: [570, 500], //図書館
  H: [1335, 290], //工学部棟前
  I: [1335, 490], //工学部棟岩
  J: [1200, 545], 
  K: [1020, 545], //理学部棟前
  L: [1000, 545],
  M: [750, 545],
  N: [695, 580],
  O: [230, 580], //正門
  P: [1405, 465],
  Q: [1750, 465], //北門
  R: [970, 310], //中道
  S: [970, 540],
  T: [970, 190], //工学部道
  U: [1020, 145],
  V: [1195, 195], //研究棟小道
  W: [1325, 230]
};

// 直接つながっている地点を登録
const connections = [
  //正門から北門
  ["I", "J"],
  ["J", "K"],
  ["K", "L"],
  ["L", "M"],
  ["M", "N"],
  ["N", "O"],
  ["P", "I"],
  ["Q", "P"],
  //大通り
  ["L", "S"],
  ["S", "R"],
  ["R", "T"],
  //小道
  ["H", "I"], //工学部小道
  ["T", "U"],
  ["U", "V"],
  ["V", "W"],
  ["W", "H"],
  //道から建物
  ["A", "H"], //工学部入口
  ["K", "C"], //理学部へ
  ["F", "D"] //教育学部へ
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
