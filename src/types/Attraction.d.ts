import { WikimediaImage } from "./WikimediaImage";
import { Image } from "./Image";
import { Park, Destination } from "./db";

export interface Attraction {
  id: string;
  name: string;
  slug?: string;
  parkId?: string;
  destinationId?: string;
  latitude?: number;
  longitude?: number;
  timezone?: string;
  externalId?: string;
  themeparksApiId?: string;
  imageId?: string;
}

export interface AttractionWithImages extends Attraction {
  image?: WikimediaImage;
  images: Image[];
}

export interface AttractionWithDetails extends AttractionWithImages {
  park?: Park;
  destination?: Destination;
}