export enum EmissionCategory {
  ENERGY = 'Energy',
  TRANSPORT = 'Transport',
  WASTE = 'Waste',
  PROCESS = 'Process',
}

export enum DataSource {
  MANUAL = 'Manual',
  IOT = 'IoT Sensor',
}

export interface CarbonRecord {
  id: string;
  timestamp: number;
  category: EmissionCategory;
  sourceName: string; // e.g., "Fleet Vehicle 1", "Main Grid"
  value: number; // Raw consumption value (e.g., kWh, Liters)
  unit: string;
  co2e: number; // Calculated CO2 equivalent in kg
  dataSource: DataSource;
}

export interface IoTDevice {
  id: string;
  name: string;
  type: string;
  category: EmissionCategory;
  status: 'active' | 'inactive' | 'error';
  lastPing: number;
  emissionFactorId: string;
}

export interface EmissionFactor {
  id: string;
  name: string;
  category: EmissionCategory;
  factor: number; // kg CO2e per unit
  unit: string;
}

export interface User {
  id: string;
  name: string;
  role: 'Admin' | 'Analyst' | 'Viewer';
  email: string;
}

export type ViewState = 'dashboard' | 'manual-entry' | 'iot' | 'reports' | 'master-data' | 'users';
