export type BookmarkEntityType = 'ATTRACTION' | 'SHOW' | 'RESTAURANT' | 'PARK';

export interface Bookmark {
  destinationId: string | null;
  entityType: BookmarkEntityType;
  externalId: string;
  id: string;
  latitude: number;
  longitude: number;
  name: string;
  parkId: string;
  showtimes?: ShowTimes[];
  waitTime?: number | null;
  status?: LiveDataStatus;
  timezone: string;
}