import fs from "fs";
import axios from "axios";

// ⚠️ Dán API Key Pexels của bạn vào đây:
const PEXELS_API_KEY = "OP5fPQD0r8oK0CsTSi1PEgGqmhlc27mKEKqxUFtTtSKpqnPfhsVoUvOt";

const INPUT_FILE = "fashion_all.json";
const OUTPUT_FILE = "fashion_all_updated.json";

// 🔍 Hàm tìm ảnh từ Pexels
async function searchImages(query, perPage = 5) {
  const res = await axios.get("https://api.pexels.com/v1/search", {
    headers: { Authorization: PEXELS_API_KEY },
    params: { query, per_page: perPage },
  });
  return res.data.photos.map((p) => p.src.large);
}

// 🚀 Hàm chính
async function main() {
  const data = JSON.parse(fs.readFileSync(INPUT_FILE, "utf-8"));

  for (const product of data) {
    const query = `${product.brand} ${product.subcategory || product.type}`;
    console.log(`🔎 Đang tìm ảnh cho: ${product.name} (${query})`);

    try {
      const images = await searchImages(query, 8);
      if (images.length >= 4) {
        product.images = images.slice(0, 4);
        product.thumbnail = images[0];
        console.log(`✅ Cập nhật ảnh cho ${product.name}`);
      } else {
        console.warn(`⚠️ Không đủ ảnh cho ${product.name}`);
      }
    } catch (err) {
      console.error(`❌ Lỗi khi tìm ảnh cho ${product.name}:`, err.message);
    }

    // ⏱️ Giới hạn để tránh bị khóa API
    await new Promise((r) => setTimeout(r, 1000));
  }

  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(data, null, 2));
  console.log(`🎉 Hoàn tất! File mới: ${OUTPUT_FILE}`);
}

main();
