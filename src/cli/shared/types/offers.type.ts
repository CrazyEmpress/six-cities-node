import { Host } from './host.type.js';
import { HousingType } from './housing-type.enum.js';
import { Location } from './location.type.js';
import { City } from './cities-type.enum.js';
import { Goods } from './goods-type.enum.js';

export type Offer = {
  title: string;
  description: string;
  postDate: Date;
  city: {
    name: City;
    location: Location;
  };
  previewImage: string;
  images: string[];
  isPremium: boolean;
  isFavorite: boolean;
  rating: number;
  type: HousingType;
  bedrooms: number;
  maxAdults: number;
  price: number;
  goods: Goods[];
  host: Host;
  location: Location;
}
