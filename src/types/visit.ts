import { Park, Attraction, Show, Restaurant } from './db';

export interface Visit {
  id: string;
  userId: string;
  parkId: string;
  visitDate: string;
  entryTime: string;
  exitTime?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface VisitWithDetails extends Visit {
  park: Park;
  attractionVisits: AttractionVisit[];
  showVisits: ShowVisit[];
  restaurantVisits: RestaurantVisit[];
}

export interface AttractionVisit {
  id: string;
  userId: string;
  attractionId: string;
  visitId?: string;
  visitedAt: string;
  rating?: number;
  notes?: string;
  waitTime?: number;
  createdAt: string;
  updatedAt: string;
}

export interface AttractionVisitWithDetails extends AttractionVisit {
  attraction: Attraction;
  visit?: VisitWithDetails;
}

export interface ShowVisit {
  id: string;
  userId: string;
  showId: string;
  visitId?: string;
  visitedAt: string;
  rating?: number;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ShowVisitWithDetails extends ShowVisit {
  show: Show;
  visit?: VisitWithDetails;
}

export interface RestaurantVisit {
  id: string;
  userId: string;
  restaurantId: string;
  visitId?: string;
  rating?: number;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface RestaurantVisitWithDetails extends RestaurantVisit {
  restaurant: Restaurant;
  visit?: VisitWithDetails;
}

// Request types for API calls
export interface CreateVisitRequest {
  userId: string;
  parkId: string;
  visitDate: string;
  entryTime: string;
  exitTime?: string;
  notes?: string;
}

export interface UpdateVisitRequest {
  visitDate?: string;
  entryTime?: string;
  exitTime?: string;
  notes?: string;
}

export interface CreateAttractionVisitRequest {
  userId: string;
  attractionId: string;
  visitId?: string;
  visitedAt: string;
  rating?: number;
  notes?: string;
  waitTime?: number;
}

export interface CreateShowVisitRequest {
  userId: string;
  showId: string;
  visitId?: string;
  visitedAt: string;
  rating?: number;
  notes?: string;
}

export interface CreateRestaurantVisitRequest {
  userId: string;
  restaurantId: string;
  visitId?: string;
  rating?: number;
  notes?: string;
}

export interface VisitStats {
  totalVisits: {
    parks: number;
    attractions: number;
    shows: number;
    restaurants: number;
  };
  averageRatings: {
    attractions: number | null;
    shows: number | null;
    restaurants: number | null;
  };
}