import dayjs from 'dayjs';
import { generateRandomValue, getRandomItem, getRandomItems } from '../../helpers/common.js';

import { MockServerData } from '../../types/mock-server-data.type.js';
import { OfferGenerator } from './index.js';

export class TSVOfferGenerator implements OfferGenerator {
  constructor(private readonly mockData: MockServerData) { }

  private readonly MIN_RATING = 1;
  private readonly MAX_RATING = 5;

  private readonly NUM_AFTER_DIGIT = 1;

  private readonly MIN_BEDROOMS = 1;
  private readonly MAX_BEDROOMS = 8;

  private readonly MIN_ADULTS = 1;
  private readonly MAX_ADULTS = 8;

  private readonly MIN_PRICE = 100;
  private readonly MAX_PRICE = 100000;

  private readonly SEPARATOR = ';';

  public generate(): string {
    const title = getRandomItem<string>(this.mockData.titles);
    const description = getRandomItem<string>(this.mockData.descriptions);
    const city = getRandomItem<string>(this.mockData.cities);
    const previewImage = getRandomItem<string>(this.mockData.previewImages);
    const images = getRandomItems<string>(this.mockData.images);
    const isPremium = getRandomItem<boolean>(this.mockData.isPremium);
    const isFavorite = getRandomItem<boolean>(this.mockData.isFavorite);
    const rating = generateRandomValue(this.MIN_RATING, this.MAX_RATING, this.NUM_AFTER_DIGIT);
    const type = getRandomItem<string>(this.mockData.types);
    const bedrooms = generateRandomValue(this.MIN_BEDROOMS, this.MAX_BEDROOMS);
    const maxAdults = generateRandomValue(this.MIN_ADULTS, this.MAX_ADULTS);
    const price = generateRandomValue(this.MIN_PRICE, this.MAX_PRICE);
    const goods = getRandomItems<string>(this.mockData.goods).join(this.SEPARATOR);
    const hostName = getRandomItem<string>(this.mockData.hostNames);
    const hostEmail = getRandomItem<string>(this.mockData.hostEmails);
    const hostAvatar = getRandomItem<string>(this.mockData.hostAvatars);
    const hostPassword = getRandomItem<string>(this.mockData.hostPasswords);
    const hostType = getRandomItem<string>(this.mockData.hostTypes);
    const latitude = getRandomItem<string>(this.mockData.latitude);
    const longitude = getRandomItem<string>(this.mockData.longitude);
    const coordinates = [latitude, longitude].join(this.SEPARATOR);

    const publicationDate = dayjs(getRandomItem<string>(this.mockData.publicationDates)).toISOString();

    return [
      title, description, publicationDate,
      city, previewImage, images,
      isPremium, isFavorite, rating,
      type, bedrooms, maxAdults,
      price, goods, hostName,
      hostEmail, hostPassword, hostAvatar,
      hostType, coordinates
    ].join('\t');
  }
}
