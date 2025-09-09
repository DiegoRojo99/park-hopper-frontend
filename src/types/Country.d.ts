export type Country = {
  id: string;
  name: string;
  code: string; // ISO 3166-1 alpha-2 code
  flagUrl: string;
  createdAt: DateTime;
  updatedAt: DateTime;
};

export type CountryWithParksAndDestinations = Country & {
  parks: Park[];
  destinations: Destination[];
};
