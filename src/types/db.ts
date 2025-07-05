
export type ParkGroup = {
  id: number;
  name: string;
};

export type ParkGroupWithParks = ParkGroup & {
  parks: Park[];
};

export type Park = {
  id: number;
  name: string;
  country: string;
  continent: string;
  latitude: number;
  longitude: number;
  timezone: string;
  groupId: number;
  image_url?: string; // Optional field for park image URL
};

export type ParkWithGroup = Park & {
  group: ParkGroup;
};

export type ParkWithLands = Park & {
  lands: LandWithRides[];
};

export type ParkWithLandsAndRides = Park & {
  lands: LandWithRides[];
};

export type ParkWithGroupAndLands = Park & {
  group: ParkGroup;
  lands: LandWithRides[];
};

export type Land = {
  id: number;
  name: string;
  parkId: number;
};

export type LandWithRides = Land & {
  rides: Ride[];
};

export type LandWithPark = Land & {
  park: ParkWithGroup;
};

export type Ride = {
  id: number;
  name: string;
  isOpen: boolean;
  waitTime: number;
  lastUpdated: Date;
  landId: number;
};

export type RideWithLand = Ride & {
  land: LandWithPark;
};