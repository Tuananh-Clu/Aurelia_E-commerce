import fs from "fs";
import fetch from "node-fetch";
const PEXELS_API_KEY = "OP5fPQD0r8oK0CsTSi1PEgGqmhlc27mKEKqxUFtTtSKpqnPfhsVoUvOt"; // 👉 thay bằng API key Pexels của bạn
const headers = { Authorization: PEXELS_API_KEY };

// Hàm tìm ảnh từ Pexels
async function searchImages(query, perPage = 5) {
  const url = `https://api.pexels.com/v1/search?query=${encodeURIComponent(
    query
  )}&per_page=${perPage}`;
  const res = await fetch(url, { headers });
  if (!res.ok) {
    console.error("Error:", res.status, await res.text());
    return [];
  }
  const data = await res.json();
  return data.photos.map((p) => p.src.large);
}

async function main() {
const raw = fs.readFileSync(
    "D:/Frontend/Aurelia/Aurelia/src/assets/DataMock/",
    "utf-8"
  );
  const products = JSON.parse(raw);

  const fixed = [];
  for (const product of products) {
    const query = `${product.brand} ${product.subcategory}`; // ví dụ: "Gucci dress"
    console.log("🔍 Searching images for:", query);

    let images = await searchImages(query, 5);

    // fallback nếu chưa đủ ảnh
    if (images.length < 5) {
      const fallback = await searchImages(product.brand, 5);
      images = [...images, ...fallback].slice(0, 5);
    }

    if (images.length > 0) {
      product.thumbnail = images[0];
      product.images = images.slice(0, 5);
    } else {
      product.thumbnail = "";
      product.images = [];
    }

    fixed.push(product);

    // delay nhỏ để tránh giới hạn API
    await new Promise((r) => setTimeout(r, 1000));
  }

  fs.writeFileSync(
    "fashion_womens_100_fixed.json",
    JSON.stringify(fixed, null, 2),
    "utf-8"
  );

  console.log("✅ File fashion_womens_100_fixed.json đã được tạo!");
}

main();
