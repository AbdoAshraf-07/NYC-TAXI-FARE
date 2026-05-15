export type Tab = 'dashboard' | 'live' | 'batch';

export interface StatData {
  label: string;
  value: string;
  trend: number;
  unit?: string;
  type: 'yellow' | 'orange' | 'green';
}

export interface FareDistributionPoint {
  range: string;
  count: number;
  trend: number;
}

export interface TripDistancePoint {
  distance: string;
  frequency: number;
}

export interface HourlyVolumePoint {
  hour: number;
  volume: number;
}

export interface PredictionInputs {
  distance: number;
  passengers: number;
  hour: string;
  airportSurcharge: boolean;
  rushHour: boolean;
  pickupLocation: string;
  dropoffLocation: string;
}

export interface PredictionResult {
  fare: number;
  confidence: number;
  lowerBound: number;
  upperBound: number;
  breakdown: {
    base: number;
    distance: number;
    tolls: number;
    surcharges: number;
  };
}

export interface BatchJob {
  fileName: string;
  size: string;
  rows: number;
  status: 'ready' | 'processing' | 'completed';
}
