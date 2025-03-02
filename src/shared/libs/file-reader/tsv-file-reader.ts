import EventEmitter from 'node:events';

import { FileReader } from './file-reader.interface.js';

import { City } from '../../types/cities-type.enum.js';
import { HousingType } from '../../types/housing-type.enum.js';
import { Offer } from '../../types/offers.type.js';
import { Goods } from '../../types/goods-type.enum.js';
import { UserType } from '../../types/user-type.enum.js';
import { createReadStream } from 'node:fs';

export class TSVFileReader extends EventEmitter implements FileReader {
  private CHUNK_SIZE = 16384;
  private readonly SEPARATOR = ';';

  constructor(
    private readonly fileName: string,
  ) {
    super();
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
    const readStream = createReadStream(this.fileName, {
      highWaterMark: this.CHUNK_SIZE,
      encoding: 'utf-8',
    });

    let remainigData = '';
    let nextLinePosition = -1;
    let importedRowCount = 0;

    for await (const chunk of readStream) {
      remainigData += chunk.toString();

      while ((nextLinePosition = remainigData.indexOf('\n')) > 0) {
        const completeRow = remainigData.slice(0, nextLinePosition + 1);
        remainigData = remainigData.slice(++nextLinePosition);
        importedRowCount++;

        const parsedOffer = this.parseLineToOffer(completeRow);
        this.emit('line', parsedOffer);
      }
    }

    this.emit('end', importedRowCount);

  }
}
