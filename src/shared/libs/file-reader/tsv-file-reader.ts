import EventEmitter from 'node:events';

import { FileReader } from './file-reader.interface.js';

import { City } from '../../types/cities-type.enum.js';
import { HousingType } from '../../types/housing-type.enum.js';
import { Offer } from '../../types/offers.type.js';
import { Goods } from '../../types/goods-type.enum.js';
import { UserType } from '../../types/user-type.enum.js';

export class TSVFileReader extends EventEmitter implements FileReader {
  private rawData = '';
  private readonly SEPARATOR = ';';

  constructor(
    private readonly fileName: string,
  ) {
    super();
  }

  private validateRawData(): void {
    if (!this.rawData) {
      throw new Error('File was not read');
    }
  }

  private parseRawDataToOffers(): Offer[] {
    return this.rawData
      .split('\n')
      .filter((row) => row.trim())
      .map((line) => this.parseLineToOffer(line));
  }

  private parseLineToOffer(line: string): Offer {
    const [
      title,
      description,
      postDate,
      cityName,
      previewImage,
      images,
      isFavorite,
      isPremium,
      rating,
      type,
      bedrooms,
      maxAdults,
      price,
      goods,
      hostName,
      hostEmail,
      hostPassword,
      hostAvatarUrl,
      hostType,
      locationCoordinates,
    ] = line.split('\t');

    /** Разделение координат на широту и долготу */
    const [locationLatitude, locationLongitude] = locationCoordinates.split(this.SEPARATOR).map(Number);
    if (Number.isNaN(new Date(postDate).getTime())) {
      throw new Error('Post date is not valid');
    }

    return {
      title: title,
      type: type as HousingType,
      price: Number(price),
      city: {
        name: cityName as City,
        location: {
          latitude: locationLatitude,
          longitude: locationLongitude,
        },
      },
      location: {
        latitude: locationLatitude,
        longitude: locationLongitude,
      },
      isFavorite: isFavorite === 'true',
      isPremium: isPremium === 'true',
      rating: Number(rating),
      previewImage: previewImage,
      description: description,
      bedrooms: Number(bedrooms),
      goods: goods.split(this.SEPARATOR) as Goods[],
      host: {
        name: hostName,
        email: hostEmail,
        password: hostPassword,
        avatarUrl: hostAvatarUrl,
        hostType: hostType as UserType,
      },
      images: images.split(this.SEPARATOR),
      maxAdults: Number(maxAdults),
      postDate: new Date(postDate),
    };
  }

  public async read(): Promise<void> {

  }

  public toArray(): Offer[] {
    this.validateRawData();
    return this.parseRawDataToOffers();
  }
}
