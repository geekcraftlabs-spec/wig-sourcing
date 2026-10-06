import { HairType, LaceType } from "@/types";

export interface ColorDef {
  code: string;
  name: string;
  group: "core" | "extended" | "futura";
}

export const COLORS: ColorDef[] = [
  { code: "1B", name: "Natural Off-Black", group: "core" },
  { code: "2", name: "Darkest Brown", group: "core" },
  { code: "4", name: "Dark Brown", group: "core" },
  { code: "27", name: "Honey Blonde", group: "core" },
  { code: "30", name: "Auburn", group: "core" },
  { code: "99J", name: "Burgundy", group: "core" },
  { code: "350", name: "Copper / Ginger", group: "core" },
  { code: "613", name: "Platinum Blonde", group: "core" },
  { code: "4/27", name: "Highlight", group: "core" },
  { code: "1", name: "Jet Black", group: "extended" },
  { code: "33", name: "Dark Auburn", group: "extended" },
  { code: "1B/30", name: "Ombre Black → Auburn", group: "extended" },
  { code: "1B/27", name: "Ombre Black → Honey", group: "extended" },
  { code: "1B/99J", name: "Ombre Black → Burgundy", group: "extended" },
  { code: "1B/613", name: "Ombre Black → Platinum", group: "extended" },
  { code: "Red", name: "Statement Red", group: "extended" },
  { code: "Grey", name: "Silver / Grey", group: "extended" },
  { code: "1B/350", name: "Ombre Black → Copper", group: "futura" },
  { code: "Pink", name: "Pastel Pink", group: "futura" },
  { code: "Lilac", name: "Lilac", group: "futura" },
  { code: "Fuchsia", name: "Fuchsia", group: "futura" },
  { code: "Turquoise", name: "Turquoise", group: "futura" },
  { code: "Rose Gold", name: "Rose Gold", group: "futura" },
  { code: "Ash Blonde", name: "Ash Blonde", group: "futura" },
];

export const SIZES = [8, 10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30, 32];

export const LACE_TYPES: { id: LaceType; label: string; desc: string }[] = [
  { id: "5x5", label: "5x5 Closure", desc: "Small patch, top-front. One main part. Beginner-friendly." },
  { id: "13x4", label: "13x4 Frontal", desc: 'Ear-to-ear, 4" deep. Full hairline coverage.' },
  { id: "13x6", label: "13x6 Frontal", desc: 'Ear-to-ear, 6" deep. Deep side parts, braids, pulled-back styles.' },
];

export const HAIR_TYPES: { id: HairType; label: string; desc: string }[] = [
  { id: "human", label: "Human Hair", desc: "100% human hair. Can be dyed, bleached, heat-styled." },
  { id: "futura", label: "Futura", desc: "Heat-resistant Japanese fiber. Up to 210°C. Realistic look." },
];

export interface TextureDef {
  id: string;
  label: string;
  family: "curl" | "straight";
  popular: boolean;
}

export const TEXTURES: TextureDef[] = [
  { id: "body-wave", label: "Body Wave", family: "curl", popular: true },
  { id: "deep-wave", label: "Deep Wave", family: "curl", popular: true },
  { id: "water-wave", label: "Water Wave", family: "curl", popular: true },
  { id: "loose-wave", label: "Loose Wave", family: "curl", popular: true },
  { id: "body-curl", label: "Body Curl", family: "curl", popular: false },
  { id: "jerry-curl", label: "Jerry Curl", family: "curl", popular: false },
  { id: "kinky-curl", label: "Kinky Curl", family: "curl", popular: false },
  { id: "bone-straight", label: "Bone Straight", family: "straight", popular: true },
  { id: "silky-straight", label: "Silky Straight", family: "straight", popular: true },
  { id: "yaki-straight", label: "Yaki Straight", family: "straight", popular: false },
  { id: "kinky-straight", label: "Kinky Straight", family: "straight", popular: false },
];