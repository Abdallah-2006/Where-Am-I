export type TransitMode = 'all' | 'rail' | 'metro' | 'train' | 'monorail' | 'lrt' | 'bus' | 'public_bus' | 'brt' | 'microbus';
export type StationMode = Exclude<TransitMode, 'all'>;
export type TransportGroup = 'rail' | 'public_bus' | 'microbus' | 'other';

// بيانات تعريفية عن أي مدينة مضافة للتطبيق.
export interface CityInfo {
  id: string;
  name: string;
  nameEn: string;
  governorate: string;
  centerLat: number;
  centerLng: number;
  defaultZoom?: number;
}

export interface OfficialTariffItem {
  id: string;
  category: string;
  city?: string;
  from: string;
  to: string;
  officialFare: number;
  fareDisplay: string;
  status: string;
  terminalFrom?: string;
  notes?: string;
  level?: 1 | 2 | 3;
}

export interface TerminalLocation {
  id: string;
  name: string;
  city: string;
  region: string;
  serves: string[];
  lat: number;
  lng: number;
  notes?: string;
  operatingHours?: string;
  isMainHub?: boolean;
}

export interface TaxiMeterRate {
  baseFare: number;
  baseDistanceKm: number;
  perKmRate: number;
  firstHourWaitRate: number;
  additionalHourWaitRate: number;
  effectiveDate: string;
}

export interface Station {
  id: string;
  name: string;
  nameEn: string;
  city: string;
  mode: StationMode;
  lines: string[];
  lat: number;
  lng: number;
  x?: number;
  y?: number;
  isHub?: boolean;
  transfers?: string[];
  fareInfo?: string;
  departures?: {
    destination: string;
    platform: string;
    time: string;
    frequency: string;
    price: string;
  }[];
  image?: string;
  description?: string;
}

export interface TransitWaypoint {
  name: string;
  type: 'terminal' | 'station' | 'crossroad' | 'landmark' | 'bridge';
  lat: number;
  lng: number;
  description?: string;
}

export interface TransitLine {
  id: string;
  name: string;
  mode: StationMode;
  color: string;
  lineCode: string;
  origin: string;
  destination: string;
  fareRange: string;
  stationIds: string[];
  frequency: string;
  streetPathDescription?: string;
  streetsList?: string[];
  landmarks?: string[];
  waypoints?: TransitWaypoint[];
  detailedPathLatLngs: [number, number][];
  operatingHours?: string;
}

export interface RouteLeg {
  mode: StationMode;
  lineName: string;
  lineCode?: string;
  fromStation: string;
  toStation: string;
  stopsCount: number;
  durationMins: number;
  fare: number;
  color: string;
  stopsList: string[];
  streetDirections?: string[];
  legPathLatLngs?: [number, number][];
}

export interface CalculatedRoute {
  id: string;
  fromStation: string;
  toStation: string;
  totalDurationMins: number;
  totalStops: number;
  totalFare: number;
  legs: RouteLeg[];
  pathCoords: { x: number; y: number }[];
  pathLatLngs?: [number, number][];
  transfersCount: number;
  type: 'fastest' | 'cheapest' | 'fewer_transfers';
  streetGuide?: string[];
}

export interface FavoriteRoute {
  id: string;
  title: string;
  from: string;
  to: string;
  duration: string;
  transfers: {
    name: string;
    mode: StationMode;
    color: string;
  }[];
}

export interface TravelHistoryItem {
  id: string;
  from: string;
  to: string;
  date: string;
  details: string;
  mode: StationMode;
  fare: number;
  status: 'مكتملة' | 'قيد التنفيذ' | 'ملغاة';
}

export interface UserProfileData {
  name: string;
  email: string;
  avatar: string;
  tier: string;
  balance: number;
  monthlyTrips: number;
  carbonSavedKg: number;
  weeklyActivity: { day: string; trips: number }[];
  favoriteRoutes: FavoriteRoute[];
  travelHistory: TravelHistoryItem[];
}
