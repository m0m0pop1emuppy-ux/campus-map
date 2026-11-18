// 1. 各階のデータをまとめる
const floors = {
  1: window.floor1Data,
  2: window.floor2Data,
  3: window.floor3Data
};

// 現在表示している階
let currentFloor = 1;

// 経路検索後の情報
let currentPath = null;
let routeSegments = [];
let routeLines = [];

// 階段・エレベーターの移動コスト
// 仮の値。実際の通路の長さに合わせて調整する
const verticalCost = {
  stairs: 300,
  elevator: 300
};

// 2. マップの初期設定

const map = L.map("map", {
  crs: L.CRS.Simple,
  minZoom: -2
});

let imageLayer = null;

// 階数に応じてマップを表示
function displayFloor(floor) {

  const data = floors[floor];

  if (!data) {
    console.error("階のデータが見つかりません:", floor);
    return;
  }

  const bounds = [
    [0, 0],
    [data.height, data.width]
  ];

  // 前の画像を削除
  if (imageLayer) {
    map.removeLayer(imageLayer);
  }

  // 新しい階の画像を表示
  imageLayer = L.imageOverlay(
    data.imageUrl,
    bounds
  ).addTo(map);

  // 画像全体を表示
  map.fitBounds(bounds);

  currentFloor = floor;

  // 現在の階の経路を表示
  drawRouteForFloor(floor);
}

// 3. 階数切り替え

window.changeFloor = function(floor) {

  if (!floors[floor]) {
    return;
  }
  displayFloor(floor);
};

// 最初は1階を表示
displayFloor(1);

// 4. 全階の地点を統合する

// 全階の地点情報
const allRouteNodes = {};

// 全階の接続情報
const allConnections = [];

// 全階の施設情報
const allFacilities = {};

// 地点IDと階数の対応
const nodeFloors = {};


Object.entries(floors).forEach(([floor, data]) => {

  if (!data) {
    throw new Error(`${floor}階のデータがありません`);
  }

  // 地点情報を統合
  Object.entries(data.routeNodes).forEach(([id, position]) => {

    const newId = `${floor}F_${id}`;

    allRouteNodes[newId] = position;

    nodeFloors[newId] = Number(floor);

  });


  // 通路の接続情報を統合
  data.connections.forEach(([a, b]) => {

    allConnections.push([
      `${floor}F_${a}`,
      `${floor}F_${b}`,
      "corridor"
    ]);

  });


  // 施設情報を統合
  Object.entries(data.facilitiesRouteNodes).forEach(([name, node]) => {

    if (!allFacilities[name]) {
      allFacilities[name] = [];
    }
    allFacilities[name].push({
      floor: Number(floor),
      node: `${floor}F_${node}`
    });
  });
});

// 5. 階段・エレベーターの接続を追加

if (!Array.isArray(window.floorConnections)) {
  throw new Error("floorConnections.js のデータを確認してください");
}

window.floorConnections.forEach(connection => {

  const fromId =
    `${connection.fromFloor}F_${connection.fromNode}`;

  const toId =
    `${connection.toFloor}F_${connection.toNode}`;

  // 登録された地点が存在するか確認
  if (
    !allRouteNodes[fromId] ||
    !allRouteNodes[toId]
  ) {
    console.error("階間接続の地点が見つかりません:", connection);
    return;
  }

  const type = connection.type;

  // 階段・エレベーターの移動コスト
  const cost = verticalCost[type];

  if (cost === undefined) {
    console.error("接続タイプが正しくありません:", type);
    return;
  }

  // 階間の接続を追加
  allConnections.push([
    fromId,
    toId,
    type,
    cost
  ]);

});

// 6. 経路検索用ネットワークを作る

const graph = {};


// すべての地点を登録
Object.keys(allRouteNodes).forEach(id => {

  graph[id] = [];

});


// 接続情報からネットワークを作成
allConnections.forEach(connection => {

  const [a, b, type, customCost] = connection;

  let cost = customCost;

  // 同じ階の通路は座標間の距離を使用
  if (type === "corridor") {

    cost = Math.hypot(
      allRouteNodes[a][0] - allRouteNodes[b][0],
      allRouteNodes[a][1] - allRouteNodes[b][1]
    );

  }

  // 双方向に移動できるようにする
  graph[a].push({
    node: b,
    cost: cost,
    type: type
  });

  graph[b].push({
    node: a,
    cost: cost,
    type: type
  });

});

// 7. 最短経路を検索する

