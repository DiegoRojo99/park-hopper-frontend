import { WikimediaImage } from "./WikimediaImage";
import { Image } from "./Image";
import { Park, Destination } from "./db";

export interface Restaurant {
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
  cuisines?: string[];
}

export interface RestaurantWithImages extends Restaurant {
  image?: WikimediaImage;
  images: Image[];
}

export interface RestaurantWithDetails extends RestaurantWithImages {
  park?: Park;
  destination?: Destination;
}