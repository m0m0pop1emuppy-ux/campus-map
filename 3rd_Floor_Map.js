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

//temp
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
  {name: "F375", x: 885, y: 848, type: "class" },
  {name: "F373", x: 885, y: 1000, type: "class" },
  {name: "F371", x: 885, y: 1160, type: "class"},
  {name: "G315", x: 885, y: 480, type: "class"},
  {name: "G313", x: 885, y: 580, type: "class"},
  {name: "G311", x: 885, y: 650, type: "class"},
  {name: "D303", x: 889, y: 1420, type: "class"},
  {name: "E260", x: 577, y: 455, type: "class"},
  {name: "B355", x: 524, y: 790, type: "class"},
  {name: "B353", x: 524, y: 1010, type: "class"},
  {name: "B351", x: 526, y: 1194, type: "class"},
  {name: "B358", x: 642, y: 772, type: "class"},
  {name: "B356", x: 642, y: 912, type: "class"},
  {name: "B354", x: 642, y: 1050, type: "class"},
  {name: "B352", x: 642, y: 1150, type: "class"},
  {name: "B350", x: 642, y: 1200, type: "class"},
  {name: "G312", x: 992, y: 535, type: "class"},
  {name: "G310", x: 992, y: 638, type: "class"},
  {name: "F374", x: 1005, y: 866, type: "class"},
  {name: "F372", x: 1010, y: 1020, type: "class"},
  {name: "F370B", x: 1005, y: 1110, type: "class"},
  {name: "F370A", x: 1005, y: 1180, type: "class"},
  {name: "人文学部学務係", x: 970, y: 1420, type: "class"},
  {name: "創生学部学務係", x: 970, y: 1420, type: "class"},
  {name: "留学交流推進課", x: 780, y: 1420, type: "class"},
  {name: "合同資料室", x: 247, y: 1030, type: "class"},
  {name: "D313", x: 290, y: 1420, type: "class"},
  {name: "D312", x: 323, y: 1440, type: "class"},
  {name: "D311b", x: 370, y: 1440, type: "class"},
  {name: "D311a", x: 414, y: 1440, type: "class"},
  {name: "D310", x: 460, y: 1440, type: "class"},
  {name: "D307", x: 464, y: 1360, type: "class"},
  {name: "D308", x: 415, y: 1360, type: "class"},
  {name: "D309", x: 371, y: 1360, type: "class"},
];

// 登録した施設を地図上に表示
  facilities.forEach(facility => {
  const marker = L.marker(
    [facility.y, facility.x],
    { icon: icons[facility.type] }
  ).addTo(map);

  marker.bindPopup(facility.name);
});
//temp end 
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
  A0: [1420, 780],  
  B0: [1200, 642], 
  B1: [1194, 526], 
  B2: [11150, 642], 
  B3: [1010, 524], 
  B4: [1050, 642], 
  B5: [790, 524], 
  B6: [912, 642],
  B8: [772, 642],
  D0: [1420, 780], 
  D1: [1420, 970],
  D3: [,],
  D7: [1360, 464],
  D8: [1360, 415],
  D9: [1360, 371],
  D10: [1440, 460],
  D11A: [1440, 414],
  D11B: [1440, 370],
  D12: [1440, 323],
  D13: [1420, 290],
  E0: [455, 577],
  F0A: [1110, 1105], 
  F0B: [1180, 1105],
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

  A0F:[,],
  B0F: [1200, 642], 
  B1F: [1194, 526], 
  B2F: [11150, 642], 
  B3F: [1010, 524], 
  B4F: [1050, 642], 
  B5F: [790, 524], 
  B6F: [912, 642],
  B8F: [772, 642],
  D0F: [1420, 780], 
  D1F: [1420, 970],
  D3F: [,],
  D7F: [1360, 464],
  D8F: [1360, 415],
  D9F: [1360, 371],
  D10F: [1440, 460],
  D11AF: [1440, 414],
  D11BF: [1440, 370],
  D12F: [1440, 323],
  D13F: [1420, 290],
  E0F: [455, 577],
  F0AF: [1110, 1105], 
  F0BF: [1180, 1105],
  F1F: [1160, 885], 
  F2F: [1020, 1010], 
  F3F: [1000, 885],
  F4F: [866, 1005],
  F5F: [848, 885], 
  G0F: [638, 992],
  G1F: [650, 885], 
  G2F: [535, 992],
  G3F: [580, 885],
  G5F: [480, 885],
};

// 直接つながっている地点を登録
const connections = [
  ["A0", "A0F"],
  ["B0", "B0F"],
  ["B1", "B1f"],
  ["B2", "B2F"],
  ["B3", "B3F"],
  ["B4", "B4F"],
  ["B5", "B5F"],
  ["B6", "B6F"],
  ["B8", "B8F"],
  ["D0", "R"],
  ["D1", "T"],
  ["D3", "I"],
  ["D7", "U"],
  ["D8", "V"],
  ["D9", "W"],
  ["D10", "H"],
  ["D11A", "H"],
  ["D11B", "C"],
  ["D12", "D"],
  ["D13", "R"],
  ["E0", "T"],
  ["E0A", "I"],
  ["E0B", "U"],
  ["F1", "V"],
  ["F2", "W"],
  ["F3", "H"],
  ["F4", "H"],
  ["F5", "C"],
  ["G0", "D"],
  ["G1", "D"],
  ["G2", "D"],
  ["G3", "D"],
  ["G5", "D"],
  
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
