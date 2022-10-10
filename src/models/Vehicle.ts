import firestore, { FirebaseFirestoreTypes } from '@react-native-firebase/firestore'
export enum VechicleType {
    Car,
    Motorcycle,
    Bicycle,
    PublicTransport,
    Legs
}

export enum VehiclePowerSourceType {
    Gas,
    Ethanol,
    Calories
}

export default class Vehicle {
    id: string;
    createdAt: Date;
    name: string;
    type: VechicleType;
    powerSourceType: VehiclePowerSourceType;
    averageConsumeMultiplier: number;
}

export type VehicleProp = {
  id: string;
  name: string;
  type: string;
  created_at: FirebaseFirestoreTypes.Timestamp;
}