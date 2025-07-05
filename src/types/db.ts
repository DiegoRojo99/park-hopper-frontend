
export type ParkGroup = {
  id: number;
  name: string;
};

export type ParkGroupWithParks = {
  id: number;
  name: string;
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
};

export type ParkWithGroup = {
  id: number;
  name: string;
  country: string;
  continent: string;
  latitude: number;
  longitude: number;
  timezone: string;
  group: ParkGroup;
};

export type ParkWithLands = {
  id: number;
  name: string;
  country: string;
  continent: string;
  latitude: number;
  longitude: number;
  timezone: string;
  lands: Land[];
};

export type ParkWithLandsAndRides = {
  id: number;
  name: string;
  country: string;
  continent: string;
  latitude: number;
  longitude: number;
  timezone: string;
  lands: LandWithRides[];
};

export type Land = {
  id: number;
  name: string;
  parkId: number;
};

export type LandWithRides = {
  id: number;
  name: string;
  parkId: number;
  rides: Ride[];
};

export type LandWithPark = {
  id: number;
  name: string;
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

export type RideWithLand = {
  id: number;
  name: string;
  isOpen: boolean;
  waitTime: number;
  lastUpdated: Date;
  land: LandWithPark;
};