export enum CarCategory {
  LUXURY = 'Luxury',
  SPORT = 'Sport',
  SUV = 'SUV',
  ELECTRIC = 'Electric',
  ECONOMY = 'Economy',
  SEDAN = 'Sedan',
  TRUCK = 'Truck',
  VAN = 'Van',
  CONVERTIBLE = 'Convertible',
  COUPE = 'Coupe',
  HATCHBACK = 'Hatchback'
}

export interface Car {
  id: string;
  make: string;
  model: string;
  year: number;
  category: CarCategory;
  pricePerDay: number;
  image: string;
  images?: string[];
  description: string;
  features: string[];
  hostName: string;
  hostId?: string;
  location: string;
  rating: number;
  trips: number;
  bookedDates?: string[];
  depositAmount?: number;
  color?: string;
}

export interface Fee {
  name: string;
  amount: number;
  type: 'fixed' | 'percentage' | 'per_day';
  description: string;
}

export interface BookingDetails {
  carId: string;
  startDate: Date;
  endDate: Date;
  days: number;
  basePrice: number;
  fees: {
    insurance: number;
    cleaning: number;
    detailing: number;
    service: number;
  };
  totalPrice: number;
}
