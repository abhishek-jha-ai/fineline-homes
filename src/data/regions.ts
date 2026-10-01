import type { StaticImageData } from "next/image";
import { images } from "./images";

/**
 * Service regions.
 *
 * `offices`, `contacts` and `communities` are intentionally empty — they render
 * automatically once real information is added, so no placeholder text ships.
 */

export type RegionId = "pa" | "ny" | "nc";

export interface RegionOffice {
  name: string;
  address?: string;
  phone?: string;
  hours?: string;
}

export interface RegionContact {
  name: string;
  role?: string;
  phone?: string;
  email?: string;
}

export interface RegionCommunity {
  name: string;
  city?: string;
  url?: string;
}

export interface Region {
  id: RegionId;
  name: string;
  shortName: string;
  /** Short label used in chips and the mobile header. */
  abbr: string;
  headline: string;
  blurb: string;
  image: StaticImageData;
  imageAlt: string;
  offices: RegionOffice[];
  contacts: RegionContact[];
  communities: RegionCommunity[];
}

export const regions: Region[] = [
  {
    id: "pa",
    name: "Pennsylvania",
    shortName: "Pennsylvania",
    abbr: "PA",
    headline: "Building new homes in Pennsylvania",
    blurb:
      "Whether you already own land or are still searching, our team can walk you through home plans and next steps for building in Pennsylvania.",
    image: images.exteriorFarmhouseThreeCar,
    imageAlt: "Two-story farmhouse-style new home with a three-car garage at dusk",
    offices: [],
    contacts: [],
    communities: [],
  },
  {
    id: "ny",
    name: "Southern New York",
    shortName: "Southern NY",
    abbr: "NY",
    headline: "Building new homes in Southern New York",
    blurb:
      "Explore plans suited to how you want to live, then talk with our team about building your new home in Southern New York.",
    image: images.exteriorStoneGable,
    imageAlt: "Stone and board-and-batten new home with lit windows at sunset",
    offices: [],
    contacts: [],
    communities: [],
  },
  {
    id: "nc",
    name: "North Carolina — Triad",
    shortName: "NC Triad",
    abbr: "NC",
    headline: "Building new homes in the North Carolina Triad",
    blurb:
      "Find a plan that fits your lifestyle and start a conversation about building in the Triad region of North Carolina.",
    image: images.exteriorCraftsmanPorch,
    imageAlt: "Craftsman-style new home with a timber-framed front porch at sunset",
    offices: [],
    contacts: [],
    communities: [],
  },
];

export function getRegion(id: RegionId | null | undefined) {
  return regions.find((r) => r.id === id) ?? null;
}
