import { WikimediaImage } from "./WikimediaImage";
import { Image } from "./Image";
import { Country } from "./Country";
import { Park } from "./db";

export interface Destination {
  id: string;
  name: string;
  slug?: string;
  city?: string;
  countryId?: string;
  latitude?: number;
  longitude?: number;
  timezone?: string;
  externalId?: string;
  logoImageId?: string;
  mainImageId?: string;
}

export interface DestinationWithImages extends Destination {
  logoImage?: WikimediaImage;
  mainImage?: WikimediaImage;
}

export interface DestinationWithDetails extends DestinationWithImages {
  country?: Country;
  parks: Park[];
}