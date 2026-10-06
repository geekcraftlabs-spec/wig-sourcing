export type HairType = "human" | "futura";
export type LaceType = "5x5" | "13x4" | "13x6";

export interface PriceEntry {
  id: string;
  shopId: string;
  hairType: HairType;
  laceType: LaceType;
  texture: string;
  size: number;
  colorCode: string;
  price: number;
  bulkPrice: number | null;
  bulkQuantity: number | null;
  note: string | null;
  updatedAt: string;
}

export interface Shop {
  id: string;
  name: string;
  location: string | null;
  staff: string | null;
  whatsapp: string | null;
  notes: string | null;
  createdAt: string;
}