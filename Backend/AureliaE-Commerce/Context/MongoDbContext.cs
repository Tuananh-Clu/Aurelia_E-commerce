using AureliaE_Commerce.Model;
using AureliaE_Commerce.Model.Banner;
using AureliaE_Commerce.Model.CouponProperty;
using AureliaE_Commerce.Model.Shop;
using MongoDB.Driver;

namespace AureliaE_Commerce.Context
{

    public class MongoDbContext
    {
        public readonly IMongoDatabase mongoDatabase;
        public MongoDbContext(IMongoDatabase mongoDatabases)
        {
            mongoDatabase = mongoDatabases;
        }
        public IMongoCollection<Client> Client => mongoDatabase.GetCollection<Client>("KhachHang");
        public IMongoCollection<Product> SanPham => mongoDatabase.GetCollection<Product>("SanPham");
        public IMongoCollection<Shop> Shop => mongoDatabase.GetCollection<Shop>("Shop");
        public IMongoCollection<ShopAccount> ShopAccount => mongoDatabase.GetCollection<ShopAccount>("ShopAccount");
        public IMongoCollection<AdminAccount> AdminAccount => mongoDatabase.GetCollection<AdminAccount>("AdminAccount");
        public IMongoCollection<Coupon> MaGiamGia => mongoDatabase.GetCollection<Coupon>("MaGiamGia");
        public IMongoCollection<MainBanner> MainBanner => mongoDatabase.GetCollection<MainBanner>("BannerHomePage");
        public IMongoCollection<StoryBanner> StoryBanner => mongoDatabase.GetCollection<StoryBanner>("StoryBanner");
        public IMongoCollection<MaGiamGia> MaGiamGiaVoucher => mongoDatabase.GetCollection<MaGiamGia>("Voucher");
        public IMongoCollection<LuxuryCollection> SeasonCollection => mongoDatabase.GetCollection<LuxuryCollection>("SeasonCollection");
    }
}
