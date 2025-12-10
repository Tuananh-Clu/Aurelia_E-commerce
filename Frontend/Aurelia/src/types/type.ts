export interface Clients {
  id: string;
  email: string;
  name: string;
  role: string;
  point: number;
  tier: string;
  avatar: string;
  ngayTaoTaiKhoan: string;
  sanPhamYeuThich: Product[];
  donHangCuaBan:Cart[],
  soDoNgDUng:Measure,
  lichSuCuocHen:AppointmentCustomer|null,
  thongTinDatHang:DiaChi[]
  soDt: string;
  address: string;
}

export interface Product {
  id: string;
  name: string;
  type: string;
  subcategory: string;
  brand: string;
  origin: string;
  price: number;
  description: string;
  rating: number;
  stock: number;
  createdAt: string;
  updatedAt: string;
  thumbnail: string;
  images: string[];
  material: string;
  variants: Variant[];
  sold: number;
  discountValue:number
  discountType:string
  season:string
}

interface Variant {
  color: string;
  sizes: Size[];
}

interface Size {
  size: string;
  quantity: number;
}

export type ProductStore = {
  productId: string;
  name: string;
  brand: string;
  sold: number;
  variants: Variant[];
};

export type Shop = {
  shopId: string;
  shopName: string;
  products: ProductStore[];
  owner: string;
  address: string;
  openingHours: string;
  phone: string;
  services: string[];
  city: string;
  appointmentServices: appointmentServicess[];
  notifycation:any[]
};
export type appointmentServicess = {
  name: string;
  duration: string;
  description: string;
  price: string;
};
export type Cart = {
  Itemid: string;
  name: string;
  price: number;
  thumnail: string;
  color: string;
  size: string;
  quantity: number;
  dateBuy: string;
};
export type updateTrackingOrder={
  updateTime:string,
  lat:number|undefined,
  lon:number|undefined,
}
export type order = {
  orderId: string;
  name: string;
  email: string;
  status: string;
  phone: string;
  address: string;
  ngayTaoDon:string,
  voucherUsed:Coupon[]|null,
  lat:number|undefined,
  ion:number|undefined
  payment: string;
  tracking: updateTrackingOrder|undefined
  product: Cart[];
};
export type Measure = {
  vai: string;
  nguc: string;
  eo: string;
  hong: string;
  chieuCao: string;
};
export type ProductAppoinment = {
  id: string;
  name: string;
  thumbnail: string;
  size?: string;
  price: number;
};

export type Appointment = {
  id: string;
  shopId: string | undefined;
  itemName: string | undefined;
  itemImage: string | undefined;
  shopName: string | undefined;
  customerId?: string | undefined;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  service: string;
  date: string;
  duration: number;
  slot: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  notes?: string;
};
export type AppointmentCustomer = {
  id: string;
  shopName: string | undefined;
  Address: string | undefined;
  itemName: string | undefined;
  itemImage: string | undefined;
  service: string;
  date: string;
  slot: string;
  duration: number;
  status: string;
  createdAt: string;
  notes: string | undefined;
};
export type filterSLot={
  slot:string,
  duration:number
}
export interface DiaChi {
  hoVaTen: string;
  diaChi: string;
  soDT: string;
  email: string;
}
export type MainBanner = {
  id: string;
  linkUrl: string;
  mainTitle: string;
  h1?: string;
  pagaraph?: string;
  textInButton: string;
  active: boolean;
  layout: "A" | "B" | "C" | "D" | "E";
  colorMainTitle: string;
  colorText: string;
};
export type StoryBanner = {
  id: string;
  linkUrl: string;
  mainTitle: string;
  h1?: string;
  h2?: string;
  pagaraph?: string;
  active: boolean;
  layout: "A" | "B" | "C" | "D";
  colorMainTitle: string;
  colorText: string;
};
export interface ProductRef {
  id: string;
}

export interface SeasonalAttributes {
  colors: string[];
  materials: string[];
  mood: string;
  temperature: string;
}

export interface Season {
  id: string;
  slug: string;
  name: string;
  slogan: string;
  description: string;
  banner: string;
  seasonalAttributes: SeasonalAttributes;
  products: ProductRef[];
  active: boolean;
  rate: number;
  views: number;
}
export interface Coupon {
  id: string;                  
  code: string;            
  ngayBatDau: string;          
  ngayKetThuc: string;       
  phamViApDung?: string[] | null;
  giaTri?: number ; 
  moTa?: string | null;    
  giaTriDeApDung?: number | null; 
  typeCoupon?: "order" | "ship" | null;
  dieuKienApDung?: string | null; 
  isActive: boolean;             
  soLuong: number;               
  reuse: string;  
  loaiGiam:string;              
}
