import { Destination } from "./db";
import { WikimediaImage } from "./WikimediaImage";

export type ParkWithDetails = Park & {
  logoImage: WikimediaImage[];
  mainImage: WikimediaImage[];
  destination: Destination;
};