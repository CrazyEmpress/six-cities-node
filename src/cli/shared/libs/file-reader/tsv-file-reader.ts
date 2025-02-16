import { readFileSync } from 'node:fs';
import { City } from '../../types/cities-type.enum.js';
import { HousingType } from '../../types/housing-type.enum.js';
import { Offer } from '../../types/offers.type.js';
import { FileReader } from './file-reader.interface.js';

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
      .filter((row) => row.trim().length > 0)
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
      cityZoom,
      locationCoordinates,
    ] = line.split('\t');

    /** Очистка кавычек в строковых полях */
    const clean = (str: string) => str.replace(/^"|"$/g, '');

    /** Разделение координат на широту и долготу */
    const [locationLatitude, locationLongitude] = locationCoordinates.split(';').map(Number);

    return {
      id: crypto.randomUUID(), // Генерация уникального ID, если его нет в данных
      title: clean(title),
      type: type as HousingType,
      price: Number(price),
      city: {
        name: clean(cityName) as City,
        location: {
          latitude: locationLatitude,
          longitude: locationLongitude,
          zoom: Number(cityZoom),
        },
      },
      location: {
        latitude: locationLatitude,
        longitude: locationLongitude,
        zoom: Number(cityZoom),
      },
      isFavorite: isFavorite === 'true',
      isPremium: isPremium === 'true',
      rating: Number(rating),
      previewImage: clean(previewImage),
      description: clean(description),
      bedrooms: Number(bedrooms),
      goods: clean(goods).split(';'),
      host: {
        name: clean(hostName),
        email: clean(hostEmail),
        password: clean(hostPassword),
        avatarUrl: clean(hostAvatarUrl),
        isPro: hostType === 'pro',
      },
      images: clean(images).split(';'),
      maxAdults: Number(maxAdults),
      postDate: new Date(postDate),
    };
  }

  public read() {
    this.rawData = readFileSync(this.fileName, { encoding: 'utf-8' });
  }

  public toArray(): Offer[] {
    this.validateRawData();
    return this.parseRawDataToOffers();
  }
}
