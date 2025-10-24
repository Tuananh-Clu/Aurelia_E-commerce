import fs from "fs";

const products = JSON.parse(fs.readFileSync("D:/Frontend/Aurelia/Aurelia/src/assets/DataMock/fashion_womens_100.json", "utf8"));
const shops = JSON.parse(fs.readFileSync("c:/Users/TuanANh/Downloads/shops_with_random_fashion_products_v2.json", "utf8"));

// Tạo map { name: id }
const nameToId = new Map();
for (const p of products) {
  nameToId.set(p.name.trim().toLowerCase(), p.id);
}

// Duyệt qua tất cả shop
for (const shop of shops) {
  for (const prod of shop.products) {
    const matchId = nameToId.get(prod.name.trim().toLowerCase());
    if (matchId) prod.productId = matchId;
  }
}

// Xuất lại file mới
fs.writeFileSync("shops_updated.json", JSON.stringify(shops, null, 2), "utf8");

console.log("✅ Đã cập nhật productId cho tất cả shop. Kết quả lưu vào shops_updated.json");
