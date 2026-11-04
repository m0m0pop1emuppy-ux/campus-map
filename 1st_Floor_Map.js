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
const imageUrl = "https://raw.githubusercontent.com/m0m0pop1emuppy-ux/campus-map/main/1st_Floor_Map.png";


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
  { name: "学生なんでも相談室　特別支援サポートルーム", x: 490, y: 230, type: "class"},
  { name: "学生支援相談ルーム", x: 610, y: 560, type: "class"},
  { name: "教務課", x: 530, y: 750, type: "class"},
  { name: "学生支援課", x: 530, y: 1030, type: "class"},
  { name: "ALSOK学生談話室", x: 610, y: 1310, type: "class"},
  { name: "小会議室", x: 490, y: 1670, type: "class"},
  { name: "大会議室", x: 290, y: 1670, type: "class"}
];

// 登録した施設を地図上に表示
  facilities.forEach(facility => {
  const marker = L.marker(
    [facility.y, facility.x],
    { icon: icons[facility.type] }
  ).addTo(map);

  marker.bindPopup(facility.name);
});
