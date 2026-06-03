import { ImageSourcePropType } from 'react-native';
import { VehicleType } from '../types/booking';

export const VEHICLE_IMAGES: Record<VehicleType, ImageSourcePropType> = {
  saloon: require('../../assets/cars/bmw.png'),
  executive: require('../../assets/cars/mercedes-s-class.png'),
  mpv: require('../../assets/cars/mercedes-wagon.png'),
};
