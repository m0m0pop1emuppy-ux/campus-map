const width = 1080;
const height =1920;

// ① 地図を作成する
const map = L.map("map", {
  crs: L.CRS.Simple,
  minZoom: -2
});

// ② 画像全体の範囲を決める
const bounds = [
  [0, 0],
  [height, width]
];

// 画像のURLを設定
const imageUrl = "https://raw.githubusercontent.com/m0m0pop1emuppy-ux/campus-map/main/3rd_Floor_Map.png";


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
