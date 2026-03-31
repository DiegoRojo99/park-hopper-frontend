import { EntityType, LiveDataStatus, ShowTimes } from './db';

export interface Bookmark {
  id: string;
  userId: string;
  entityId: string;
  entityType: EntityType;
  createdAt: string;
  updatedAt: string;
}

// Legacy interface for backward compatibility
export interface BookmarkLegacy {
  destinationId: string | null;
  entityType: EntityType;
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

export type BookmarkEntityType = 'DESTINATION' | 'PARK' | 'ATTRACTION' | 'SHOW' | 'RESTAURANT' | 'SHOP';