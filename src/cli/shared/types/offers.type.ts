import { Host } from './host.type.js';
import { HousingType } from './housing-type.enum.js';
import { Location } from './location.type.js';
import { CityData } from './city-data.type.js';
import { OfferId } from './offer-id.type.js';

export type Offer = {
  id: OfferId;
  title: string;
  type: HousingType;
  price: number;
  city: CityData;
  location: Location;
  isFavorite: boolean;
  isPremium: boolean;
  rating: number;
  previewImage: string;
  description: string;
  bedrooms: number;
  goods: string[];
  host: Host;
  images: string[];
  maxAdults: number;
  postDate: Date;
}
