/* ENTITY TYPES */
export type GeneralEntity = {
  id: string;
  name: string;
  slug: string | null;
  
  latitude?: number;
  longitude?: number;
  timezone?: string;
  externalId?: string;
}

export type ChildrenEntity = GeneralEntity & {
  destinationId?: string | null;
  parkId?: string | null;
}

/* DESTINATION TYPES */
export type Destination = GeneralEntity

export type DestinationWithParks = Destination & {
  parks: Park[];
};

export type DestinationWithParksAndChildren = DestinationWithParks & {
  attractions?: Attraction[];
  shows?: Show[];
  restaurants?: Restaurant[];
}

/* PARK TYPES */
export type Park = GeneralEntity & {
  destinationId: string | null;
};

export type ParkWithDestination = Park & {
  destination: Destination;
}

export type ParkWithDestinationAndChildren = ParkWithDestination & {
  attractions?: Attraction[];
  shows?: Show[];
  restaurants?: Restaurant[];
};

export type EntityType = 'DESTINATION' | 'PARK' | 'ATTRACTION' | 'RESTAURANT' | 'SHOW';
export type LiveDataStatus = 'CLOSED' | 'DOWN' | 'OPERATING';
export type LiveDataElement = {
  id: string;
  name: string;
  entityType: EntityType;
  parkId: string;
  externalId: string;
  queue: {
    STANDBY: { waitTime: number | null; };
    PAID_RETURN_TIME?: {
      price: { amount: number, currency: string, formatted: string },
      state: string,
      returnEnd: string,
      returnStart: string
    } | null;
  };
  status: LiveDataStatus;
  lastUpdated: string;
};

export type LivePark = ParkWithDestinationAndChildren & {
  liveData?: LiveDataElement[];
};

/* CHILDREN TYPES */
export type Attraction = ChildrenEntity
export type Show = ChildrenEntity
export type Restaurant = ChildrenEntity & {
  cuisines?: string[];
}