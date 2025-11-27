import { CarbonRecord, EmissionCategory, EmissionFactor, IoTDevice, User, DataSource } from '../types';

const KEYS = {
  RECORDS: 'ecotrack_records',
  DEVICES: 'ecotrack_devices',
  FACTORS: 'ecotrack_factors',
  USERS: 'ecotrack_users',
};

// Seed Data
const DEFAULT_FACTORS: EmissionFactor[] = [
  { id: 'ef1', name: 'Grid Electricity (US Avg)', category: EmissionCategory.ENERGY, factor: 0.385, unit: 'kWh' },
  { id: 'ef2', name: 'Natural Gas', category: EmissionCategory.ENERGY, factor: 2.03, unit: 'm3' },
  { id: 'ef3', name: 'Diesel Fuel', category: EmissionCategory.TRANSPORT, factor: 2.68, unit: 'L' },
  { id: 'ef4', name: 'General Waste', category: EmissionCategory.WASTE, factor: 0.5, unit: 'kg' },
];

const DEFAULT_USERS: User[] = [
  { id: 'u1', name: 'Alice Admin', role: 'Admin', email: 'alice@eco.track' },
  { id: 'u2', name: 'Bob Analyst', role: 'Analyst', email: 'bob@eco.track' },
];

const DEFAULT_DEVICES: IoTDevice[] = [
  { id: 'iot1', name: 'Main HVAC Sensor', type: 'Smart Meter', category: EmissionCategory.ENERGY, status: 'active', lastPing: Date.now(), emissionFactorId: 'ef1' },
  { id: 'iot2', name: 'Fleet GPS Tracker 01', type: 'Telematic', category: EmissionCategory.TRANSPORT, status: 'inactive', lastPing: Date.now() - 86400000, emissionFactorId: 'ef3' },
];

export const StorageService = {
  getRecords: (): CarbonRecord[] => {
    const data = localStorage.getItem(KEYS.RECORDS);
    return data ? JSON.parse(data) : [];
  },
  
  saveRecord: (record: CarbonRecord) => {
    const records = StorageService.getRecords();
    records.push(record);
    localStorage.setItem(KEYS.RECORDS, JSON.stringify(records));
  },

  getFactors: (): EmissionFactor[] => {
    const data = localStorage.getItem(KEYS.FACTORS);
    return data ? JSON.parse(data) : DEFAULT_FACTORS;
  },

  saveFactors: (factors: EmissionFactor[]) => {
    localStorage.setItem(KEYS.FACTORS, JSON.stringify(factors));
  },

  getDevices: (): IoTDevice[] => {
    const data = localStorage.getItem(KEYS.DEVICES);
    return data ? JSON.parse(data) : DEFAULT_DEVICES;
  },

  saveDevices: (devices: IoTDevice[]) => {
    localStorage.setItem(KEYS.DEVICES, JSON.stringify(devices));
  },

  getUsers: (): User[] => {
    const data = localStorage.getItem(KEYS.USERS);
    return data ? JSON.parse(data) : DEFAULT_USERS;
  },

  saveUsers: (users: User[]) => {
    localStorage.setItem(KEYS.USERS, JSON.stringify(users));
  },

  // Helper to generate a mock dataset if empty
  initializeIfNeeded: () => {
    if (!localStorage.getItem(KEYS.RECORDS)) {
      const mockRecords: CarbonRecord[] = [];
      const factors = DEFAULT_FACTORS;
      const now = Date.now();
      for (let i = 0; i < 50; i++) {
        const factor = factors[Math.floor(Math.random() * factors.length)];
        const value = Math.floor(Math.random() * 100) + 10;
        mockRecords.push({
          id: `rec_${i}`,
          timestamp: now - (i * 86400000), // Previous 50 days
          category: factor.category,
          sourceName: 'Historical Data',
          value: value,
          unit: factor.unit,
          co2e: value * factor.factor,
          dataSource: DataSource.MANUAL
        });
      }
      localStorage.setItem(KEYS.RECORDS, JSON.stringify(mockRecords));
    }
    // Initialize factors if missing
    if (!localStorage.getItem(KEYS.FACTORS)) {
      localStorage.setItem(KEYS.FACTORS, JSON.stringify(DEFAULT_FACTORS));
    }
  }
};