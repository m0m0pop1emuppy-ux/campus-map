const width = 1080;
const height = 1920;

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
const imageUrl = "https://raw.githubusercontent.com/m0m0pop1emuppy-ux/campus-map/main/2nd_Floor_Map_color.png";


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
  { name: "B251", x: 525, y: 1140, type: "class"},
  { name: "B252", x: 640, y: 1160, type: "class"},
  { name: "B253", x: 525, y: 980, type: "class"},
  { name: "B254", x: 640, y: 1020, type: "class"},
  { name: "B255", x: 525, y: 780, type: "class"},
  { name: "B256", x: 640, y: 890, type: "class"},
  { name: "B258", x: 640, y: 760, type: "class"},
  { name: "D200", x: 930, y: 1400, type: "class"},
  { name: "D201", x: 830, y: 1400, type: "class"},
  { name: "E260", x: 580, y: 460, type: "class"},
  { name: "F270", x: 980, y: 1110, type: "class"},
  { name: "F271", x: 865, y: 1140, type: "class"},
  { name: "F272", x: 980, y: 990, type: "class"},
  { name: "F273", x: 865, y: 980, type: "class"},
  { name: "F274", x: 980, y: 850, type: "class"},
  { name: "F275", x: 865, y: 830, type: "class"},
  { name: "G210", x: 980, y: 660, type: "class"},
  { name: "入学センター", x: 110, y: 1400, type:"class"},
  { name: "教務課", x: 215, y: 1400, type:"class"},
  { name: "キャリアセンター", x: 370, y: 1400, type:"class"},
  { name: "学生談話室", x: 745, y: 1400, type:"class"},
  { name: "体育測定室", x: 865, y: 580, type:"class"},
  { name: "生物学実験室", x: 980, y: 580, type:"class"},
  { name: "第一化学実験室", x: 140, y: 600, type: "class"},
  { name: "第二化学実験室", x: 260, y: 540, type: "class"}
];

// 登録した施設を地図上に表示
  facilities.forEach(facility => {
  const marker = L.marker(
    [facility.y, facility.x],
    { icon: icons[facility.type] }
  ).addTo(map);

  marker.bindPopup(facility.name);
});
