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
