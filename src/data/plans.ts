import type { StaticImageData } from "next/image";
import { images } from "./images";
import type { RegionId } from "./regions";

/**
 * HOME PLAN DATA — SAMPLE CONTENT
 * ------------------------------------------------------------------
 * These plans are illustrative placeholders for the website concept.
 * Names, specs, styles and region availability are NOT Fine Line Homes
 * data. Replace this array with real plan information before launch,
 * then set `PLANS_ARE_SAMPLE` to false to remove the on-page notice.
 */
export const PLANS_ARE_SAMPLE = true;

export type PlanStyle = "Modern Farmhouse" | "Craftsman" | "Traditional" | "Transitional";
export type PlanStories = 1 | 2;

export interface HomePlan {
  id: string;
  name: string;
  image: StaticImageData;
  imageAlt: string;
  beds: number;
  baths: number;
  /** Approximate heated square footage. */
  sqft: number;
  stories: PlanStories;
  style: PlanStyle;
  garage: number;
  regions: RegionId[];
  featured: boolean;
  summary: string;
  highlights: string[];
}

export const planStyles: PlanStyle[] = ["Modern Farmhouse", "Craftsman", "Traditional", "Transitional"];

export const plans: HomePlan[] = [
  {
    id: "pinehurst",
    name: "The Pinehurst",
    image: images.exteriorFarmhouseThreeCar,
    imageAlt: "The Pinehurst sample plan: two-story modern farmhouse exterior with three-car garage",
    beds: 4,
    baths: 3,
    sqft: 2450,
    stories: 2,
    style: "Modern Farmhouse",
    garage: 3,
    regions: ["pa", "ny", "nc"],
    featured: true,
    summary:
      "A welcoming two-story farmhouse with an open kitchen and great room at its heart, and generous bedrooms upstairs.",
    highlights: ["Open kitchen & great room", "Covered front porch", "Upstairs owner's suite", "Three-car garage"],
  },
  {
    id: "hartford",
    name: "The Hartford",
    image: images.exteriorFarmhouseSunset,
    imageAlt: "The Hartford sample plan: farmhouse exterior with stone accents and timber porch",
    beds: 4,
    baths: 2.5,
    sqft: 2320,
    stories: 2,
    style: "Modern Farmhouse",
    garage: 2,
    regions: ["pa", "ny"],
    featured: true,
    summary:
      "Classic farmhouse proportions with a timber-framed entry, flexible main-level living and four bedrooms up.",
    highlights: ["Timber-framed entry", "Flex room on main level", "Walk-in pantry", "Two-car garage"],
  },
  {
    id: "carson",
    name: "The Carson",
    image: images.exteriorCraftsmanPorch,
    imageAlt: "The Carson sample plan: craftsman-style home with gabled timber porch",
    beds: 3,
    baths: 2,
    sqft: 1980,
    stories: 1,
    style: "Craftsman",
    garage: 2,
    regions: ["pa", "nc"],
    featured: true,
    summary:
      "Comfortable single-level living with craftsman character, a vaulted great room and an easy flow to the back patio.",
    highlights: ["Single-level living", "Vaulted great room", "Split-bedroom layout", "Covered rear patio"],
  },
  {
    id: "whitmore",
    name: "The Whitmore",
    image: images.exteriorStoneGable,
    imageAlt: "The Whitmore sample plan: large transitional home with stone gables",
    beds: 4,
    baths: 3.5,
    sqft: 3120,
    stories: 2,
    style: "Transitional",
    garage: 3,
    regions: ["pa", "ny", "nc"],
    featured: true,
    summary:
      "A spacious plan for growing households, with a main-level guest suite, formal dining and a bonus room upstairs.",
    highlights: ["Main-level guest suite", "Bonus room", "Formal dining", "Three-car garage"],
  },
  {
    id: "ashford",
    name: "The Ashford",
    image: images.planVariantA,
    imageAlt: "The Ashford sample plan: modern farmhouse exterior at dusk",
    beds: 3,
    baths: 2.5,
    sqft: 2180,
    stories: 1,
    style: "Modern Farmhouse",
    garage: 2,
    regions: ["nc", "pa"],
    featured: false,
    summary:
      "Single-story farmhouse living with an owner's suite away from secondary bedrooms and a large mudroom drop zone.",
    highlights: ["Single-level living", "Mudroom & drop zone", "Owner's suite retreat", "Open dining & kitchen"],
  },
  {
    id: "bellamy",
    name: "The Bellamy",
    image: images.planVariantB,
    imageAlt: "The Bellamy sample plan: traditional two-story home with stone and siding",
    beds: 5,
    baths: 3.5,
    sqft: 3400,
    stories: 2,
    style: "Traditional",
    garage: 3,
    regions: ["pa", "ny"],
    featured: false,
    summary:
      "Room for everyone — five bedrooms, a study off the foyer and a family-sized kitchen that opens to the great room.",
    highlights: ["Five bedrooms", "Private study", "Large family kitchen", "Second-floor laundry"],
  },
  {
    id: "linden",
    name: "The Linden",
    image: images.planVariantD,
    imageAlt: "The Linden sample plan: craftsman-style home with welcoming porch",
    beds: 2,
    baths: 2,
    sqft: 1680,
    stories: 1,
    style: "Craftsman",
    garage: 2,
    regions: ["ny", "nc"],
    featured: false,
    summary:
      "An efficient, easy-living single-story plan with a flexible den and a bright, open main living space.",
    highlights: ["Single-level living", "Flexible den", "Open great room", "Low-maintenance footprint"],
  },
  {
    id: "sterling",
    name: "The Sterling",
    image: images.planVariantC,
    imageAlt: "The Sterling sample plan: two-story transitional home with three-car garage",
    beds: 4,
    baths: 3.5,
    sqft: 2860,
    stories: 2,
    style: "Transitional",
    garage: 3,
    regions: ["pa", "ny", "nc"],
    featured: false,
    summary:
      "Clean transitional lines with a two-story foyer, a main-level office and an upstairs loft for everyday flexibility.",
    highlights: ["Two-story foyer", "Main-level office", "Upstairs loft", "Three-car garage"],
  },
];

export const featuredPlans = plans.filter((p) => p.featured);

export function formatBaths(baths: number) {
  return Number.isInteger(baths) ? String(baths) : baths.toFixed(1);
}

export function formatSqft(sqft: number) {
  return sqft.toLocaleString("en-US");
}
