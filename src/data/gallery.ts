import type { StaticImageData } from "next/image";
import { images } from "./images";

export type GalleryCategory = "exteriors" | "kitchens" | "living" | "details";

export const galleryFilters: { id: "all" | GalleryCategory; label: string }[] = [
  { id: "all", label: "All" },
  { id: "exteriors", label: "Exteriors" },
  { id: "kitchens", label: "Kitchens" },
  { id: "living", label: "Living" },
  { id: "details", label: "Details" },
];

export interface GalleryItem {
  id: string;
  image: StaticImageData;
  alt: string;
  caption: string;
  category: GalleryCategory;
  /** "feature" = 2×2 tile, "wide" = 2×1 tile. */
  span?: "feature" | "wide";
}

export const galleryItems: GalleryItem[] = [
  {
    id: "estate-sunset",
    image: images.heroSunsetEstate,
    alt: "Stone and board-and-batten home with landscape lighting at sunset",
    caption: "Stone, timber and board-and-batten at golden hour",
    category: "exteriors",
    span: "feature",
  },
  {
    id: "kitchen-island",
    image: images.kitchenIsland,
    alt: "Bright kitchen with a large charcoal island, pendant lights and wood floors",
    caption: "Open kitchen with oversized island",
    category: "kitchens",
  },
  {
    id: "timber-porch",
    image: images.detailTimberPorch,
    alt: "Timber-framed front porch with lantern lighting and stone columns",
    caption: "Timber-framed entry porch",
    category: "details",
  },
  {
    id: "farmhouse-three-car",
    image: images.exteriorFarmhouseThreeCar,
    alt: "Two-story farmhouse with stone accents and a three-car garage",
    caption: "Farmhouse exterior with three-car garage",
    category: "exteriors",
  },
  {
    id: "dining",
    image: images.livingDiningRoom,
    alt: "Dining area with farmhouse table and wall of windows next to the kitchen",
    caption: "Dining space open to the kitchen",
    category: "living",
  },
  {
    id: "pendants",
    image: images.detailPendantLights,
    alt: "Matte black pendant lights above a kitchen island with a wood range hood",
    caption: "Pendant lighting and wood range hood",
    category: "details",
  },
  {
    id: "stone-gable",
    image: images.exteriorStoneGable,
    alt: "Home with stone gables and warm interior lighting at dusk",
    caption: "Stone gables and a covered front porch",
    category: "exteriors",
    span: "wide",
  },
  {
    id: "range-wall",
    image: images.kitchenRangeWall,
    alt: "Kitchen range wall with stone backsplash and glass-front cabinets",
    caption: "Stone backsplash and glass-front cabinetry",
    category: "kitchens",
  },
  {
    id: "chimney",
    image: images.detailStoneChimney,
    alt: "Stone chimney rising above a gabled roofline at sunset",
    caption: "Natural stone chimney",
    category: "details",
  },
  {
    id: "open-concept",
    image: images.livingOpenConcept,
    alt: "Open-concept kitchen and dining area with exposed wood beams",
    caption: "Open-concept living with exposed beams",
    category: "living",
  },
  {
    id: "craftsman-porch",
    image: images.exteriorCraftsmanPorch,
    alt: "Craftsman-style home with timber porch and landscaped front yard",
    caption: "Craftsman exterior with timber porch",
    category: "exteriors",
  },
  {
    id: "entry",
    image: images.detailEntryPorch,
    alt: "Front entry with glass double doors, lanterns and stone columns",
    caption: "Glass double doors and lantern lighting",
    category: "details",
  },
  {
    id: "farmhouse-sunset",
    image: images.exteriorFarmhouseSunset,
    alt: "Farmhouse-style home with white siding and dark roof at sunset",
    caption: "Modern farmhouse at sunset",
    category: "exteriors",
  },
  {
    id: "garage",
    image: images.detailGarageDoors,
    alt: "Carriage-style garage doors with gooseneck lighting",
    caption: "Carriage-style garage doors",
    category: "details",
  },
];
