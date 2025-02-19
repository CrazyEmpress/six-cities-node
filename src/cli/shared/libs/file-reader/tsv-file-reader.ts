import { readFile } from 'node:fs/promises';
import { City } from '../../types/cities-type.enum.js';
import { HousingType } from '../../types/housing-type.enum.js';
import { Offer } from '../../types/offers.type.js';
import { FileReader } from './file-reader.interface.js';
import { Goods } from '../../types/goods-type.enum.js';
import { UserType } from '../../types/user-type.enum.js';

export class TSVFileReader implements FileReader {
  private rawData = '';

  constructor(
    private readonly fileName: string,
  ) { }

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
    const [locationLatitude, locationLongitude] = locationCoordinates.split(';').map(Number);

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
      goods: goods.split(';') as Goods[],
      host: {
        name: hostName,
        email: hostEmail,
        password: hostPassword,
        avatarUrl: hostAvatarUrl,
        hostType: hostType as UserType,
      },
      images: images.split(';'),
      maxAdults: Number(maxAdults),
      postDate: new Date(postDate),
    };
  }

  public async read(): Promise<void> {
    this.rawData = await readFile(this.fileName, { encoding: 'utf-8' });
  }

  public toArray(): Offer[] {
    this.validateRawData();
    return this.parseRawDataToOffers();
  }
}
