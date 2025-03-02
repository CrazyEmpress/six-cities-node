import { Command } from './command.interface.js';

import { MockServerData } from '../../shared/types/index.js';
import { TSVOfferGenerator } from '../../shared/libs/offer-generator/tsv-offer-generator.js';

import got from 'got';
import chalk from 'chalk';
import { TSVFileWriter } from '../../shared/libs/file-writer/tsv-file-writer.js';
import { getErrorMessage } from '../../shared/helpers/common.js';

export class GenerateCommand implements Command {
  private readonly RADIX = 10;
  private initialData: MockServerData;

  public getName(): string {
    return '--generate';
  }

  private async load(url: string) {
    try {
      this.initialData = await got.get(url).json();
    } catch {
      throw new Error(`Can't load data from ${url}`);
    }
  }

  public async execute(...parameters: string[]): Promise<void> {
    const [rowsCount, filePath, serverUrl] = parameters;
    const count = Number.parseInt(rowsCount, this.RADIX);

    if (!filePath) {
      throw new Error('File path is not specified');
    }

    if (!serverUrl) {
      throw new Error('Server URL is not specified');
    }

    try {
      await this.load(serverUrl);
      await this.write(filePath, count);
      console.info(chalk.bgWhiteBright(`File ${filePath} was created!`));
    } catch (error: unknown) {
      getErrorMessage(error);
    }
  }

  private async write(filePath: string, offerCount: number): Promise<void> {
    const tsvOfferGenerator = new TSVOfferGenerator(this.initialData);
    const tsvFileWriter = new TSVFileWriter(filePath);

    for (let i = 0; i < offerCount; i++) {
      await tsvFileWriter.write(tsvOfferGenerator.generate());
    }
  }
}
