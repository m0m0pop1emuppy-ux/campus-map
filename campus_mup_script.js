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
  facilities.forEach(facility => {
  const marker = L.marker(
    [facility.y, facility.x],
    { icon: icons[facility.type] }
  ).addTo(map);

  marker.bindPopup(facility.name);
});
