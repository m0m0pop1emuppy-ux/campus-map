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

//画像全体が画面に入るようにする
map.fitBounds(bounds);

//マーカーの大きさを指定する
const icons = {
  //青
  blue:L.icon({
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  iconSize: [12, 20],
  iconAnchor: [8, 26],
  popupAnchor: [0, -26]
}), //赤
 red: L.icon({
    iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png",
    iconSize: [16, 26],
    iconAnchor: [8, 26],
    popupAnchor: [0, -26]
  })
};

// 施設の情報を登録
const facilities = [
  { name: "工学部棟", x: 1400, y: 290, type: "red" },
  { name: "総合研究棟", x: 870, y: 425, type: "red" },
  { name: "理学部棟", x: 1020, y: 420, type: "red"},
  { name: "教育学部棟", x: 1010, y: 658, type: "red"},
  { name: "農学部棟", x: 710, y: 710, type: "red"},
  { name: "法学部棟", x: 530, y: 700, type: "red"},
  { name: "図書館", x: 570, y: 500, type: "blue"},
  { name: "第一食堂", x: 735, y: 380, type: "blue"},
  { name: "第三食堂", x: 1355, y: 585, type: "blue"},
  { name: "生協", x: 865, y: 600, type: "blue"}
];
// 登録した施設を地図上に表示
const markersByName = {};

  facilities.forEach(facility => {
  const marker = L.marker(
    [facility.x, facility.y],
    { icon: icons[facility.type] }
  ).addTo(map);

// マーカーをクリックすると施設名を表示
  marker.bindPopup(facility.name);

 // 施設名とマーカーを紐づける
  markersByName[facility.name] = marker;

// 総合研究棟内へ飛ぶ
  let popupContent = `<b>${facility.name}</b>`;
  if (facility.mapUrl) {
    popupContent += `
      <br>
      <a href="${facility.mapUrl}">
        建物内マップを見る
      </a>
    `;
  }
});
//検索機能
document.getElementById("searchButton").addEventListener("click", () => {
  const keyword = document
    .getElementById("searchInput")
    .value.trim();

  const message = document.getElementById("message");

  if (keyword === "") {
    message.textContent = "施設名を入力してください。";
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
    [facility.x, facility.y], 0.5  // 移動後の拡大
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
  "教育学部棟": "D",
  "おためし": "ST30",
  "農学部棟": "E",
  "法学部棟": "F",
  "図書館": "G",
  "正門": "ST1",
  "北門": "ST9",
  "西門": "ST19",
  "中門": "ST22",
  "第一食堂": "ST25",
  "旧正門": "ST31",
  "第三食堂": "ST33",
  "謎門": "ST34",
  "生協": "ST36"
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
  ST1: [230, 585], //正門
  ST2: [695, 585],
  ST3: [790, 535],
  ST4: [1000, 538], //教育学部棟前
  ST5: [1020, 538], //理学部棟前
  ST6: [1200, 545],
  ST7: [1335, 490], //工学部棟岩
  ST8: [1405, 450],
  ST9: [1750, 450], //北門
  ST10: [970, 540], //中道
  ST11: [970, 310], //理学部小道入口
  ST12: [970, 190], //工学部道入口
  ST13: [1020, 145],
  ST14: [1195, 195], //研究棟小道
  ST15: [1325, 230],
  ST16: [1335, 290], //工学部棟前
  ST17: [1160, 340],
  ST18: [1335, 350],
  ST19: [930, 130], //西門
  ST20: [520, 580],
  ST21: [520, 430],
  ST22: [505, 405], //中門
  ST23: [670, 410],
  ST24: [740, 420], //学食１入口
  ST25: [740, 380],
  ST26: [740, 560],
  ST27: [610, 585],
  ST28: [530, 585], //法学部棟前
  ST29: [710, 585], //農学部棟前
  ST30: [380, 585],
  ST31: [330, 510], //旧正門
  ST32: [1365, 470],
  ST33: [1365, 570], //第三食堂
  ST34: [1690, 120], //謎門
  ST35: [1350, 120],
  ST36: [870, 600], //生協
  ST37: [870, 535]
};

// 直接つながっている地点を登録
const connections = [
  //正門から北門
  ["ST1", "ST2"],
  ["ST1", "ST27"],
  ["ST2", "ST26"],
  ["ST2", "ST29"],
  ["ST3", "ST29"],
  ["ST26", "ST3"],
  ["ST4", "ST5"],
  ["ST5", "ST6"],
  ["ST6", "ST7"],
  ["ST7", "ST8"],
  ["ST8", "ST9"],
  ["ST20", "ST28"],
  ["ST28", "ST2"],
  //西門道
  ["ST4", "ST10"],
  ["ST3", "ST10"],
  ["ST10", "ST11"],
  ["ST11", "ST12"],
  ["ST12", "ST19"], //西門へ
  //中門道
  ["ST2", "ST20"],
  ["ST1", "ST20"],
  ["ST20", "ST21"],
  ["ST21", "ST22"],
  ["ST21", "ST23"],
  ["ST23", "ST24"], //学食１入口
  ["ST24", "B"], //総合研究棟へ
  ["ST24", "ST25"], //学食１
  ["ST24", "ST26"],
  //旧正門
  ["ST1", "ST30"],
  ["ST2", "ST30"],
  ["ST30", "ST31"],
  //小道
  ["ST12", "ST13"], //工学部小道
  ["ST13", "ST14"],
  ["ST14", "ST15"],
  ["ST15", "ST16"],
  ["ST16", "ST7"],
  ["ST10", "ST11"], //理学部小道
  ["ST11", "ST17"],
  ["ST14", "ST17"],
  ["ST17", "ST18"],
  ["ST16", "ST18"],
  //第三食堂
  ["ST7", "ST32"],
  ["ST32", "ST33"],
  ["ST8", "ST32"],
  //謎門
  ["ST15", "ST35"],
  ["ST34", "ST35"],
  //生協
  ["ST3", "ST37"],
  ["ST4", "ST37"],
  ["ST37", "ST36"],
  ["ST10", "ST37"],
  //道から建物
  ["A", "ST16"], //工学部へ
  ["ST5", "C"], //理学部へ
  ["ST4", "D"], //教育学部へ
  ["ST29", "E"], //農学部へ
  ["ST28", "F"], //法学部へ
  ["ST27", "G"] //図書館へ
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
