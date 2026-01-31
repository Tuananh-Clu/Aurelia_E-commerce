/** FormAuth feature types - copy from shared where used */

export type LoginFormProps = {
  type: "admin" | "user";
};

export interface Clients {
  id: string;
  email: string;
  name: string;
  role: string;
  point: number;
  tier: string;
  avatar: string;
  ngayTaoTaiKhoan: string;
  soDt: string;
  address: string;
}