function findRoute(start, goal) {

  const distance = {};
  const previous = {};
  const visited = new Set();

  // 距離を初期化
  Object.keys(graph).forEach(id => {

    distance[id] = Infinity;

  });

  distance[start] = 0;


  while (true) {

    let current = null;

    // 未訪問の地点から最も近い地点を探す
    Object.keys(graph).forEach(id => {

      if (
        !visited.has(id) &&
        (
          current === null ||
          distance[id] < distance[current]
        )
      ) {
        current = id;
      }

    });


    // 到達できる地点がない場合
    if (
      current === null ||
      distance[current] === Infinity
    ) {
      break;
    }


    // 目的地に到着
    if (current === goal) {
      break;
    }


    visited.add(current);


    // 隣接する地点を調べる
    graph[current].forEach(edge => {

      const next = edge.node;

      if (visited.has(next)) {
        return;
      }

      const newDistance =
        distance[current] + edge.cost;


      // より短い経路が見つかった場合
      if (newDistance < distance[next]) {

        distance[next] = newDistance;

        previous[next] = {
          node: current,
          type: edge.type
        };

      }

    });

  }


  // 経路が存在しない場合
  if (distance[goal] === Infinity) {
    return null;
  }


  // 経路を復元
  const path = [];

  let current = goal;

  while (current !== undefined) {

    path.unshift(current);

    if (current === start) {
      break;
    }

    const prev = previous[current];

    if (!prev) {
      return null;
    }

    current = prev.node;

  }


  return {
    path: path,
    distance: distance[goal]
  };

}

// 8. 経路を階ごとに分ける

function createRouteSegments(path) {

  const segments = [];

  let currentSegment = null;


  path.forEach(id => {

    const floor = nodeFloors[id];

    const position = allRouteNodes[id];

    // Leaflet用に [y, x] に変換
    const point = [
      position[1],
      position[0]
    ];


    // 階が変わったら新しい経路を作る
    if (
      currentSegment === null ||
      currentSegment.floor !== floor
    ) {

      currentSegment = {
        floor: floor,
        points: []
      };

      segments.push(currentSegment);

    }

    currentSegment.points.push(point);

  });


  return segments;

}

// 9. 選択した階の経路を表示する

function drawRouteForFloor(floor) {

  // 前の経路線を削除
  routeLines.forEach(line => {

    map.removeLayer(line);

  });

  routeLines = [];


  if (!routeSegments.length) {
    return;
  }


  // 現在表示している階の経路だけ描画
  routeSegments
    .filter(segment => segment.floor === floor)
    .forEach(segment => {

      if (segment.points.length < 2) {
        return;
      }

      const line = L.polyline(
        segment.points,
        {
          color: "blue",
          weight: 5
        }
      ).addTo(map);

      routeLines.push(line);

    });

}

// 10. 出発地・目的地から経路検索

const startInput =
  document.getElementById("startInput");

const goalInput =
  document.getElementById("goalInput");

const routeMessage =
  document.getElementById("routeMessage");


document.getElementById("routeButton")
  .addEventListener("click", function() {

    const startName = startInput.value.trim();

    const goalName = goalInput.value.trim();


    // 入力確認
    if (!startName || !goalName) {

      routeMessage.textContent =
        "出発地と目的地を入力してください";

      return;

    }


    // 施設の登録確認
    const startFacilities = allFacilities[startName];

    const goalFacilities = allFacilities[goalName];


    if (!startFacilities || !goalFacilities) {

      routeMessage.textContent =
        "施設名が見つかりません";

      return;

    }


    if (
      startFacilities.length !== 1 ||
      goalFacilities.length !== 1
    ) {

      routeMessage.textContent =
        "同じ施設名が複数の階に登録されています";

      return;

    }


    const start = startFacilities[0];

    const goal = goalFacilities[0];


    // 同じ施設の場合
    if (
      start.floor === goal.floor &&
      start.node === goal.node
    ) {

      routeMessage.textContent =
        "出発地と目的地が同じです";

      return;

    }

    // 最短経路を検索
    const result = findRoute(
      start.node,
      goal.node
    );


    if (!result) {

      routeMessage.textContent =
        "経路が見つかりません";

      return;

    }


    // 経路を保存
    currentPath = result.path;


    // 階ごとに経路を分ける
    routeSegments = createRouteSegments(
      currentPath
    );


    // 出発地の階を最初に表示
    displayFloor(start.floor);


    // 経路を表示
    drawRouteForFloor(start.floor);


    // 経由する階数を取得
    const usedFloors = [
      ...new Set(
        currentPath.map(id => nodeFloors[id])
      )
    ];


    // 階間移動の種類を取得
    const transferTypes = [];

    for (let i = 1; i < currentPath.length; i++) {

      const a = currentPath[i - 1];
      const b = currentPath[i];

      const connection = allConnections.find(edge =>
        (
          edge[0] === a &&
          edge[1] === b
        ) ||
        (
          edge[0] === b &&
          edge[1] === a
        )
      );

      if (
        connection &&
        connection[2] !== "corridor"
      ) {

        transferTypes.push(
          connection[2] === "stairs"
            ? "階段"
            : "エレベーター"
        );

      }

    }


    const transferMessage =
      transferTypes.length > 0
        ? ` / 移動方法：${transferTypes.join(" → ")}`
        : "";


    routeMessage.textContent =
      `${start.floor}階から${goal.floor}階までの経路を表示しました。` +
      `経由階：${usedFloors.join("階 → ")}階` +
      transferMessage +
      "。他の階は階数ボタンで確認できます。";

  });

// 11. 経路消去

document.getElementById("clearRouteButton")
  .addEventListener("click", function() {

    // 経路線をすべて削除
    routeLines.forEach(line => {

      map.removeLayer(line);

    });

    routeLines = [];

    // 経路情報をリセット
    currentPath = null;

    routeSegments = [];

    routeMessage.textContent = "";

  });
