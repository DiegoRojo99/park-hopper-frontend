import { Destination } from "./db";
import { WikimediaImage } from "./WikimediaImage";

// Base interface for any entity's live data
export interface LiveEntityData {
  id: string;
  name: string;
  status: 'OPERATING' | 'DOWN' | 'CLOSED' | 'REFURBISHMENT' | 'AVAILABLE' | 'UNAVAILABLE';
  lastUpdated: number;
}

export interface Schedule {
  date: string;
  openingTime: string;
  closingTime: string;
  status: string;
}

// Specific live data interfaces
export interface ShowSchedule extends Schedule {
  times: string[];
}

export interface LiveRestaurantData extends LiveEntityData {
  schedule: Schedule[];
}

export interface StaticEntityData {
  id: string;
  name: string;
  slug?: string;
  externalId?: string;
  latitude?: number;
  longitude?: number;
  timezone?: string;
}

export interface StaticParkData extends StaticEntityData {
  destinationId?: string;
  destination?: Destination;
  logoImage?: WikimediaImage;
  mainImage?: WikimediaImage;
  city?: string;
  countryId?: string;
  country?: Country;
}

export interface StaticAttractionData extends StaticEntityData {
  parkId?: string;
  destinationId?: string;
  type?: string;
  image?: WikimediaImage;
}

export interface StaticShowData extends StaticEntityData {
  parkId?: string;
  destinationId?: string;
  type?: string;
  image?: WikimediaImage;
}

export interface StaticRestaurantData extends StaticEntityData {
  parkId?: string;
  destinationId?: string;
  cuisines?: string[];
  type?: string;
  image?: WikimediaImage;
}