import { WikimediaImage } from "./WikimediaImage";
import { Image } from "./Image";
import { Park, Destination } from "./db";

export interface Show {
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

export interface ShowWithImages extends Show {
  image?: WikimediaImage;
  images: Image[];
}

export interface ShowWithDetails extends ShowWithImages {
  park?: Park;
  destination?: Destination;
}