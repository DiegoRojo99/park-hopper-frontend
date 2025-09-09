import { Destination } from "./db";
import { WikimediaImage } from "./WikimediaImage";

export type Park = {
  id: string;
  name: string;
  slug: string;
  destinationId: string;
  latitude: number;
  longitude: number;
  timezone: string;
  externalId: string;
  logoImageId: string;
  mainImageId: string;
};

export type ParkWithDetails = Park & {
  logoImage: WikimediaImage;
  mainImage: WikimediaImage;
  destination: Destination;
};

export type ParkWithChildren = ParkWithDetails & {
  attractions: Attraction[];
  shows: Show[];
  restaurants: Restaurant[];
};

export type ParkWithChildren = ParkWithDetails & {
  attractions: Attraction[];
  shows: Show[];
  restaurants: Restaurant[];
};

export type LivePark = ParkWithDetails & {
  live: LiveParkData | null;
  schedule: ParkSchedule | null;
  status?: 'OPERATING' | 'CLOSED';
};

export type LiveParkData = {
  attractions: LiveAttraction[];
  shows: LiveShow[];
  restaurants: LiveRestaurant[];
};

export interface ParkSchedule {
  parkId: string;
  schedule: ParkScheduleItem[];
}

export interface ParkScheduleItem {
  date: string;
  type: ScheduleType;
  openingTime: string;
  closingTime: string;
}