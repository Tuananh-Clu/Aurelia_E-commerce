import type React from "react";

/** CheckOut feature types - copy from shared where used */

export type Cart = {
  itemid: string;
  name: string;
  price: number;
  thumnail: string;
  color: string;
  size: string;
  quantity: number;
  dateBuy: string;
};

export type updateTrackingOrder = {
  updateTime: string;
  lat: number | undefined;
  lon: number | undefined;
};

export type Coupon = {
  id: string;
  code: string;
  ngayBatDau: string;
  ngayKetThuc: string;
  phamViApDung?: string[] | null;
  giaTri?: number;
  moTa?: string | null;
  giaTriDeApDung?: number | null;
  typeCoupon?: "order" | "ship" | null;
  dieuKienApDung?: string | null;
  isActive: boolean;
  soLuong: number;
  reuse: string;
  loaiGiam: string;
};

export type order = {
  orderId: string;
  name: string;
  email: string;
  status: string;
  phone: string;
  address: string;
  ngayTaoDon: string;
  voucherUsed: Coupon[] | null;
  lat: number | undefined;
  ion: number | undefined;
  payment: string;
  tracking: updateTrackingOrder | undefined;
  product: Cart[];
};

export interface DiaChi {
  hoVaTen: string;
  diaChi: string;
  soDT: string;
  email: string;
}

export type ListCouponProps = {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  dataOrder: Cart[];
  order: order | undefined;
};

export type CouponCardProps = {
  type: "order" | "ship";
};
